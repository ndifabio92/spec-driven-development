// Situación de un presupuesto: se DEDUCE de lo que ya está guardado.
// No se almacena, no se pregunta y no hay forma de marcarla a mano (FR-017b).
// Reglas y orden exactos: data-model.md de la spec 002.

import { hoyIso } from './formato'
import type { Presupuesto } from './tipos'

export type Situacion = 'Borrador' | 'Vigente' | 'Caducado'

export type RecuentoPorSituacion = Record<Situacion, number>

/** Lo mínimo para decidir: así también sirve para un presupuesto en edición. */
export interface PresupuestoSituable {
  lineas: Presupuesto['lineas']
  cliente: { nombre: string }
  fechaValidez: string
}

/**
 * Orden de decisión, y el orden importa:
 *
 * 1. ¿Le falta algo para entregarse (sin líneas o sin nombre de cliente)? → Borrador
 * 2. ¿Su fecha de validez es anterior a hoy?                              → Caducado
 * 3. En cualquier otro caso                                               → Vigente
 *
 * Un presupuesto incompleto es Borrador aunque su validez haya pasado (FR-017a):
 * nunca llegó a estar en condiciones de salir, así que decir "caducado" daría a
 * entender que se envió y expiró, que es otra historia.
 */
export function situacionDe(presupuesto: PresupuestoSituable, hoy: string = hoyIso()): Situacion {
  const sinLineas = presupuesto.lineas.length === 0
  const sinCliente = presupuesto.cliente.nombre.trim() === ''
  const sinValidez = presupuesto.fechaValidez === ''

  if (sinLineas || sinCliente || sinValidez) return 'Borrador'

  // Las fechas ya se guardan como AAAA-MM-DD: ordenadas como texto coinciden con
  // el orden cronológico, así que no hace falta construir fechas ni zonas horarias.
  // La comparación es estricta porque el día de la validez cuenta entero.
  if (presupuesto.fechaValidez < hoy) return 'Caducado'

  return 'Vigente'
}

/** Recuento para el resumen de Inicio. Las tres situaciones suman el total (FR-018). */
export function contarPorSituacion(
  presupuestos: ReadonlyArray<PresupuestoSituable>,
  hoy: string = hoyIso(),
): RecuentoPorSituacion {
  // Se parte de cero en las tres para que un cero se muestre, en vez de faltar.
  const recuento: RecuentoPorSituacion = { Borrador: 0, Vigente: 0, Caducado: 0 }

  for (const presupuesto of presupuestos) {
    recuento[situacionDe(presupuesto, hoy)] += 1
  }

  return recuento
}
