import { describe, it, expect } from 'vitest'
import { calcularPresupuesto, redondearCentimos } from './calculo'
import type { LineaPresupuesto, TipoCliente, TipoRetencion } from './tipos'

function linea(descripcion: string, cantidad: number, precioUnitario: number): LineaPresupuesto {
  return { id: descripcion, descripcion, cantidad, precioUnitario, origen: 'manual' }
}

function presupuesto(opciones: {
  lineas: LineaPresupuesto[]
  tipo?: TipoCliente
  retencionActivada?: boolean
  tipoRetencion?: TipoRetencion
}) {
  return {
    lineas: opciones.lineas,
    cliente: { tipo: opciones.tipo ?? 'empresa' },
    retencionActivada: opciones.retencionActivada ?? false,
    tipoRetencion: opciones.tipoRetencion ?? (15 as TipoRetencion),
  }
}

// Las dos lineas del ejemplo de referencia de la spec.
const LINEAS_EJEMPLO = [
  linea('Diseno de pagina web', 1, 1500),
  linea('Sesion de fotos de producto', 1, 500),
]

describe('calcularPresupuesto: ejemplo de referencia de la spec (SC-002)', () => {
  it('empresa con retencion del 15 % da un total de 2.120,00 €', () => {
    const totales = calcularPresupuesto(
      presupuesto({ lineas: LINEAS_EJEMPLO, retencionActivada: true, tipoRetencion: 15 }),
    )
    expect(totales.baseImponible).toBe(2000)
    expect(totales.iva).toBe(420)
    expect(totales.retencion).toBe(300)
    expect(totales.total).toBe(2120)
    expect(totales.aplicaRetencion).toBe(true)
  })

  it('el mismo presupuesto con retencion del 7 % da 2.280,00 €', () => {
    const totales = calcularPresupuesto(
      presupuesto({ lineas: LINEAS_EJEMPLO, retencionActivada: true, tipoRetencion: 7 }),
    )
    expect(totales.retencion).toBe(140)
    expect(totales.total).toBe(2280)
  })

  it('cliente particular con la retencion activada por error: no se aplica y el total es 2.420,00 € (FR-008)', () => {
    const totales = calcularPresupuesto(
      presupuesto({
        lineas: LINEAS_EJEMPLO,
        tipo: 'particular',
        retencionActivada: true,
        tipoRetencion: 15,
      }),
    )
    expect(totales.aplicaRetencion).toBe(false)
    expect(totales.retencion).toBe(0)
    expect(totales.total).toBe(2420)
  })

  it('empresa sin retencion activada tampoco la aplica', () => {
    const totales = calcularPresupuesto(presupuesto({ lineas: LINEAS_EJEMPLO }))
    expect(totales.retencion).toBe(0)
    expect(totales.total).toBe(2420)
  })
})

describe('calcularPresupuesto: casos limite', () => {
  it('un presupuesto sin lineas tiene todos los importes a cero', () => {
    const totales = calcularPresupuesto(presupuesto({ lineas: [] }))
    expect(totales.baseImponible).toBe(0)
    expect(totales.iva).toBe(0)
    expect(totales.retencion).toBe(0)
    expect(totales.total).toBe(0)
  })

  it('admite cantidades con decimales, como 2,5 horas', () => {
    const totales = calcularPresupuesto(presupuesto({ lineas: [linea('Consultoria', 2.5, 60)] }))
    expect(totales.baseImponible).toBe(150)
    expect(totales.iva).toBe(31.5)
    expect(totales.total).toBe(181.5)
  })

  it('los calculos intermedios no se redondean: solo los cuatro importes mostrados', () => {
    // 3 lineas de 0,335 € suman 1,005 €: si se redondeara linea a linea saldria otra cosa.
    const totales = calcularPresupuesto(
      presupuesto({ lineas: [linea('a', 1, 0.335), linea('b', 1, 0.335), linea('c', 1, 0.335)] }),
    )
    expect(totales.baseImponible).toBe(1.01)
  })
})

describe('redondearCentimos', () => {
  it('redondea hacia arriba el medio centimo (half-up), no como Math.round ingenuo', () => {
    expect(redondearCentimos(1.005)).toBe(1.01)
    expect(redondearCentimos(2.675)).toBe(2.68)
    expect(redondearCentimos(0.145)).toBe(0.15)
  })

  it('deja intactos los importes que ya son de dos decimales', () => {
    expect(redondearCentimos(2120)).toBe(2120)
    expect(redondearCentimos(420)).toBe(420)
    expect(redondearCentimos(0)).toBe(0)
  })

  it('los negativos se redondean alejandose del cero', () => {
    expect(redondearCentimos(-1.005)).toBe(-1.01)
    expect(redondearCentimos(-300)).toBe(-300)
  })
})
