// Construcción del PDF que recibe el cliente final.
//
// CONTENIDO: lo fija specs/001-presupuestos-freelancer/contracts/pdf-documento.md
//   y no cambia ni un carácter.
// PRESENTACIÓN: la fija specs/002-inicio-y-rediseno/contracts/pdf-presentacion.md
//   y bebe de los mismos tokens que la pantalla, a través de src/estilos/tokens.ts.
//
// Los importes NO se recalculan aquí de otra forma: se piden a dominio/calculo.ts,
// el mismo módulo que alimenta la pantalla, para que PDF y pantalla coincidan siempre.
//
// NINGÚN TAMAÑO SE ESCRIBE A MANO (FR-051): todos salen de la escala tipográfica
// del sistema visual con la conversión declarada 1 rem = 9 pt, y todas las
// separaciones entre bloques salen de la escala de espaciado. El documento es más
// denso que una pantalla —por eso 9 y no 12— y esa densidad es una decisión
// escrita, no un descuido (Decisión 4 de research.md).

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { TIPO_IVA, calcularPresupuesto, importeLinea } from '../dominio/calculo'
import { formatearEuros, formatearFecha, textoDeNumero } from '../dominio/formato'
import type { Perfil, Presupuesto } from '../dominio/tipos'
import { colorPdf, espacioPdf, interlineadoPdf, tamanoPdf } from '../estilos/tokens'

// Geometria del papel, no del sistema visual: un A4 mide lo que mide y los
// margenes los fija el contrato de contenido de la 001. No son tokens y no
// pueden serlo; quedan aqui justificados por escrito (FR-051).
const MARGEN = 15
const ANCHO_PAGINA = 210
const ALTO_PAGINA = 297
const DERECHA = ANCHO_PAGINA - MARGEN
const LOGO_ANCHO_MAXIMO = 40
const LOGO_ALTO_MAXIMO = 24

/** Banda de acento de la cabecera: da carácter sin ensuciar la información. */
const ALTO_BANDA = 4

export function nombreArchivoPdf(presupuesto: Presupuesto): string {
  return `Presupuesto-${presupuesto.numero}.pdf`
}

/** Construye el documento completo, sin descargarlo. */
export function construirDocumento(presupuesto: Presupuesto, perfil: Perfil): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  // La familia de métricas que el PDF lleva de serie. El documento NO incrusta
  // tipografías (FR-052): una fuente incrustada se repite en cada PDF y el coste
  // de una exportación en lote se multiplicaría por el número de presupuestos.
  doc.setFont('helvetica', 'normal')

  const tema = leerTema()

  dibujarBanda(doc, tema)
  const finCabecera = dibujarCabecera(doc, presupuesto, perfil, tema)
  const finDestinatario = dibujarDestinatario(doc, presupuesto, tema, finCabecera + tema.aireBloque)
  const finTabla = dibujarLineas(doc, presupuesto, tema, finDestinatario + tema.aireMedio)
  dibujarDesglose(doc, presupuesto, tema, finTabla + tema.aireBloque)

  return doc
}

/** Genera el PDF y lo descarga con el nombre Presupuesto-AAAA-NNN.pdf. */
export function generarPdf(presupuesto: Presupuesto, perfil: Perfil): void {
  construirDocumento(presupuesto, perfil).save(nombreArchivoPdf(presupuesto))
}

interface Tema {
  tinta: [number, number, number]
  tintaSuave: [number, number, number]
  linea: [number, number, number]
  lineaFuerte: [number, number, number]
  acento: [number, number, number]
  acentoSuave: [number, number, number]
  papel: [number, number, number]
  /** Tamaños en puntos, derivados de la escala del sistema. */
  apoyo: number
  base: number
  seccion: number
  titulo: number
  total: number
  /** Separaciones en milímetros, derivadas de la escala de espaciado. */
  aireBloque: number
  aireMedio: number
  aireCorto: number
  /** Alto de una línea de texto normal, en milímetros. */
  renglon: number
}

/** Los mismos tokens que la pantalla. Si alguno no se puede leer, se usa su respaldo. */
function leerTema(): Tema {
  return {
    tinta: colorPdf('--color-tinta'),
    tintaSuave: colorPdf('--color-tinta-suave'),
    linea: colorPdf('--color-linea'),
    lineaFuerte: colorPdf('--color-linea-fuerte'),
    acento: colorPdf('--color-acento'),
    acentoSuave: colorPdf('--color-acento-suave'),
    papel: colorPdf('--color-papel'),
    apoyo: tamanoPdf('--tipo-apoyo'),
    base: tamanoPdf('--tipo-base'),
    seccion: tamanoPdf('--tipo-seccion'),
    titulo: tamanoPdf('--tipo-titulo'),
    total: tamanoPdf('--tipo-total'),
    aireBloque: espacioPdf('--espacio-7'),
    aireMedio: espacioPdf('--espacio-6'),
    aireCorto: espacioPdf('--espacio-5'),
    renglon: interlineadoPdf('--tipo-base'),
  }
}

function dibujarBanda(doc: jsPDF, tema: Tema): void {
  doc.setFillColor(...tema.acento)
  doc.rect(0, 0, ANCHO_PAGINA, ALTO_BANDA, 'F')
}

/** Logo y datos del freelancer a la izquierda; identificación del presupuesto a la derecha. */
function dibujarCabecera(doc: jsPDF, presupuesto: Presupuesto, perfil: Perfil, tema: Tema): number {
  const ARRIBA = MARGEN + ALTO_BANDA
  let yIzquierda = ARRIBA

  if (perfil.logo) {
    const { ancho, alto } = medidasLogo(perfil.logo.ancho, perfil.logo.alto)
    try {
      doc.addImage(
        perfil.logo.datos,
        formatoImagen(perfil.logo.datos),
        MARGEN,
        yIzquierda,
        ancho,
        alto,
      )
      // Aire entre el logo y el nombre: el acento de la banda y los colores del
      // logo se separan en vez de teñirse el uno al otro (D5 de las Clarifications).
      yIzquierda += alto + tema.aireCorto
    } catch {
      // Un logo ilegible no puede impedir que el presupuesto salga: se omite y sigue.
    }
  }

  // Sin logo, el bloque del emisor sube hasta arriba y no queda hueco (FR-023).
  doc.setFontSize(tema.seccion)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...tema.tinta)
  if (perfil.nombre.trim() !== '') {
    doc.text(perfil.nombre, MARGEN, yIzquierda + tema.aireCorto / 2)
    yIzquierda += tema.renglon
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(tema.base)
  doc.setTextColor(...tema.tintaSuave)
  const datosEmisor = [
    perfil.nif.trim() !== '' ? `NIF: ${perfil.nif}` : null,
    ...lineasDeTexto(perfil.contacto),
  ].filter((linea): linea is string => linea !== null)

  for (const linea of datosEmisor) {
    yIzquierda += tema.renglon
    doc.text(linea, MARGEN, yIzquierda)
  }

  // Bloque derecho: título, número y fechas. El título baja de rango porque el
  // elemento mayor del documento pasa a ser el total a pagar (FR-011).
  let yDerecha = ARRIBA + tema.aireCorto
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(tema.titulo)
  doc.setTextColor(...tema.acento)
  doc.text('Presupuesto', DERECHA, yDerecha, { align: 'right' })

  yDerecha += tema.aireMedio
  doc.setFontSize(tema.seccion)
  doc.setTextColor(...tema.tinta)
  doc.text(presupuesto.numero, DERECHA, yDerecha, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(tema.base)
  doc.setTextColor(...tema.tintaSuave)
  yDerecha += tema.aireCorto
  doc.text(`Fecha de emisión: ${formatearFecha(presupuesto.fechaEmision)}`, DERECHA, yDerecha, {
    align: 'right',
  })
  yDerecha += tema.renglon
  doc.text(`Válido hasta el ${formatearFecha(presupuesto.fechaValidez)}`, DERECHA, yDerecha, {
    align: 'right',
  })

  return Math.max(yIzquierda, yDerecha)
}

/** Datos del cliente tal como estaban al crear el presupuesto (FR-016 de la 001). */
function dibujarDestinatario(doc: jsPDF, presupuesto: Presupuesto, tema: Tema, y: number): number {
  let cursor = y

  doc.setDrawColor(...tema.linea)
  doc.setLineWidth(0.2)
  doc.line(MARGEN, cursor - tema.aireCorto, DERECHA, cursor - tema.aireCorto)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(tema.apoyo)
  doc.setTextColor(...tema.tintaSuave)
  // El rótulo se queda tal cual estaba: cambiarlo, aunque sea de caja, sería
  // tocar el contenido del documento, y el contrato solo permite tocar su cara.
  doc.text('Presupuesto para', MARGEN, cursor)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(tema.seccion)
  doc.setTextColor(...tema.tinta)
  cursor += tema.aireCorto
  doc.text(presupuesto.cliente.nombre, MARGEN, cursor)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(tema.base)
  doc.setTextColor(...tema.tintaSuave)
  const datosCliente = [
    presupuesto.cliente.nif.trim() !== '' ? `NIF: ${presupuesto.cliente.nif}` : null,
    ...lineasDeTexto(presupuesto.cliente.contacto),
  ].filter((linea): linea is string => linea !== null)

  for (const linea of datosCliente) {
    cursor += tema.renglon
    doc.text(linea, MARGEN, cursor)
  }

  return cursor
}

/** Tabla de líneas. Si no caben, continúa en la página siguiente repitiendo la cabecera. */
function dibujarLineas(doc: jsPDF, presupuesto: Presupuesto, tema: Tema, y: number): number {
  autoTable(doc, {
    startY: y,
    margin: { left: MARGEN, right: MARGEN, top: MARGEN, bottom: MARGEN },
    head: [['Descripción', 'Cantidad', 'Precio unitario', 'Importe']],
    body: presupuesto.lineas.map((linea) => [
      linea.descripcion,
      textoDeNumero(linea.cantidad),
      formatearEuros(linea.precioUnitario),
      formatearEuros(importeLinea(linea)),
    ]),
    // La cabecera se repite en cada página cuando el presupuesto es largo (FR-022).
    showHead: 'everyPage',
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: tema.base,
      cellPadding: {
        top: espacioPdf('--espacio-3'),
        right: espacioPdf('--espacio-2'),
        bottom: espacioPdf('--espacio-3'),
        left: 0,
      },
      textColor: tema.tinta,
      lineColor: tema.linea,
      lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
    },
    // La cabecera estructura la tabla, así que lleva el tono de línea que
    // estructura, no el de separar filas.
    headStyles: {
      fontSize: tema.apoyo,
      fontStyle: 'bold',
      textColor: tema.tintaSuave,
      lineColor: tema.lineaFuerte,
      lineWidth: { top: 0, right: 0, bottom: 0.5, left: 0 },
    },
    columnStyles: {
      1: { halign: 'right', cellWidth: 20 },
      2: { halign: 'right', cellWidth: 32 },
      3: { halign: 'right', cellWidth: 32, fontStyle: 'bold' },
    },
  })

  const tabla = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable
  return tabla?.finalY ?? y
}

/** Base, IVA, retención (solo si se aplica) y total. Nunca se parte entre páginas. */
function dibujarDesglose(doc: jsPDF, presupuesto: Presupuesto, tema: Tema, y: number): void {
  const totales = calcularPresupuesto(presupuesto)

  const filas: Array<[string, string]> = [
    ['Base imponible', formatearEuros(totales.baseImponible)],
    [`IVA (${TIPO_IVA} %)`, formatearEuros(totales.iva)],
  ]
  if (totales.aplicaRetencion) {
    filas.push([
      `Retención de IRPF (-${presupuesto.tipoRetencion} %)`,
      formatearEuros(-totales.retencion),
    ])
  }

  const ANCHO_BLOQUE = 78
  const altoFila = tema.renglon
  // El total sube de rango, así que su franja crece con él en vez de quedarse en
  // una medida escrita a mano. Es el requisito con más riesgo de esta revisión.
  const altoTotal = puntosAMm(tema.total) + tema.aireCorto
  const altoBloque = filas.length * altoFila + altoTotal + tema.aireMedio

  // Si no cabe entero, pasa entero a la página siguiente (FR-022).
  let cursor = y
  if (cursor + altoBloque > ALTO_PAGINA - MARGEN) {
    doc.addPage()
    cursor = MARGEN + ALTO_BANDA
    dibujarBanda(doc, tema)
  }

  const izquierda = DERECHA - ANCHO_BLOQUE

  // El desglose es un bloque destacado, con el mismo relleno teñido que en
  // pantalla: la aplicación y el documento comparten color, aire y jerarquía.
  doc.setFillColor(...tema.acentoSuave)
  doc.rect(
    izquierda - tema.aireCorto,
    cursor - tema.aireCorto,
    ANCHO_BLOQUE + tema.aireCorto,
    filas.length * altoFila + tema.aireCorto,
    'F',
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(tema.base)
  for (const [etiqueta, importe] of filas) {
    doc.setTextColor(...tema.tintaSuave)
    doc.text(etiqueta, izquierda, cursor)
    doc.setTextColor(...tema.tinta)
    doc.text(importe, DERECHA, cursor, { align: 'right' })
    cursor += altoFila
  }

  // El total: el elemento tipográficamente mayor del documento (FR-011).
  doc.setFillColor(...tema.acento)
  doc.rect(izquierda - tema.aireCorto, cursor, ANCHO_BLOQUE + tema.aireCorto, altoTotal, 'F')

  doc.setTextColor(...tema.papel)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(tema.base)
  doc.text('Total a pagar', izquierda, cursor + altoTotal / 2 + puntosAMm(tema.base) / 3)
  doc.setFontSize(tema.total)
  doc.text(
    formatearEuros(totales.total),
    DERECHA - tema.aireCorto / 2,
    cursor + altoTotal / 2 + puntosAMm(tema.total) / 3,
    { align: 'right' },
  )
}

/** Máximo 40 mm de ancho, respetando la proporción original del logo. */
function medidasLogo(anchoOriginal: number, altoOriginal: number): { ancho: number; alto: number } {
  if (!(anchoOriginal > 0) || !(altoOriginal > 0)) {
    return { ancho: LOGO_ANCHO_MAXIMO, alto: LOGO_ANCHO_MAXIMO / 4 }
  }

  let ancho = LOGO_ANCHO_MAXIMO
  let alto = (altoOriginal / anchoOriginal) * ancho

  if (alto > LOGO_ALTO_MAXIMO) {
    alto = LOGO_ALTO_MAXIMO
    ancho = (anchoOriginal / altoOriginal) * alto
  }

  return { ancho, alto }
}

/** Los tamaños llegan en puntos y el documento se dibuja en milímetros. */
function puntosAMm(puntos: number): number {
  return (puntos * 25.4) / 72
}

function formatoImagen(datos: string): 'PNG' | 'JPEG' {
  return datos.startsWith('data:image/png') ? 'PNG' : 'JPEG'
}

function lineasDeTexto(texto: string): string[] {
  return texto
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea !== '')
}
