// Orquesta la copia de seguridad: lee lo guardado, construye los documentos,
// los empaqueta y entrega el archivo al navegador.
//
// Vive fuera de dominio/ porque depende del navegador de arriba abajo, y fuera
// de las pantallas porque el botón está en dos sitios (ver Structure Decision
// de plan.md). Las dos reglas deterministas —los nombres y el sobre— sí bajan a
// dominio/ y llevan pruebas.
//
// SOLO LECTURA: aquí no se escribe nunca en el almacén (FR-021).

import { Zip, ZipDeflate } from 'fflate'
import { leerDatos } from '../almacen/almacen'
import { hoyIso } from '../dominio/formato'
import { nombrePdf, nombreUnico, nombreZip } from '../dominio/nombresCopia'
import { situacionDe } from '../dominio/situacion'
import { construirSobre } from '../dominio/sobreCopia'
import type { Datos, Perfil, Presupuesto } from '../dominio/tipos'
import { construirDocumento } from '../pdf/generarPdf'
import { descargar } from './descargar'

/** El archivo de datos se llama siempre así y va uno solo, en la raíz del zip. */
const ARCHIVO_DATOS = 'datos-presupuestospro.json'

export type ResultadoExportacion =
  | {
      estado: 'terminado'
      /** Cuántos presupuestos han generado PDF. */
      documentos: number
      /** Cuántos se han quedado fuera por estar incompletos (FR-018). */
      omitidos: number
    }
  /** No había absolutamente nada guardado: no se descarga nada (FR-016). */
  | { estado: 'nada' }
  /** La copia no ha podido completarse: no se entrega ningún archivo (FR-020). */
  | { estado: 'fallido'; motivo: 'volumen' | 'desconocido' }

export interface OpcionesExportacion {
  /** Se llama al empezar y tras cada documento empaquetado (FR-019). */
  alAvanzar?: (hechos: number, total: number) => void
}

/** Construye la copia y la descarga. Devuelve lo que hay que contarle al freelancer. */
export async function exportarCopia(opciones: OpcionesExportacion = {}): Promise<ResultadoExportacion> {
  const { datos } = leerDatos()
  const hoy = hoyIso()

  // Único caso que no produce archivo: no tener nada de nada (FR-016). Con datos
  // pero sin presupuestos la copia SÍ se genera, con el archivo de datos y sin
  // PDF (FR-017): ver la tabla de data-model.md.
  if (estaTodoVacio(datos)) return { estado: 'nada' }

  // Quién tiene PDF lo decide la situación de la spec 002, consultada con la
  // función que ya existe. Aquí no se escribe ninguna condición nueva (FR-008).
  const completos = datos.presupuestos.filter((presupuesto) => {
    const situacion = situacionDe(presupuesto, hoy)
    return situacion === 'Vigente' || situacion === 'Caducado'
  })

  const avanzar = opciones.alAvanzar ?? (() => {})

  try {
    const partes: Uint8Array[] = []
    let fallo: Error | null = null

    // Empaquetado en streaming: cada archivo entra y se suelta antes de preparar el
    // siguiente, para que el pico de memoria sea el archivo final más un documento
    // y no la suma de todos (Decisión 3 de research.md).
    const zip = new Zip((error, trozo) => {
      if (error) fallo = error
      else partes.push(trozo)
    })

    avanzar(0, completos.length)
    // Se cede el control ANTES del primer documento: si no, el primer PDF ocupa
    // el hilo que pinta la pantalla y el progreso no llega a verse (SC-008).
    await cederElControl()

    const usados = new Set<string>()
    for (const presupuesto of completos) {
      const nombre = nombreUnico(nombrePdf(presupuesto.numero, presupuesto.cliente.nombre), usados)
      usados.add(nombre)
      anadirArchivo(zip, nombre, bytesDelPdf(presupuesto, datos.perfil))
      if (fallo) throw fallo

      avanzar(usados.size, completos.length)
      // Generar un PDF ocupa el mismo hilo que dibuja la pantalla: sin esta cesión
      // el progreso se calcula pero no se pinta nunca (Decisión 4 de research.md).
      await cederElControl()
    }

    // El archivo de datos va al final, en la raíz: perfil con logo, la agenda de
    // clientes entera, el catálogo y TODOS los presupuestos, borradores incluidos
    // (FR-013). Se sirve envuelto en su marca de identidad (FR-014a).
    const sobre = construirSobre(datos, new Date())
    anadirArchivo(zip, ARCHIVO_DATOS, new TextEncoder().encode(JSON.stringify(sobre)))

    zip.end()
    if (fallo) throw fallo

    descargar(partes, nombreZip(hoy))

    return {
      estado: 'terminado',
      documentos: completos.length,
      omitidos: datos.presupuestos.length - completos.length,
    }
  } catch (error) {
    // Nada que deshacer: no se ha escrito en el almacén y no se ha entregado
    // ningún archivo. Una exportación da un archivo entero o ninguno (FR-020a).
    return { estado: 'fallido', motivo: esFaltaDeMemoria(error) ? 'volumen' : 'desconocido' }
  }
}

/**
 * Los bytes del mismo documento que el freelancer descarga uno a uno.
 *
 * Se llama a construirDocumento() y no se escribe ninguna variante "para lotes":
 * un único camino hacia el PDF es lo que convierte FR-007 en una propiedad de la
 * estructura en vez de en algo que haya que comprobar (Decisión 2 de research.md).
 */
function bytesDelPdf(presupuesto: Presupuesto, perfil: Perfil): Uint8Array {
  return new Uint8Array(construirDocumento(presupuesto, perfil).output('arraybuffer'))
}

/** Añade un archivo ya completo al zip y lo suelta en el mismo paso. */
function anadirArchivo(zip: Zip, nombre: string, contenido: Uint8Array): void {
  const archivo = new ZipDeflate(nombre)
  zip.add(archivo)
  archivo.push(contenido, true)
}

/** Devuelve el hilo al navegador el tiempo justo para que repinte la pantalla. */
function cederElControl(): Promise<void> {
  return new Promise((seguir) => setTimeout(seguir, 0))
}

function estaTodoVacio(datos: Datos): boolean {
  const { nombre, nif, contacto, logo } = datos.perfil
  const perfilVacio =
    nombre.trim() === '' && nif.trim() === '' && contacto.trim() === '' && logo === null

  return (
    perfilVacio &&
    datos.clientes.length === 0 &&
    datos.servicios.length === 0 &&
    datos.presupuestos.length === 0
  )
}

/**
 * El techo de esta operación es la memoria, y lo marca el tamaño del logo
 * multiplicado por el número de presupuestos, porque el logo se incrusta entero
 * en cada PDF (Decisión 3 de research.md). Cuando se alcanza, el navegador falla
 * al reservar el siguiente bloque, y eso es lo que se reconoce aquí para poder
 * decírselo al freelancer en sus términos (FR-020a).
 */
function esFaltaDeMemoria(error: unknown): boolean {
  if (error instanceof RangeError) return true
  const texto = error instanceof Error ? `${error.name} ${error.message}` : String(error)
  return /allocation|out of memory|heap|Invalid (array|string|typed array) length/i.test(texto)
}
