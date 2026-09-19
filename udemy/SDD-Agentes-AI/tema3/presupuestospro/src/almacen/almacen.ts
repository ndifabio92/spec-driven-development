// Lectura y escritura del documento unico de datos en el navegador.
// Contrato: specs/001-presupuestos-freelancer/contracts/almacen-schema.md

import type { Datos } from '../dominio/tipos'

export const CLAVE_ALMACEN = 'presupuestospro.datos'
export const VERSION_ALMACEN = 1

export interface Lectura {
  datos: Datos
  /** Mensaje para el freelancer cuando los datos guardados no se han podido leer. */
  aviso: string | null
}

export function datosVacios(): Datos {
  return {
    version: VERSION_ALMACEN,
    perfil: { nombre: '', nif: '', contacto: '', logo: null },
    clientes: [],
    servicios: [],
    presupuestos: [],
  }
}

/**
 * Lee el documento guardado. Si falta o es ilegible, arranca con datos vacios
 * y lo dice, en vez de dejar la pantalla en blanco sin explicacion.
 */
export function leerDatos(): Lectura {
  let crudo: string | null = null
  try {
    crudo = window.localStorage.getItem(CLAVE_ALMACEN)
  } catch {
    return {
      datos: datosVacios(),
      aviso:
        'Este navegador no permite guardar datos, quizá porque estás en modo privado. Puedes usar la aplicación, pero al cerrarla se perderá lo que hagas.',
    }
  }

  if (crudo === null) return { datos: datosVacios(), aviso: null }

  try {
    const leido = JSON.parse(crudo) as Partial<Datos>
    return { datos: completar(leido), aviso: null }
  } catch {
    return {
      datos: datosVacios(),
      aviso:
        'No se han podido leer los datos guardados en este navegador, así que la aplicación empieza vacía. Si tenías presupuestos, no crees nada nuevo hasta comprobarlo.',
    }
  }
}

export interface Escritura {
  ok: boolean
  aviso: string | null
}

/** Guarda el documento completo. Si el navegador lo impide, se avisa en pantalla. */
export function escribirDatos(datos: Datos): Escritura {
  try {
    window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(datos))
    return { ok: true, aviso: null }
  } catch {
    return {
      ok: false,
      aviso:
        'No se han podido guardar los cambios en este navegador. Puede que no quede espacio (prueba con un logo más ligero) o que estés en modo privado.',
    }
  }
}

/** Identificador interno, nunca visible para el freelancer. */
export function nuevoId(prefijo: string): string {
  const azar = Math.random().toString(36).slice(2, 6)
  const momento = Date.now().toString(36).slice(-4)
  return `${prefijo}_${momento}${azar}`
}

/** Rellena lo que falte en un documento leido, para que la interfaz nunca reciba huecos. */
function completar(leido: Partial<Datos>): Datos {
  const vacio = datosVacios()
  return {
    version: VERSION_ALMACEN,
    perfil: { ...vacio.perfil, ...(leido.perfil ?? {}) },
    clientes: Array.isArray(leido.clientes) ? leido.clientes : [],
    servicios: Array.isArray(leido.servicios) ? leido.servicios : [],
    presupuestos: Array.isArray(leido.presupuestos) ? leido.presupuestos : [],
  }
}
