// Los tokens visuales viven en un único sitio: el bloque :root de global.css.
// Este módulo es el puente para quien no puede leer CSS: el generador del PDF.
// Así cambiar el acento en una línea lo cambia en las seis pantallas Y en el
// documento que recibe el cliente (Decisión 1 de research.md).

/** Color en los tres números que entiende jsPDF. */
export type ColorPdf = [number, number, number]

const RESPALDO: Record<string, ColorPdf> = {
  '--color-tinta': [28, 36, 48],
  '--color-tinta-suave': [90, 102, 117],
  '--color-linea': [213, 219, 227],
  '--color-fondo': [244, 246, 249],
  '--color-papel': [255, 255, 255],
  '--color-acento': [19, 75, 114],
  '--color-atencion': [224, 179, 85],
  '--color-error': [163, 39, 31],
}

/**
 * Lee un color del bloque de tokens y lo devuelve listo para jsPDF.
 *
 * Si no se puede leer —porque el documento aún no existe o el token cambió de
 * nombre— devuelve el valor de respaldo en lugar de fallar: un PDF que no sale
 * es un problema mucho peor que un PDF con un gris ligeramente distinto.
 */
export function colorPdf(token: keyof typeof RESPALDO | string): ColorPdf {
  const respaldo = RESPALDO[token] ?? RESPALDO['--color-tinta']

  try {
    const crudo = getComputedStyle(document.documentElement).getPropertyValue(token)
    return aRgb(crudo.trim()) ?? respaldo
  } catch {
    return respaldo
  }
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
