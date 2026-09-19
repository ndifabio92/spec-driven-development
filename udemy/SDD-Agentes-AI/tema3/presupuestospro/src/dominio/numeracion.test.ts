import { describe, it, expect } from 'vitest'
import { siguienteNumero } from './numeracion'

function conNumeros(...numeros: string[]) {
  return numeros.map((numero) => ({ numero }))
}

describe('siguienteNumero (FR-009)', () => {
  it('el primer presupuesto del ano es el 001', () => {
    expect(siguienteNumero([], 2026)).toBe('2026-001')
  })

  it('el siguiente es el 002', () => {
    expect(siguienteNumero(conNumeros('2026-001'), 2026)).toBe('2026-002')
  })

  it('el contador se reinicia al cambiar de ano', () => {
    expect(siguienteNumero(conNumeros('2026-001', '2026-002'), 2027)).toBe('2027-001')
  })

  it('no reutiliza numeros aunque los presupuestos no esten ordenados', () => {
    expect(siguienteNumero(conNumeros('2026-003', '2026-001', '2026-002'), 2026)).toBe('2026-004')
  })

  it('pasa de 999 a 1000 sin tope, en vez de bloquear la creacion', () => {
    const existentes = conNumeros('2026-998', '2026-999')
    expect(siguienteNumero(existentes, 2026)).toBe('2026-1000')
    expect(siguienteNumero(conNumeros('2026-1000'), 2026)).toBe('2026-1001')
  })

  it('ignora los presupuestos de otros anos al calcular el siguiente', () => {
    expect(siguienteNumero(conNumeros('2025-012', '2026-001'), 2026)).toBe('2026-002')
  })

  it('ignora los presupuestos sin numero asignado todavia', () => {
    expect(siguienteNumero(conNumeros('', '2026-001'), 2026)).toBe('2026-002')
  })
})
