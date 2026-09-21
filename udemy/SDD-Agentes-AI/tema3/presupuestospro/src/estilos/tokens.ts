// Los tokens visuales viven en un único sitio: el bloque :root de global.css.
// Este módulo es el puente para quien no puede leer CSS: el generador del PDF.
// Así cambiar el acento o la escala en una línea lo cambia en las seis pantallas
// Y en el documento que recibe el cliente (Decisión 1 de research.md).
//
// POR QUÉ ESTO FUNCIONA: el navegador devuelve el texto del token tal y como
// está escrito, sin resolver. Por eso el contrato del sistema visual exige que
// todo token que el PDF lea sea un VALOR PLANO. Si alguno se convirtiera en una
// expresión calculada, aquí llegaría una fórmula, se usaría el respaldo y el
// documento saldría con colores o tamaños equivocados sin que nadie se enterase.

/** Color en los tres números que entiende jsPDF. */
export type ColorPdf = [number, number, number]

/**
 * La conversión declarada de la escala del sistema al documento: **1 rem = 9 pt**.
 *
 * No es la conversión directa (1 rem = 16 px = 12 pt) a propósito: con 12 pt de
 * texto base la tabla de líneas crecería un tercio, un presupuesto largo ocuparía
 * más páginas y el archivo pesaría más, contra FR-053. El documento es más denso
 * que una pantalla, y siempre lo fue (Decisión 4 de research.md).
 */
export const PUNTOS_POR_REM = 9

/** 1 pulgada = 72 pt = 25,4 mm. El documento se dibuja en milímetros. */
const MM_POR_PUNTO = 25.4 / 72

const RESPALDO_COLOR: Record<string, ColorPdf> = {
  '--color-tinta': [36, 26, 21],
  '--color-tinta-suave': [122, 106, 98],
  '--color-linea': [240, 226, 216],
  '--color-linea-fuerte': [224, 203, 189],
  '--color-fondo': [255, 248, 243],
  '--color-papel': [255, 255, 255],
  '--color-acento': [179, 74, 37],
  '--color-acento-suave': [251, 235, 227],
  '--color-atencion': [138, 90, 14],
  '--color-error': [163, 42, 34],
}

/** En rem, igual que en el CSS. Solo los tokens que el documento necesita. */
const RESPALDO_MEDIDA: Record<string, number> = {
  '--tipo-apoyo': 0.875,
  '--tipo-base': 1,
  '--tipo-seccion': 1.25,
  '--tipo-titulo': 1.75,
  '--tipo-total': 2,
  '--espacio-1': 0.25,
  '--espacio-2': 0.5,
  '--espacio-3': 0.75,
  '--espacio-4': 1,
  '--espacio-5': 1.5,
  '--espacio-6': 2,
  '--espacio-7': 3,
  '--linea-normal': 1.55,
  '--linea-apretada': 1.15,
}

/**
 * Lee un color del bloque de tokens y lo devuelve listo para jsPDF.
 *
 * Si no se puede leer —porque el documento aún no existe o el token cambió de
 * nombre— devuelve el valor de respaldo en lugar de fallar: un PDF que no sale
 * es un problema mucho peor que un PDF con un gris ligeramente distinto.
 */
export function colorPdf(token: keyof typeof RESPALDO_COLOR | string): ColorPdf {
  const respaldo = RESPALDO_COLOR[token] ?? RESPALDO_COLOR['--color-tinta']

  try {
    const crudo = getComputedStyle(document.documentElement).getPropertyValue(token)
    return aRgb(crudo.trim()) ?? respaldo
  } catch {
    return respaldo
  }
}

/** Un tamaño de letra del sistema, en puntos: lo que entiende jsPDF. */
export function tamanoPdf(token: string): number {
  return redondear(remDeToken(token) * PUNTOS_POR_REM)
}

/** Un peldaño de la escala de espaciado, en milímetros: lo que dibuja el documento. */
export function espacioPdf(token: string): number {
  return redondear(remDeToken(token) * PUNTOS_POR_REM * MM_POR_PUNTO)
}

/** El alto de una línea de texto de ese tamaño, en milímetros. */
export function interlineadoPdf(tokenTamano: string, tokenLinea = '--linea-normal'): number {
  return redondear(tamanoPdf(tokenTamano) * MM_POR_PUNTO * remDeToken(tokenLinea))
}

/** El valor numérico de un token de medida, en rem, con su respaldo. */
function remDeToken(token: string): number {
  const respaldo = RESPALDO_MEDIDA[token] ?? 1

  try {
    const crudo = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
    // Un token plano es «1.75rem» o «1.55». Cualquier otra cosa —una expresión
    // calculada— no es interpretable aquí y cae al respaldo, como manda el contrato.
    const medida = /^(-?[\d.]+)(rem)?$/.exec(crudo)
    if (!medida) return respaldo

    const valor = Number.parseFloat(medida[1])
    return Number.isFinite(valor) ? valor : respaldo
  } catch {
    return respaldo
  }
}

/** Dos decimales: más precisión no se ve en un papel y ensucia las comparaciones. */
function redondear(valor: number): number {
  return Math.round(valor * 100) / 100
}

/** Convierte `#1b5e8f`, `#abc` o `rgb(27, 94, 143)` en [r, g, b]. */
function aRgb(valor: string): ColorPdf | null {
  if (valor === '') return null

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(valor)
  if (hex) {
    const digitos =
      hex[1].length === 3
        ? hex[1]
            .split('')
            .map((d) => d + d)
            .join('')
        : hex[1]
    return [
      Number.parseInt(digitos.slice(0, 2), 16),
      Number.parseInt(digitos.slice(2, 4), 16),
      Number.parseInt(digitos.slice(4, 6), 16),
    ]
  }

  const funcional = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(valor)
  if (funcional) {
    return [
      Math.round(Number(funcional[1])),
      Math.round(Number(funcional[2])),
      Math.round(Number(funcional[3])),
    ]
  }

  return null
}
