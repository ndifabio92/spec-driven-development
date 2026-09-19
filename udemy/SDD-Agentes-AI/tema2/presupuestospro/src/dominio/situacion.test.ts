import { describe, it, expect } from 'vitest'
import { contarPorSituacion, situacionDe } from './situacion'
import type { LineaPresupuesto, Presupuesto } from './tipos'

function linea(): LineaPresupuesto {
  return { id: 'l1', descripcion: 'Diseño', cantidad: 1, precioUnitario: 1500, origen: 'manual' }
}

function presupuesto(cambios: Partial<Presupuesto> = {}): Presupuesto {
  return {
    id: 'pre_1',
    numero: '2026-001',
    fechaEmision: '2026-09-18',
    fechaValidez: '2026-10-18',
    cliente: { nombre: 'Estudio Marbre S.L.', nif: 'B1', contacto: '', tipo: 'empresa' },
    lineas: [linea()],
    retencionActivada: false,
    tipoRetencion: 15,
    ...cambios,
  }
}

const HOY = '2026-09-19'

describe('situacionDe: Vigente', () => {
  it('un presupuesto completo y en plazo está vigente', () => {
    expect(situacionDe(presupuesto(), HOY)).toBe('Vigente')
  })

  it('el propio día de la validez todavía cuenta como vigente', () => {
    // Si esto falla, los presupuestos caducan un día antes de tiempo.
    expect(situacionDe(presupuesto({ fechaValidez: HOY }), HOY)).toBe('Vigente')
  })

  it('una línea con la cantidad o el precio mal puestos no lo convierte en borrador', () => {
    const conErrores = presupuesto({
      lineas: [{ ...linea(), cantidad: 0, precioUnitario: -5 }],
    })
    expect(situacionDe(conErrores, HOY)).toBe('Vigente')
  })
})

describe('situacionDe: Caducado', () => {
  it('cuando la fecha de validez ya ha pasado', () => {
    expect(situacionDe(presupuesto({ fechaValidez: '2026-09-18' }), HOY)).toBe('Caducado')
  })

  it('un solo día de diferencia basta', () => {
    expect(situacionDe(presupuesto({ fechaValidez: '2026-09-18' }), HOY)).toBe('Caducado')
    expect(situacionDe(presupuesto({ fechaValidez: '2026-09-19' }), HOY)).toBe('Vigente')
  })

  it('cruza bien el cambio de año', () => {
    expect(situacionDe(presupuesto({ fechaValidez: '2025-12-31' }), '2026-01-01')).toBe('Caducado')
  })
})

describe('situacionDe: Borrador', () => {
  it('cuando no tiene ninguna línea', () => {
    expect(situacionDe(presupuesto({ lineas: [] }), HOY)).toBe('Borrador')
  })

  it('cuando no tiene nombre de cliente', () => {
    const sinNombre = presupuesto({
      cliente: { nombre: '   ', nif: '', contacto: '', tipo: 'empresa' },
    })
    expect(situacionDe(sinNombre, HOY)).toBe('Borrador')
  })

  it('manda sobre Caducado: un presupuesto incompleto nunca llegó a entregarse (FR-017a)', () => {
    const incompletoYVencido = presupuesto({ lineas: [], fechaValidez: '2026-01-01' })
    expect(situacionDe(incompletoYVencido, HOY)).toBe('Borrador')
  })

  it('cuando no tiene fecha de validez', () => {
    expect(situacionDe(presupuesto({ fechaValidez: '' }), HOY)).toBe('Borrador')
  })
})

describe('contarPorSituacion', () => {
  it('las tres situaciones son excluyentes, así que suman el total (FR-018)', () => {
    const presupuestos = [
      presupuesto({ id: '1' }),
      presupuesto({ id: '2' }),
      presupuesto({ id: '3', lineas: [] }),
      presupuesto({ id: '4', fechaValidez: '2026-01-01' }),
    ]

    const recuento = contarPorSituacion(presupuestos, HOY)

    expect(recuento).toEqual({ Borrador: 1, Vigente: 2, Caducado: 1 })
    expect(recuento.Borrador + recuento.Vigente + recuento.Caducado).toBe(presupuestos.length)
  })

  it('sin presupuestos, las tres situaciones valen cero en vez de faltar', () => {
    expect(contarPorSituacion([], HOY)).toEqual({ Borrador: 0, Vigente: 0, Caducado: 0 })
  })
})
