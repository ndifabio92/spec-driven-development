import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { nuevoId } from '../almacen/almacen'
import { useDatos } from '../almacen/useDatos'
import { Aviso } from '../componentes/Aviso'
import { Boton } from '../componentes/Boton'
import { CampoTexto } from '../componentes/CampoTexto'
import { EtiquetaSituacion } from '../componentes/EtiquetaSituacion'
import { ResumenTotales } from '../componentes/ResumenTotales'
import { TablaLineas, hayLineasInvalidas } from '../componentes/TablaLineas'
import { calcularPresupuesto } from '../dominio/calculo'
import { formatearFecha, hoyIso, sumarDias } from '../dominio/formato'
import { siguienteNumero } from '../dominio/numeracion'
import { situacionDe } from '../dominio/situacion'
import type { Presupuesto, TipoCliente, TipoRetencion } from '../dominio/tipos'
import { generarPdf } from '../pdf/generarPdf'

/** Días de validez del presupuesto desde su fecha de emisión (FR-010). */
const DIAS_DE_VALIDEZ = 30

export function EditorPresupuesto() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { datos, guardarPresupuesto, guardarCliente } = useDatos()

  // Mientras no tenga ninguna línea, el presupuesto vive solo aquí: no se guarda
  // ni consume número, de modo que abandonarlo no deja rastro (FR-018).
  const [borrador, setBorrador] = useState<Presupuesto>(crearBorrador)
  const [avisoPdf, setAvisoPdf] = useState<string | null>(null)
  const [servicioElegido, setServicioElegido] = useState('')

  const guardado = id ? datos.presupuestos.find((p) => p.id === id) : undefined

  if (id && !guardado) {
    return (
      <div className="tarjeta">
        <h1>Este presupuesto ya no está</h1>
        <p className="subtitulo">
          Puede que se creara en otro navegador o en otro dispositivo. Vuelve a{' '}
          <Link to="/presupuestos">la lista de presupuestos</Link>.
        </p>
      </div>
    )
  }

  const presupuesto = guardado ?? borrador
  const totales = calcularPresupuesto(presupuesto)
  const esParticular = presupuesto.cliente.tipo === 'particular'
  const yaTieneNumero = presupuesto.numero !== ''

  /**
   * Punto único por donde pasa cualquier cambio. Al añadir la primera línea el
   * presupuesto recibe su número y sus fechas, y a partir de ahí se guarda solo.
   */
  function aplicarCambio(cambio: (anterior: Presupuesto) => Presupuesto) {
    let siguiente = cambio(presupuesto)
    setAvisoPdf(null)

    if (siguiente.numero === '' && siguiente.lineas.length > 0) {
      const emision = hoyIso()
      siguiente = {
        ...siguiente,
        numero: siguienteNumero(datos.presupuestos, new Date().getFullYear()),
        fechaEmision: emision,
        fechaValidez: sumarDias(emision, DIAS_DE_VALIDEZ),
      }
    }

    if (siguiente.numero === '') {
      setBorrador(siguiente)
      return
    }

    guardarPresupuesto(siguiente)
    setBorrador(siguiente)
    if (!id) navegar(`/presupuestos/${siguiente.id}`, { replace: true })
  }

  function anadirLinea(descripcion: string, precioUnitario: number, servicioId?: string) {
    aplicarCambio((anterior) => ({
      ...anterior,
      lineas: [
        ...anterior.lineas,
        {
          id: nuevoId('lin'),
          descripcion,
          cantidad: 1,
          precioUnitario,
          origen: servicioId ? 'catalogo' : 'manual',
          ...(servicioId ? { servicioId } : {}),
        },
      ],
    }))
  }

  function anadirDelCatalogo() {
    const servicio = datos.servicios.find((s) => s.id === servicioElegido)
    if (!servicio) return
    // Se COPIAN descripción y precio: cambiar el catálogo después no toca esta línea (FR-015).
    anadirLinea(servicio.nombre, servicio.precioPorDefecto, servicio.id)
    setServicioElegido('')
  }

  function descargarPdf() {
    if (presupuesto.lineas.length === 0) {
      setAvisoPdf(
        'Este presupuesto todavía no tiene ninguna línea. Añade al menos una para poder descargar el PDF.',
      )
      return
    }

    if (hayLineasInvalidas(presupuesto.lineas)) {
      setAvisoPdf(
        'Revisa las líneas marcadas en rojo antes de descargar el PDF: hay alguna sin descripción o con una cantidad o un precio que no valen.',
      )
      return
    }

    if (presupuesto.cliente.nombre.trim() === '') {
      setAvisoPdf('Escribe el nombre del cliente: es lo primero que aparece en el PDF.')
      return
    }

    // Falta de datos de marca: se avisa, pero no se bloquea la descarga.
    const faltan: string[] = []
    if (datos.perfil.nombre.trim() === '') faltan.push('tu nombre')
    if (datos.perfil.nif.trim() === '') faltan.push('tu NIF')
    if (faltan.length > 0) {
      setAvisoPdf(
        `El PDF se ha descargado, pero le falta ${faltan.join(' y ')}. Rellena tu perfil y vuelve a descargarlo para que salga con todos tus datos.`,
      )
    }

    generarPdf(presupuesto, datos.perfil)
  }

  return (
    <>
      <div className="tarjeta">
        <div className="fila-acciones">
          <h1>{yaTieneNumero ? `Presupuesto ${presupuesto.numero}` : 'Nuevo presupuesto'}</h1>
          {yaTieneNumero && <EtiquetaSituacion situacion={situacionDe(presupuesto)} />}
        </div>
        <p className="subtitulo">
          {yaTieneNumero ? (
            <>
              Fecha de emisión: {formatearFecha(presupuesto.fechaEmision)} · Válido hasta el{' '}
              {formatearFecha(presupuesto.fechaValidez)}
            </>
          ) : (
            <>
              Recibirá su número y sus fechas al añadir la primera línea. Si lo dejas vacío, no se
              guarda.
            </>
          )}
        </p>
      </div>

      <div className="tarjeta">
        <h2>Cliente</h2>

        {datos.clientes.length > 0 && (
          <label className="campo">
            <span className="campo-etiqueta">Elegir un cliente guardado</span>
            <select
              value={presupuesto.clienteId ?? ''}
              onChange={(e) => {
                const cliente = datos.clientes.find((c) => c.id === e.target.value)
                if (!cliente) return
                // Los datos se copian al presupuesto y ahí se quedan (FR-016).
                aplicarCambio((anterior) => ({
                  ...anterior,
                  clienteId: cliente.id,
                  cliente: {
                    nombre: cliente.nombre,
                    nif: cliente.nif,
                    contacto: cliente.contacto,
                    tipo: cliente.tipo,
                  },
                }))
              }}
            >
              <option value="">Escribe los datos abajo o elige uno de la lista</option>
              {datos.clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            <span className="campo-ayuda">
              También puedes escribir los datos directamente: no hace falta guardar al cliente para
              hacerle un presupuesto.
            </span>
          </label>
        )}

        <div className="rejilla-doble">
          <CampoTexto
            etiqueta="Nombre del cliente"
            valor={presupuesto.cliente.nombre}
            onCambiar={(nombre) =>
              aplicarCambio((anterior) => ({
                ...anterior,
                cliente: { ...anterior.cliente, nombre },
              }))
            }
            error={
              presupuesto.cliente.nombre.trim() === ''
                ? 'El nombre del cliente es obligatorio: aparece en el PDF.'
                : null
            }
          />
          <CampoTexto
            etiqueta="NIF (opcional)"
            valor={presupuesto.cliente.nif}
            onCambiar={(nif) =>
              aplicarCambio((anterior) => ({ ...anterior, cliente: { ...anterior.cliente, nif } }))
            }
          />
        </div>

        <CampoTexto
          etiqueta="Datos de contacto (opcional)"
          valor={presupuesto.cliente.contacto}
          multilinea
          ayuda="Dirección, correo o teléfono. Se imprime tal cual en el PDF."
          onCambiar={(contacto) =>
            aplicarCambio((anterior) => ({
              ...anterior,
              cliente: { ...anterior.cliente, contacto },
            }))
          }
        />

        <SelectorTipoCliente
          tipo={presupuesto.cliente.tipo}
          onCambiar={(tipo) =>
            aplicarCambio((anterior) => ({ ...anterior, cliente: { ...anterior.cliente, tipo } }))
          }
        />

        {!presupuesto.clienteId && presupuesto.cliente.nombre.trim() !== '' && (
          <Boton
            onClick={() => {
              const cliente = {
                id: nuevoId('cli'),
                nombre: presupuesto.cliente.nombre,
                nif: presupuesto.cliente.nif,
                contacto: presupuesto.cliente.contacto,
                tipo: presupuesto.cliente.tipo,
              }
              guardarCliente(cliente)
              aplicarCambio((anterior) => ({ ...anterior, clienteId: cliente.id }))
            }}
          >
            Guardar este cliente en mi lista
          </Boton>
        )}
      </div>

      <div className="tarjeta">
        <h2>Líneas del presupuesto</h2>

        <TablaLineas
          lineas={presupuesto.lineas}
          onCambiar={(idLinea, cambio) =>
            aplicarCambio((anterior) => ({
              ...anterior,
              lineas: anterior.lineas.map((linea) =>
                linea.id === idLinea ? { ...linea, ...cambio } : linea,
              ),
            }))
          }
          onEliminar={(idLinea) =>
            aplicarCambio((anterior) => ({
              ...anterior,
              lineas: anterior.lineas.filter((linea) => linea.id !== idLinea),
            }))
          }
        />

        <div className="grupo-botones">
          <Boton variante="principal" onClick={() => anadirLinea('', 0)}>
            Añadir línea
          </Boton>
        </div>

        {datos.servicios.length > 0 && (
          <fieldset>
            <legend>Añadir desde mi catálogo</legend>
            <label className="campo">
              <span className="campo-etiqueta">Servicio</span>
              <select value={servicioElegido} onChange={(e) => setServicioElegido(e.target.value)}>
                <option value="">Elige un servicio</option>
                {datos.servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>
            </label>
            <div className="grupo-botones">
              <Boton onClick={anadirDelCatalogo} desactivado={servicioElegido === ''}>
                Añadir al presupuesto
              </Boton>
            </div>
          </fieldset>
        )}
      </div>

      <div className="tarjeta">
        <h2>Retención de IRPF</h2>
        <fieldset disabled={esParticular}>
          <legend>Cómo se aplica en este presupuesto</legend>

          <label className="opcion">
            <input
              type="checkbox"
              checked={presupuesto.retencionActivada}
              onChange={(e) =>
                aplicarCambio((anterior) => ({
                  ...anterior,
                  retencionActivada: e.target.checked,
                }))
              }
            />
            <span>Aplicar retención de IRPF</span>
          </label>

          <div className="fila-opciones">
            {([15, 7] as TipoRetencion[]).map((tipo) => (
              <label className="opcion" key={tipo}>
                <input
                  type="radio"
                  name="tipoRetencion"
                  checked={presupuesto.tipoRetencion === tipo}
                  onChange={() =>
                    aplicarCambio((anterior) => ({ ...anterior, tipoRetencion: tipo }))
                  }
                />
                <span>{tipo} %</span>
              </label>
            ))}
          </div>
        </fieldset>

        {esParticular && (
          <Aviso tono="info">
            A un particular no se le practica retención de IRPF, así que no se aplicará aunque esté
            marcada. Si tu cliente es una empresa o un autónomo, cámbialo arriba.
          </Aviso>
        )}
      </div>

      {avisoPdf && (
        <Aviso tono="error" onCerrar={() => setAvisoPdf(null)}>
          {avisoPdf}
        </Aviso>
      )}

      <div className="grupo-botones">
        <Boton variante="principal" onClick={descargarPdf}>
          Descargar PDF
        </Boton>
        <Boton onClick={() => navegar('/presupuestos')}>Volver a la lista</Boton>
      </div>

      <ResumenTotales totales={totales} tipoRetencion={presupuesto.tipoRetencion} fijo />
    </>
  )
}

function SelectorTipoCliente({
  tipo,
  onCambiar,
}: {
  tipo: TipoCliente
  onCambiar: (tipo: TipoCliente) => void
}) {
  return (
    <fieldset>
      <legend>Tipo de cliente</legend>
      <div className="fila-opciones">
        <label className="opcion">
          <input
            type="radio"
            name="tipoCliente"
            checked={tipo === 'empresa'}
            onChange={() => onCambiar('empresa')}
          />
          <span>Empresa o autónomo</span>
        </label>
        <label className="opcion">
          <input
            type="radio"
            name="tipoCliente"
            checked={tipo === 'particular'}
            onChange={() => onCambiar('particular')}
          />
          <span>Particular</span>
        </label>
      </div>
      <span className="campo-ayuda">
        Un autónomo cuenta como empresa: a él sí se le practica retención de IRPF.
      </span>
    </fieldset>
  )
}

function crearBorrador(): Presupuesto {
  return {
    id: nuevoId('pre'),
    numero: '',
    fechaEmision: '',
    fechaValidez: '',
    cliente: { nombre: '', nif: '', contacto: '', tipo: 'empresa' },
    lineas: [],
    retencionActivada: false,
    tipoRetencion: 15,
  }
}
