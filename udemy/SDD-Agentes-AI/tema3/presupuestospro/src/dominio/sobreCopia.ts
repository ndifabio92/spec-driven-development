// El sobre que envuelve los datos dentro de la copia.
// Contrato exacto: specs/003-exportar-copia-zip/contracts/archivo-datos.md
//
// Es el único puente con una funcionalidad que todavía no existe —restaurar— y
// por eso este formato ya no se puede cambiar retroactivamente: las copias que
// el freelancer haga hoy tendrán que leerse dentro de dos años.
//
// El momento entra como parámetro: aquí no se consulta el reloj del navegador.

import type { Datos } from './tipos'

/** Versión del SOBRE. Sube si algún día la copia lleva algo más. */
export const FORMATO_COPIA = 1

/** Texto fijo que permite reconocer la copia sin interpretarla a mano. */
export const APLICACION = 'PresupuestosPro'

export interface SobreCopia {
  aplicacion: typeof APLICACION
  formatoCopia: typeof FORMATO_COPIA
  /** Fecha y hora de la exportación, con zona horaria. */
  exportadoEl: string
  /** El documento guardado, sin tocar. */
  datos: Datos
}

/**
 * Envuelve el documento guardado con su marca de identidad (FR-014a).
 *
 * `datos` se referencia tal cual, sin copiar ni transformar: restaurar será
 * validar el sobre y devolver esto a su sitio. Si el sobre modificara los datos,
 * restaurar dejaría de ser una devolución y pasaría a ser una traducción, y las
 * traducciones se estropean.
 *
 * Dos números de versión, y son dos a propósito: `formatoCopia` describe el sobre
 * y `datos.version` describe el modelo de datos. Cambian por motivos distintos.
 */
export function construirSobre(datos: Datos, momento: Date): SobreCopia {
  return {
    aplicacion: APLICACION,
    formatoCopia: FORMATO_COPIA,
    exportadoEl: momento.toISOString(),
    datos,
  }
}
