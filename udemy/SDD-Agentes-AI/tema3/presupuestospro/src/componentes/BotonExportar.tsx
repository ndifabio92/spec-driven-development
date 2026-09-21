// El botón de la copia de seguridad. El mismo componente en Inicio y en la lista
// de presupuestos: hace lo mismo y produce la misma copia desde los dos sitios (FR-001).

import { useSyncExternalStore } from 'react'
import { Aviso } from './Aviso'
import { Boton } from './Boton'
import { exportarCopia } from '../exportacion/exportarCopia'
import type { ResultadoExportacion } from '../exportacion/exportarCopia'

type Estado =
  | { fase: 'inactivo' }
  | { fase: 'preparando'; hechos: number; total: number }
  | { fase: 'hecho'; resultado: ResultadoExportacion }

// El estado vive fuera de React, en un único sitio, porque la exportación no
// pertenece a ninguna de las dos pantallas: mientras dura, el botón tiene que
// estar inutilizable en las dos (FR-003), y si el freelancer cambia de pantalla
// a media copia el progreso sigue contando en vez de desaparecer.
let estado: Estado = { fase: 'inactivo' }
const oyentes = new Set<() => void>()

function fijar(siguiente: Estado): void {
  estado = siguiente
  for (const oyente of oyentes) oyente()
}

function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente)
  return () => {
    oyentes.delete(oyente)
  }
}

export function BotonExportar() {
  const actual = useSyncExternalStore(suscribir, () => estado)
  const preparando = actual.fase === 'preparando'

  async function exportar(): Promise<void> {
    if (preparando) return

    // Se anuncia el trabajo antes de empezar: la señal está en pantalla mucho
    // antes de los 2 s que pide SC-008, porque el primer PDF aún no ha arrancado.
    fijar({ fase: 'preparando', hechos: 0, total: 0 })

    const resultado = await exportarCopia({
      alAvanzar: (hechos, total) => fijar({ fase: 'preparando', hechos, total }),
    })

    fijar({ fase: 'hecho', resultado })
  }

  return (
    <div className="exportacion">
      <Boton onClick={() => void exportar()} desactivado={preparando} ocupado={preparando}>
        Exportar todo (.zip)
      </Boton>

      {actual.fase === 'preparando' && <Progreso hechos={actual.hechos} total={actual.total} />}
      {actual.fase === 'hecho' && <Avisos resultado={actual.resultado} />}
    </div>
  )
}

/** Cuánto lleva avanzado, sin esconder que el trabajo está en marcha (FR-019). */
function Progreso({ hechos, total }: { hechos: number; total: number }) {
  const porcentaje = total === 0 ? 100 : Math.round((hechos / total) * 100)

  return (
    <div className="progreso" role="status">
      <p className="progreso-texto">
        {total === 0
          ? 'Preparando tu copia…'
          : `Preparando tu copia… ${hechos} de ${total} presupuestos`}
      </p>
      <div
        className="progreso-barra"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total === 0 ? 1 : total}
        aria-valuenow={total === 0 ? 0 : hechos}
      >
        <div className="progreso-avance" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  )
}

/** Lo que el freelancer tiene que saber al terminar. Todo en español de España. */
function Avisos({ resultado }: { resultado: ResultadoExportacion }) {
  const cerrar = () => fijar({ fase: 'inactivo' })

  // No hay absolutamente nada guardado: no se ha descargado nada (FR-016).
  if (resultado.estado === 'nada') {
    return (
      <Aviso tono="info" onCerrar={cerrar}>
        No hay nada que exportar todavía. En cuanto rellenes tu perfil o crees tu primer
        presupuesto, podrás descargar una copia de todo.
      </Aviso>
    )
  }

  // La copia no ha podido completarse: no se ha entregado ningún archivo y tus
  // datos siguen donde estaban (FR-020, FR-020a).
  if (resultado.estado === 'fallido') {
    return (
      <Aviso tono="error" onCerrar={cerrar}>
        {resultado.motivo === 'volumen'
          ? 'No se ha podido crear la copia porque este dispositivo no da abasto con tantos datos. No se ha descargado nada y tus presupuestos están intactos. Prueba desde un ordenador, o cambia el logo de tu perfil por uno más ligero: el logo se incrusta entero en cada PDF y es lo que más pesa.'
          : 'No se ha podido crear la copia. No se ha descargado nada y tus presupuestos están intactos. Vuelve a intentarlo dentro de un momento.'}
      </Aviso>
    )
  }

  return (
    <>
      <Aviso tono="info" onCerrar={cerrar}>
        {resultado.documentos === 1
          ? 'Copia descargada: 1 presupuesto en PDF.'
          : `Copia descargada: ${resultado.documentos} presupuestos en PDF.`}{' '}
        Dentro va también <strong>datos-presupuestospro.json</strong>, la copia de todo lo que tienes
        guardado. No hace falta que lo abras: es lo que permitirá recuperar tus datos si cambias de
        navegador o de ordenador.
      </Aviso>

      {/* Había datos, pero ningún presupuesto que documentar (FR-017). */}
      {resultado.documentos === 0 && resultado.omitidos === 0 && (
        <Aviso tono="info">
          No había ningún presupuesto que documentar, así que la copia lleva tus datos y ningún PDF.
        </Aviso>
      )}

      {/* Los borradores no tienen PDF, pero no se pierde nada (FR-018). */}
      {resultado.omitidos > 0 && (
        <Aviso tono="info">
          {resultado.omitidos === 1
            ? 'Se ha quedado sin PDF 1 presupuesto por estar incompleto (le falta el cliente o alguna línea).'
            : `Se han quedado sin PDF ${resultado.omitidos} presupuestos por estar incompletos (les falta el cliente o alguna línea).`}{' '}
          Sus datos sí están dentro de la copia: no pierdes nada.
        </Aviso>
      )}

      {/* Es la primera vez que los datos salen del navegador (FR-018a). */}
      <Aviso tono="atencion">
        El archivo contiene datos personales tuyos y de tus clientes, sin contraseña. Guárdalo en un
        lugar seguro.
      </Aviso>
    </>
  )
}
