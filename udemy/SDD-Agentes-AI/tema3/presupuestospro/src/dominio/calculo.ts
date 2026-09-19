// Unico sitio del sistema donde se calcula el dinero (FR-006, FR-007, FR-008).
// La interfaz y el PDF consultan estos importes; nunca recalculan por su cuenta.

import type { LineaPresupuesto, TipoCliente, TipoRetencion } from './tipos'

/** Tipo de IVA vigente, definido en un unico punto del codigo. */
export const TIPO_IVA = 21

export interface Totales {
  baseImponible: number
  iva: number
  /** Siempre positiva: el signo negativo se pone al presentarla. */
  retencion: number
  total: number
  /** Falso para clientes particulares, aunque la casilla este marcada (FR-008). */
  aplicaRetencion: boolean
}

/** Lo minimo que hace falta para calcular: asi tambien sirve para un borrador. */
export interface PresupuestoCalculable {
  lineas: LineaPresupuesto[]
  cliente: { tipo: TipoCliente }
  retencionActivada: boolean
  tipoRetencion: TipoRetencion
}

/**
 * Redondeo a centimos en modo half-up real: 1,005 € debe dar 1,01 €.
 * Un Math.round directo devolveria 1,00 € porque 1.005 * 100 se representa en
 * binario como 100.49999999999999.
 */
export function redondearCentimos(importe: number): number {
  if (!Number.isFinite(importe)) return 0
  const signo = importe < 0 ? -1 : 1
  const escalado = Number((Math.abs(importe) * 100).toPrecision(15))
  const resultado = (signo * Math.round(escalado)) / 100
  // `|| 0` evita devolver -0.
  return resultado || 0
}

/** Importe de una linea. No se guarda nunca: se deriva siempre de sus dos campos. */
export function importeLinea(linea: LineaPresupuesto): number {
  return linea.cantidad * linea.precioUnitario
}

/**
 * Orden exacto de data-model.md. Los calculos intermedios mantienen precision
 * completa; el redondeo se aplica solo a los cuatro importes que se muestran.
 */
export function calcularPresupuesto(presupuesto: PresupuestoCalculable): Totales {
  const baseImponible = presupuesto.lineas.reduce((suma, linea) => suma + importeLinea(linea), 0)
  const iva = baseImponible * (TIPO_IVA / 100)

  const aplicaRetencion = presupuesto.retencionActivada && presupuesto.cliente.tipo === 'empresa'
  const retencion = aplicaRetencion ? baseImponible * (presupuesto.tipoRetencion / 100) : 0

  const total = baseImponible + iva - retencion

  return {
    baseImponible: redondearCentimos(baseImponible),
    iva: redondearCentimos(iva),
    retencion: redondearCentimos(retencion),
    total: redondearCentimos(total),
    aplicaRetencion,
  }
}
