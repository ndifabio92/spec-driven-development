import { describe, it, expect } from 'vitest'
import { formatearEuros, formatearFecha, leerNumero, textoDeNumero, hoyIso, sumarDias } from './formato'

describe('formatearEuros', () => {
  it('escribe los importes como los espera un cliente espanol', () => {
    expect(formatearEuros(1500)).toBe('1.500,00 €')
  })

  it('escribe los importes negativos con su signo', () => {
    expect(formatearEuros(-300)).toBe('-300,00 €')
  })

  it('siempre muestra dos decimales', () => {
    expect(formatearEuros(0)).toBe('0,00 €')
    expect(formatearEuros(2000)).toBe('2.000,00 €')
    expect(formatearEuros(2120)).toBe('2.120,00 €')
    expect(formatearEuros(1.5)).toBe('1,50 €')
  })

  it('no arrastra el cero negativo a la pantalla', () => {
    expect(formatearEuros(-0)).toBe('0,00 €')
  })
})

describe('formatearFecha', () => {
  it('convierte AAAA-MM-DD en dd/mm/aaaa', () => {
    expect(formatearFecha('2026-09-18')).toBe('18/09/2026')
  })

  it('mantiene el dia aunque el mes o el dia sean de una cifra', () => {
    expect(formatearFecha('2026-10-18')).toBe('18/10/2026')
    expect(formatearFecha('2026-01-05')).toBe('05/01/2026')
  })
})

describe('leerNumero', () => {
  it('entiende los numeros escritos con coma decimal', () => {
    expect(leerNumero('2,5')).toBe(2.5)
    expect(leerNumero('1500')).toBe(1500)
    expect(leerNumero('1.500,50')).toBe(1500.5)
    expect(leerNumero(' 0,75 ')).toBe(0.75)
  })

  it('tambien entiende el punto decimal, por si se escribe asi', () => {
    expect(leerNumero('2.5')).toBe(2.5)
  })

  it('devuelve null cuando lo escrito no es un numero', () => {
    expect(leerNumero('')).toBeNull()
    expect(leerNumero('   ')).toBeNull()
    expect(leerNumero('dos')).toBeNull()
    expect(leerNumero('1,2,3')).toBeNull()
  })
})

describe('textoDeNumero', () => {
  it('devuelve el numero con coma decimal para poder editarlo', () => {
    expect(textoDeNumero(2.5)).toBe('2,5')
    expect(textoDeNumero(1500)).toBe('1500')
  })
})

describe('fechas del presupuesto', () => {
  it('la validez son 30 dias desde la emision (FR-010)', () => {
    expect(sumarDias('2026-09-18', 30)).toBe('2026-10-18')
  })

  it('cruza bien el cambio de mes y de ano', () => {
    expect(sumarDias('2026-12-20', 30)).toBe('2027-01-19')
  })

  it('hoyIso devuelve una fecha con formato AAAA-MM-DD', () => {
    expect(hoyIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
