import { describe, it, expect } from 'vitest'
import { FORMATO_COPIA, construirSobre } from './sobreCopia'
import type { Datos } from './tipos'

function datos(): Datos {
  return {
    version: 1,
    perfil: {
      nombre: 'Ana Ruiz',
      nif: '12345678Z',
      contacto: 'ana@ejemplo.es',
      logo: { datos: 'data:image/png;base64,iVBOR', ancho: 512, alto: 128 },
    },
    clientes: [
      { id: 'cli_1', nombre: 'Estudio García', nif: 'B1', contacto: '', tipo: 'empresa' },
    ],
    servicios: [{ id: 'ser_1', nombre: 'Diseño web', precioPorDefecto: 1500 }],
    presupuestos: [
      {
        id: 'pre_1',
        numero: '2026-001',
        fechaEmision: '2026-03-01',
        fechaValidez: '2026-03-31',
        cliente: { nombre: 'Estudio García', nif: 'B1', contacto: '', tipo: 'empresa' },
        lineas: [
          { id: 'l1', descripcion: 'Diseño', cantidad: 1, precioUnitario: 1500, origen: 'manual' },
        ],
        retencionActivada: true,
        tipoRetencion: 15,
      },
    ],
  }
}

const MOMENTO = new Date('2026-03-15T09:41:07.312Z')

describe('construirSobre: la regla que no se puede romper', () => {
  it('los datos salen idénticos a como entraron', () => {
    const original = datos()
    const sobre = construirSobre(original, MOMENTO)

    // JSON.stringify compara además el ORDEN de los campos: así la prueba detecta
    // un campo añadido, uno quitado y una reordenación, que es justo lo que el
    // contrato prohíbe (contracts/archivo-datos.md).
    expect(JSON.stringify(sobre.datos)).toBe(JSON.stringify(datos()))
    expect(sobre.datos).toEqual(original)
  })

  it('el logo y los borradores viajan enteros dentro de los datos', () => {
    const conBorrador = datos()
    conBorrador.presupuestos.push({
      ...conBorrador.presupuestos[0],
      id: 'pre_2',
      numero: '2026-002',
      lineas: [],
    })

    const sobre = construirSobre(conBorrador, MOMENTO)
    expect(sobre.datos.presupuestos).toHaveLength(2)
    expect(sobre.datos.perfil.logo?.datos).toBe('data:image/png;base64,iVBOR')
  })

  it('construir el sobre no toca el documento de partida (FR-021)', () => {
    const original = datos()
    const antes = JSON.stringify(original)
    construirSobre(original, MOMENTO)
    expect(JSON.stringify(original)).toBe(antes)
  })
})

describe('construirSobre: la marca de identidad', () => {
  it('dice de qué aplicación viene', () => {
    expect(construirSobre(datos(), MOMENTO).aplicacion).toBe('PresupuestosPro')
  })

  it('dice qué versión del sobre es, que en esta versión es la 1', () => {
    expect(construirSobre(datos(), MOMENTO).formatoCopia).toBe(1)
    expect(FORMATO_COPIA).toBe(1)
  })

  it('el número del sobre y el del documento de datos son independientes', () => {
    // Uno describe la copia y el otro el modelo de datos: suben por motivos distintos.
    const sobre = construirSobre(datos(), MOMENTO)
    expect(sobre.formatoCopia).toBe(1)
    expect(sobre.datos.version).toBe(1)
  })

  it('refleja el momento recibido, con fecha, hora y zona horaria', () => {
    expect(construirSobre(datos(), MOMENTO).exportadoEl).toBe('2026-03-15T09:41:07.312Z')
  })
})
