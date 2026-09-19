// Construcción del PDF que recibe el cliente final.
//
// CONTENIDO: lo fija specs/001-presupuestos-freelancer/contracts/pdf-documento.md
//   y no cambia ni un carácter.
// PRESENTACIÓN: la fija specs/002-inicio-y-rediseno/contracts/pdf-presentacion.md
//   y bebe de los mismos tokens que la pantalla, a través de src/estilos/tokens.ts.
//
// Los importes NO se recalculan aquí de otra forma: se piden a dominio/calculo.ts,
// el mismo módulo que alimenta la pantalla, para que PDF y pantalla coincidan siempre.

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { TIPO_IVA, calcularPresupuesto, importeLinea } from '../dominio/calculo'
import { formatearEuros, formatearFecha, textoDeNumero } from '../dominio/formato'
import type { Perfil, Presupuesto } from '../dominio/tipos'
import { colorPdf } from '../estilos/tokens'

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
  doc.setFont('helvetica', 'normal')

  const tema = leerTema()

  dibujarBanda(doc, tema)
  const finCabecera = dibujarCabecera(doc, presupuesto, perfil, tema)
  const finDestinatario = dibujarDestinatario(doc, presupuesto, tema, finCabecera + 10)
  const finTabla = dibujarLineas(doc, presupuesto, tema, finDestinatario + 8)
  dibujarDesglose(doc, presupuesto, tema, finTabla + 10)

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
  acento: [number, number, number]
  papel: [number, number, number]
}

/** Los mismos tokens que la pantalla. Si alguno no se puede leer, se usa su respaldo. */
function leerTema(): Tema {
  return {
    tinta: colorPdf('--color-tinta'),
    tintaSuave: colorPdf('--color-tinta-suave'),
    linea: colorPdf('--color-linea'),
    acento: colorPdf('--color-acento'),
    papel: colorPdf('--color-papel'),
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
      doc.addImage(perfil.logo.datos, formatoImagen(perfil.logo.datos), MARGEN, yIzquierda, ancho, alto)
      yIzquierda += alto + 6
    } catch {
      // Un logo ilegible no puede impedir que el presupuesto salga: se omite y sigue.
    }
  }

  // Sin logo, el bloque del emisor sube hasta arriba y no queda hueco (FR-023).
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...tema.tinta)
  if (perfil.nombre.trim() !== '') {
    doc.text(perfil.nombre, MARGEN, yIzquierda + 4)
    yIzquierda += 5
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...tema.tintaSuave)
  const datosEmisor = [
    perfil.nif.trim() !== '' ? `NIF: ${perfil.nif}` : null,
    ...lineasDeTexto(perfil.contacto),
  ].filter((linea): linea is string => linea !== null)

  for (const linea of datosEmisor) {
    yIzquierda += 4.5
    doc.text(linea, MARGEN, yIzquierda)
  }

  // Bloque derecho: título, número y fechas.
  let yDerecha = ARRIBA + 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...tema.acento)
  doc.text('Presupuesto', DERECHA, yDerecha, { align: 'right' })

  yDerecha += 8
  doc.setFontSize(12)
  doc.setTextColor(...tema.tinta)
  doc.text(presupuesto.numero, DERECHA, yDerecha, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...tema.tintaSuave)
  yDerecha += 6
  doc.text(`Fecha de emisión: ${formatearFecha(presupuesto.fechaEmision)}`, DERECHA, yDerecha, {
    align: 'right',
  })
  yDerecha += 4.5
  doc.text(`Válido hasta el ${formatearFecha(presupuesto.fechaValidez)}`, DERECHA, yDerecha, {
    align: 'right',
  })

  return Math.max(yIzquierda, yDerecha)
}

/** Datos del cliente tal como estaban al crear el presupuesto (FR-016 de la 001). */
function dibujarDestinatario(
  doc: jsPDF,
  presupuesto: Presupuesto,
  tema: Tema,
  y: number,
): number {
  let cursor = y

  doc.setDrawColor(...tema.linea)
  doc.setLineWidth(0.2)
  doc.line(MARGEN, cursor - 5, DERECHA, cursor - 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...tema.tintaSuave)
  // El rótulo se queda tal cual estaba: cambiarlo, aunque sea de caja, sería
  // tocar el contenido del documento, y el contrato solo permite tocar su cara.
  doc.text('Presupuesto para', MARGEN, cursor)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...tema.tinta)
  cursor += 6
  doc.text(presupuesto.cliente.nombre, MARGEN, cursor)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...tema.tintaSuave)
  const datosCliente = [
    presupuesto.cliente.nif.trim() !== '' ? `NIF: ${presupuesto.cliente.nif}` : null,
    ...lineasDeTexto(presupuesto.cliente.contacto),
  ].filter((linea): linea is string => linea !== null)

  for (const linea of datosCliente) {
    cursor += 4.5
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
      fontSize: 9.5,
      cellPadding: { top: 2.5, right: 2, bottom: 2.5, left: 0 },
      textColor: tema.tinta,
      lineColor: tema.linea,
      lineWidth: { top: 0, right: 0, bottom: 0.2, left: 0 },
    },
    headStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      textColor: tema.tintaSuave,
      lineColor: tema.tinta,
      lineWidth: { top: 0, right: 0, bottom: 0.4, left: 0 },
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
  const ALTO_TOTAL = 14
  const altoBloque = filas.length * 5.5 + ALTO_TOTAL + 4

  // Si no cabe entero, pasa entero a la página siguiente (FR-022).
  let cursor = y
  if (cursor + altoBloque > ALTO_PAGINA - MARGEN) {
    doc.addPage()
    cursor = MARGEN + ALTO_BANDA
    dibujarBanda(doc, tema)
  }

  const izquierda = DERECHA - ANCHO_BLOQUE

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  for (const [etiqueta, importe] of filas) {
    doc.setTextColor(...tema.tintaSuave)
    doc.text(etiqueta, izquierda, cursor)
    doc.setTextColor(...tema.tinta)
    doc.text(importe, DERECHA, cursor, { align: 'right' })
    cursor += 5.5
  }

  // El total: el dato que el cliente busca, claramente separado del resto.
  cursor += 1
  doc.setFillColor(...tema.acento)
  doc.rect(izquierda - 3, cursor, ANCHO_BLOQUE + 3, ALTO_TOTAL, 'F')

  doc.setTextColor(...tema.papel)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Total a pagar', izquierda, cursor + ALTO_TOTAL / 2 + 1.5)
  doc.setFontSize(14)
  doc.text(formatearEuros(totales.total), DERECHA - 3, cursor + ALTO_TOTAL / 2 + 2, {
    align: 'right',
  })
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

function formatoImagen(datos: string): 'PNG' | 'JPEG' {
  return datos.startsWith('data:image/png') ? 'PNG' : 'JPEG'
}

function lineasDeTexto(texto: string): string[] {
  return texto
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea !== '')
}
