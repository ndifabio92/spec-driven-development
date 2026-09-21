import { Link, useNavigate } from 'react-router-dom'
import { useDatos } from '../almacen/useDatos'
import { Aviso } from '../componentes/Aviso'
import { Boton } from '../componentes/Boton'
import { BotonExportar } from '../componentes/BotonExportar'
import { EtiquetaSituacion } from '../componentes/EtiquetaSituacion'
import { calcularPresupuesto } from '../dominio/calculo'
import { formatearEuros, formatearFecha } from '../dominio/formato'
import { situacionDe } from '../dominio/situacion'

/** Lista de presupuestos. Antes era la pantalla de entrada; ahora es una sección más. */
export function Presupuestos() {
  const { datos } = useDatos()
  const navegar = useNavigate()

  // Los más recientes primero: es lo que se suele buscar. Mismo orden que antes.
  const presupuestos = [...datos.presupuestos].sort((a, b) => b.numero.localeCompare(a.numero))

  return (
    <>
      <div className="tarjeta tarjeta-destacada">
        <h1>Mis presupuestos</h1>
        <p className="subtitulo">
          Crea un presupuesto, añade tus líneas y descárgalo en PDF con tu marca.
        </p>
        <Boton variante="principal" ancho onClick={() => navegar('/presupuestos/nuevo')}>
          Nuevo presupuesto
        </Boton>
      </div>

      <div className="tarjeta">
        <div className="cabecera-seccion">
          <h2>Presupuestos creados</h2>
          {/* El mismo botón que en Inicio: la misma copia desde los dos sitios (FR-001). */}
          <BotonExportar />
        </div>
        {presupuestos.length === 0 ? (
          <p className="vacio">
            Aún no has creado ningún presupuesto. Antes de empezar puedes rellenar tu{' '}
            <Link to="/perfil">perfil</Link> y tu <Link to="/catalogo">catálogo</Link>, aunque no es
            obligatorio.
          </p>
        ) : (
          <ul className="lista">
            {presupuestos.map((presupuesto) => {
              const totales = calcularPresupuesto(presupuesto)
              return (
                <li key={presupuesto.id}>
                  <div className="elemento-lista">
                    <Link
                      to={`/presupuestos/${presupuesto.id}`}
                      className="elemento-lista-principal"
                    >
                      {presupuesto.numero} · {presupuesto.cliente.nombre || 'Sin cliente'}
                      <span className="elemento-lista-secundario">
                        {formatearFecha(presupuesto.fechaEmision)} ·{' '}
                        {presupuesto.lineas.length === 1
                          ? '1 línea'
                          : `${presupuesto.lineas.length} líneas`}
                      </span>
                    </Link>
                    <span className="fila-acciones">
                      <EtiquetaSituacion situacion={situacionDe(presupuesto)} />
                      <strong className="importe-linea">{formatearEuros(totales.total)}</strong>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Aviso tono="info">
        Tus datos se guardan solo en este navegador y en este dispositivo. Si borras los datos del
        sitio, usas el modo privado o cambias de equipo, no los verás: no hay copia en ningún
        servidor.
      </Aviso>
    </>
  )
}
