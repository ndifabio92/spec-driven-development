import { describe, it, expect } from 'vitest'
import { nombrePdf, nombreUnico, nombreZip } from './nombresCopia'

describe('nombreZip', () => {
  it('usa la fecha del día en el mismo orden que las fechas guardadas', () => {
    expect(nombreZip('2026-03-15')).toBe('presupuestospro-copia-2026-03-15.zip')
  })

  it('un cambio de año no altera el patrón', () => {
    expect(nombreZip('2027-01-01')).toBe('presupuestospro-copia-2027-01-01.zip')
  })
})

describe('nombrePdf: el caso corriente', () => {
  it('junta el número y el cliente con un guion', () => {
    expect(nombrePdf('2026-001', 'Estudio García')).toBe('2026-001 - Estudio García.pdf')
  })
})

describe('nombrePdf: regla 1, caracteres que ningún sistema de archivos admite', () => {
  it('la barra se sustituye por un guion', () => {
    expect(nombrePdf('2026-002', 'Diseño/Web S.L.')).toBe('2026-002 - Diseño-Web S.L..pdf')
  })

  it('los dos puntos y las comillas también', () => {
    expect(nombrePdf('2026-003', 'Pérez & Hijos: obra "La Vega"')).toBe(
      '2026-003 - Pérez & Hijos- obra -La Vega-.pdf',
    )
  })

  it('los nueve caracteres prohibidos y los de control se sustituyen', () => {
    expect(nombrePdf('2026-004', 'a/b\\c:d*e?f"g<h>i|j')).toBe('2026-004 - a-b-c-d-e-f-g-h-i-j.pdf')
    expect(nombrePdf('2026-005', 'Antes\u0000y\u001fdespués')).toBe('2026-005 - Antes-y-después.pdf')
  })
})

describe('nombrePdf: regla 2, los acentos y la eñe se conservan', () => {
  it('no se transcriben ni se quitan', () => {
    // Si esto falla, el freelancer encuentra "Diseno Grafico" dentro de su copia.
    expect(nombrePdf('2026-006', 'Diseño Gráfico Ñandú')).toBe('2026-006 - Diseño Gráfico Ñandú.pdf')
  })
})

describe('nombrePdf: regla 3, espacios', () => {
  it('los espacios repetidos se colapsan en uno', () => {
    expect(nombrePdf('2026-007', 'Estudio    García')).toBe('2026-007 - Estudio García.pdf')
  })

  it('los espacios de los extremos se recortan', () => {
    expect(nombrePdf('2026-008', '  Estudio García  ')).toBe('2026-008 - Estudio García.pdf')
  })
})

describe('nombrePdf: regla 4, los puntos se conservan, también el final', () => {
  it('S.L. sigue siendo S.L. y el archivo acaba con dos puntos seguidos', () => {
    // Es correcto: lo que Windows prohíbe es que el nombre TERMINE en punto,
    // y detrás siempre va .pdf.
    expect(nombrePdf('2026-009', 'Marbre S.L.')).toBe('2026-009 - Marbre S.L..pdf')
  })
})

describe('nombrePdf: regla 5, recorte a 60 caracteres', () => {
  const largo = 'Asociación de Vecinos del Barrio de Nuestra Señora de la Almudena y Adyacentes'

  it('el nombre del cliente se recorta a 60 caracteres', () => {
    const resultado = nombrePdf('2026-010', largo)
    expect(resultado).toBe(`2026-010 - ${largo.slice(0, 60)}.pdf`)
    expect(resultado.slice('2026-010 - '.length, -'.pdf'.length)).toHaveLength(60)
  })

  it('el número nunca se recorta', () => {
    expect(nombrePdf('2026-010', largo).startsWith('2026-010 - ')).toBe(true)
  })

  it('si el recorte deja un espacio al final, se quita', () => {
    // 60 caracteres justos y el 61 es una letra: el corte cae tras un espacio.
    const cliente = `${'a'.repeat(59)} bcdef`
    expect(nombrePdf('2026-011', cliente)).toBe(`2026-011 - ${'a'.repeat(59)}.pdf`)
  })
})

describe('nombrePdf: regla 6, red de seguridad del nombre vacío', () => {
  it('un cliente que solo tiene espacios acaba como Cliente', () => {
    // FR-008 deja fuera de la copia los presupuestos sin cliente, así que esto
    // no debería activarse nunca. Está para que el archivo tenga nombre igual.
    expect(nombrePdf('2026-012', '   ')).toBe('2026-012 - Cliente.pdf')
  })

  it('un cliente que se queda vacío tras la limpieza también', () => {
    expect(nombrePdf('2026-013', '')).toBe('2026-013 - Cliente.pdf')
  })
})

describe('nombreUnico: regla 7, dos nombres que coinciden', () => {
  it('el primero se queda como está', () => {
    expect(nombreUnico('2026-001 - Estudio García.pdf', new Set())).toBe(
      '2026-001 - Estudio García.pdf',
    )
  })

  it('el segundo y el tercero se numeran antes de la extensión', () => {
    const usados = new Set(['2026-001 - Estudio García.pdf'])
    const segundo = nombreUnico('2026-001 - Estudio García.pdf', usados)
    expect(segundo).toBe('2026-001 - Estudio García (2).pdf')

    usados.add(segundo)
    expect(nombreUnico('2026-001 - Estudio García.pdf', usados)).toBe(
      '2026-001 - Estudio García (3).pdf',
    )
  })

  it('el recuento de PDF coincide siempre con el de presupuestos completos (FR-012)', () => {
    const usados = new Set<string>()
    const nombres = ['a.pdf', 'a.pdf', 'a.pdf', 'b.pdf'].map((nombre) => {
      const unico = nombreUnico(nombre, usados)
      usados.add(unico)
      return unico
    })
    expect(new Set(nombres).size).toBe(4)
    expect(nombres).toEqual(['a.pdf', 'a (2).pdf', 'a (3).pdf', 'b.pdf'])
  })
})
