import { importeLinea } from '../dominio/calculo'
import { formatearEuros } from '../dominio/formato'
import type { LineaPresupuesto } from '../dominio/tipos'
import { Boton } from './Boton'
import { CampoNumero } from './CampoNumero'
import { CampoTexto } from './CampoTexto'

export interface ErroresLinea {
  descripcion?: string
  cantidad?: string
  precioUnitario?: string
}

/**
 * Validaciones de una línea, con mensajes que dicen qué valor se espera.
 * Cambiar el precio de un servicio del catálogo no afecta a las líneas ya creadas:
 * cada línea guarda una copia de la descripción y del precio, no una referencia (FR-015).
 */
export function erroresDeLinea(linea: LineaPresupuesto): ErroresLinea {
  const errores: ErroresLinea = {}

  if (linea.descripcion.trim() === '') {
    errores.descripcion = 'Escribe qué incluye esta línea: es lo que leerá tu cliente.'
  }
  if (!(linea.cantidad > 0)) {
    errores.cantidad = 'La cantidad tiene que ser mayor que 0. Admite decimales, como 2,5 horas.'
  }
  if (!(linea.precioUnitario >= 0)) {
    errores.precioUnitario = 'El precio unitario no puede ser negativo. Usa 0 o más.'
  }

  return errores
}

export function hayLineasInvalidas(lineas: LineaPresupuesto[]): boolean {
  return lineas.some((linea) => Object.keys(erroresDeLinea(linea)).length > 0)
}

interface Props {
  lineas: LineaPresupuesto[]
  onCambiar: (id: string, cambio: Partial<LineaPresupuesto>) => void
  onEliminar: (id: string) => void
}

/** Tabla en escritorio y tarjetas apiladas en móvil (el cambio lo hace global.css). */
export function TablaLineas({ lineas, onCambiar, onEliminar }: Props) {
  if (lineas.length === 0) {
    return (
      <p className="vacio">
        Todavía no hay ninguna línea. Añade la primera para que el presupuesto reciba su número y
        empiecen a calcularse los importes.
      </p>
    )
  }

  return (
    <table className="tabla-lineas">
      <thead>
        <tr>
          <th scope="col">Descripción</th>
          <th scope="col" className="columna-cantidad">
            Cantidad
          </th>
          <th scope="col" className="columna-precio">
            Precio unitario
          </th>
          <th scope="col" className="columna-importe">
            Importe
          </th>
          <th scope="col" className="columna-acciones">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {lineas.map((linea) => {
          const errores = erroresDeLinea(linea)
          return (
            <tr key={linea.id}>
              <td data-etiqueta="Descripción">
                <CampoTexto
                  etiqueta="Descripción"
                  valor={linea.descripcion}
                  onCambiar={(descripcion) => onCambiar(linea.id, { descripcion })}
                  error={errores.descripcion}
                />
                {linea.origen === 'catalogo' && <span className="origen-linea">Del catálogo</span>}
              </td>
              <td data-etiqueta="Cantidad" className="columna-cantidad">
                <CampoNumero
                  etiqueta={`Cantidad de ${linea.descripcion || 'la línea'}`}
                  etiquetaOculta
                  valor={linea.cantidad}
                  onCambiar={(cantidad) => onCambiar(linea.id, { cantidad })}
                  error={errores.cantidad}
                />
              </td>
              <td data-etiqueta="Precio unitario" className="columna-precio">
                <CampoNumero
                  etiqueta={`Precio unitario de ${linea.descripcion || 'la línea'}`}
                  etiquetaOculta
                  valor={linea.precioUnitario}
                  onCambiar={(precioUnitario) => onCambiar(linea.id, { precioUnitario })}
                  error={errores.precioUnitario}
                />
              </td>
              <td data-etiqueta="Importe" className="columna-importe">
                <span className="importe-linea">{formatearEuros(importeLinea(linea))}</span>
              </td>
              <td data-etiqueta="Acciones" className="columna-acciones">
                <Boton variante="peligro" onClick={() => onEliminar(linea.id)}>
                  Eliminar
                </Boton>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
