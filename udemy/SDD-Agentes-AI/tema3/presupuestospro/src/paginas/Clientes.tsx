import { useState } from 'react'
import { nuevoId } from '../almacen/almacen'
import { useDatos } from '../almacen/useDatos'
import { Aviso } from '../componentes/Aviso'
import { Boton } from '../componentes/Boton'
import { CampoTexto } from '../componentes/CampoTexto'
import type { Cliente, TipoCliente } from '../dominio/tipos'

const ETIQUETAS_TIPO: Record<TipoCliente, string> = {
  empresa: 'Empresa o autónomo',
  particular: 'Particular',
}

/** Ficha de clientes habituales, para elegirlos en vez de reescribirlos. */
export function Clientes() {
  const { datos, guardarCliente, eliminarCliente } = useDatos()
  const [enEdicion, setEnEdicion] = useState<Cliente | null>(null)
  const [error, setError] = useState<string | null>(null)

  function empezarNuevo() {
    setError(null)
    setEnEdicion({ id: nuevoId('cli'), nombre: '', nif: '', contacto: '', tipo: 'empresa' })
  }

  function guardar() {
    if (!enEdicion) return
    if (enEdicion.nombre.trim() === '') {
      setError('El nombre del cliente es obligatorio: es lo que aparece en el PDF.')
      return
    }
    guardarCliente({ ...enEdicion, nombre: enEdicion.nombre.trim() })
    setEnEdicion(null)
    setError(null)
  }

  return (
    <>
      <div className="tarjeta">
        <h1>Mis clientes</h1>
        <p className="subtitulo">
          Guarda aquí los clientes que repites. Cada presupuesto conserva los datos que tenía el
          cliente cuando se creó, así que editar o borrar una ficha no cambia ningún presupuesto ya
          hecho.
        </p>
        <Boton variante="principal" ancho onClick={empezarNuevo}>
          Nuevo cliente
        </Boton>
      </div>

      {enEdicion && (
        <div className="tarjeta">
          <h2>{datos.clientes.some((c) => c.id === enEdicion.id) ? 'Editar' : 'Nuevo'} cliente</h2>

          <div className="rejilla-doble">
            <CampoTexto
              etiqueta="Nombre o razón social"
              valor={enEdicion.nombre}
              autoFoco
              onCambiar={(nombre) => setEnEdicion({ ...enEdicion, nombre })}
            />
            <CampoTexto
              etiqueta="NIF (opcional)"
              valor={enEdicion.nif}
              onCambiar={(nif) => setEnEdicion({ ...enEdicion, nif })}
            />
          </div>

          <CampoTexto
            etiqueta="Datos de contacto (opcional)"
            valor={enEdicion.contacto}
            multilinea
            ayuda="Dirección, correo o teléfono. Se imprime tal cual en el PDF."
            onCambiar={(contacto) => setEnEdicion({ ...enEdicion, contacto })}
          />

          <fieldset>
            <legend>Tipo de cliente</legend>
            <div className="fila-opciones">
              {(Object.keys(ETIQUETAS_TIPO) as TipoCliente[]).map((tipo) => (
                <label className="opcion" key={tipo}>
                  <input
                    type="radio"
                    name="tipoClienteFicha"
                    checked={enEdicion.tipo === tipo}
                    onChange={() => setEnEdicion({ ...enEdicion, tipo })}
                  />
                  <span>{ETIQUETAS_TIPO[tipo]}</span>
                </label>
              ))}
            </div>
            <span className="campo-ayuda">
              A una empresa o a un autónomo se le puede practicar retención de IRPF; a un particular,
              no.
            </span>
          </fieldset>

          {error && (
            <Aviso tono="error" onCerrar={() => setError(null)}>
              {error}
            </Aviso>
          )}

          <div className="grupo-botones">
            <Boton variante="principal" onClick={guardar}>
              Guardar cliente
            </Boton>
            <Boton
              onClick={() => {
                setEnEdicion(null)
                setError(null)
              }}
            >
              Cancelar
            </Boton>
          </div>
        </div>
      )}

      <div className="tarjeta">
        <h2>Clientes guardados</h2>
        {datos.clientes.length === 0 ? (
          <p className="vacio">
            Todavía no tienes clientes guardados. No es obligatorio: puedes escribir sus datos
            directamente al crear un presupuesto.
          </p>
        ) : (
          <ul className="lista">
            {datos.clientes.map((cliente) => (
              <li key={cliente.id}>
                <div className="elemento-lista">
                  <span>
                    <span className="elemento-lista-principal">{cliente.nombre}</span>
                    <span className="elemento-lista-secundario">
                      {ETIQUETAS_TIPO[cliente.tipo]}
                      {cliente.nif.trim() !== '' ? ` · NIF: ${cliente.nif}` : ''}
                    </span>
                  </span>
                  <span className="fila-acciones">
                    <Boton onClick={() => setEnEdicion(cliente)}>Editar</Boton>
                    <Boton variante="peligro" onClick={() => eliminarCliente(cliente.id)}>
                      Eliminar
                    </Boton>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
