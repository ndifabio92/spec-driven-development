import { useState } from 'react'
import { nuevoId } from '../almacen/almacen'
import { useDatos } from '../almacen/useDatos'
import { Aviso } from '../componentes/Aviso'
import { Boton } from '../componentes/Boton'
import { CampoNumero } from '../componentes/CampoNumero'
import { CampoTexto } from '../componentes/CampoTexto'
import { formatearEuros } from '../dominio/formato'
import type { Servicio } from '../dominio/tipos'

/** Catálogo de servicios reutilizables: para no reescribir lo mismo en cada presupuesto. */
export function Catalogo() {
  const { datos, guardarServicio, eliminarServicio } = useDatos()
  const [enEdicion, setEnEdicion] = useState<Servicio | null>(null)
  const [error, setError] = useState<string | null>(null)

  function empezarNuevo() {
    setError(null)
    setEnEdicion({ id: nuevoId('srv'), nombre: '', precioPorDefecto: 0 })
  }

  function guardar() {
    if (!enEdicion) return
    if (enEdicion.nombre.trim() === '') {
      setError('Ponle un nombre al servicio: es lo que se copiará en la línea del presupuesto.')
      return
    }
    if (!(enEdicion.precioPorDefecto >= 0)) {
      setError('El precio por defecto no puede ser negativo. Usa 0 o más.')
      return
    }
    guardarServicio({ ...enEdicion, nombre: enEdicion.nombre.trim() })
    setEnEdicion(null)
    setError(null)
  }

  return (
    <>
      <div className="tarjeta">
        <h1>Mi catálogo</h1>
        <p className="subtitulo">
          Los servicios que más repites, con su precio habitual. Al añadirlos a un presupuesto se
          copian: cambiar aquí un precio después no toca ningún presupuesto ya creado.
        </p>
        <Boton variante="principal" ancho onClick={empezarNuevo}>
          Nuevo servicio
        </Boton>
      </div>

      {enEdicion && (
        <div className="tarjeta">
          <h2>{datos.servicios.some((s) => s.id === enEdicion.id) ? 'Editar' : 'Nuevo'} servicio</h2>

          <CampoTexto
            etiqueta="Nombre del servicio"
            valor={enEdicion.nombre}
            autoFoco
            onCambiar={(nombre) => setEnEdicion({ ...enEdicion, nombre })}
          />
          <CampoNumero
            etiqueta="Precio por defecto"
            valor={enEdicion.precioPorDefecto}
            ayuda="En euros, sin IVA. Podrás ajustarlo en cada presupuesto."
            onCambiar={(precioPorDefecto) => setEnEdicion({ ...enEdicion, precioPorDefecto })}
          />

          {error && (
            <Aviso tono="error" onCerrar={() => setError(null)}>
              {error}
            </Aviso>
          )}

          <div className="grupo-botones">
            <Boton variante="principal" onClick={guardar}>
              Guardar servicio
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
        <h2>Servicios guardados</h2>
        {datos.servicios.length === 0 ? (
          <p className="vacio">
            Todavía no tienes servicios. No es obligatorio: también puedes escribir las líneas a
            mano en cada presupuesto.
          </p>
        ) : (
          <ul className="lista">
            {datos.servicios.map((servicio) => (
              <li key={servicio.id}>
                <div className="elemento-lista">
                  <span>
                    <span className="elemento-lista-principal">{servicio.nombre}</span>
                    <span className="elemento-lista-secundario">
                      {formatearEuros(servicio.precioPorDefecto)}
                    </span>
                  </span>
                  <span className="fila-acciones">
                    <Boton onClick={() => setEnEdicion(servicio)}>Editar</Boton>
                    <Boton variante="peligro" onClick={() => eliminarServicio(servicio.id)}>
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
