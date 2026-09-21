import { Link, useNavigate } from 'react-router-dom'
import { useDatos } from '../almacen/useDatos'
import { Aviso } from '../componentes/Aviso'
import { Boton } from '../componentes/Boton'
import { BotonExportar } from '../componentes/BotonExportar'
import { contarPorSituacion } from '../dominio/situacion'

/**
 * Entrada de la aplicación: en qué punto está la actividad del freelancer y
 * por dónde seguir. Todo lo que muestra se calcula al vuelo; aquí no se guarda nada.
 */
export function Inicio() {
  const { datos } = useDatos()
  const navegar = useNavigate()

  const recuento = contarPorSituacion(datos.presupuestos)
  const sinNadaGuardado =
    datos.presupuestos.length === 0 && datos.clientes.length === 0 && datos.servicios.length === 0

  return (
    <>
      <div className="tarjeta tarjeta-destacada">
        <h1>PresupuestosPro</h1>
        <p className="subtitulo">
          Tus presupuestos, con el IVA y la retención calculados solos y un PDF listo para enviar.
        </p>
        <Boton variante="principal" ancho onClick={() => navegar('/presupuestos/nuevo')}>
          Nuevo presupuesto
        </Boton>
      </div>

      {/* En escritorio ancho estos dos bloques van uno al lado del otro en vez de
          apilados; en móvil y escritorio estrecho, la pila de siempre (FR-047). */}
      <div className="rejilla-ancha">
        <div className="tarjeta">
          <h2>Cómo va tu actividad</h2>

          {/* Los tres recuentos se muestran siempre, aunque valgan cero: un cero
              informa ("no tienes nada caducado"), un hueco desconcierta.
              Son CINCO cifras y se reparten en 1, 3 o 5 columnas según la anchura:
              son los únicos repartos que no dejan una cifra sola (FR-049). */}
          <div className="resumen-actividad">
            <Dato cifra={recuento.Borrador} rotulo="En borrador" />
            <Dato cifra={recuento.Vigente} rotulo="Vigentes" />
            <Dato cifra={recuento.Caducado} rotulo="Caducados" />
            <Dato
              cifra={datos.clientes.length}
              rotulo={etiquetar(datos.clientes.length, 'cliente')}
            />
            <Dato
              cifra={datos.servicios.length}
              rotulo={etiquetar(datos.servicios.length, 'servicio')}
            />
          </div>

          {/* La copia de seguridad vive junto al resumen: es lo que hay que llevarse,
              y se alcanza sin recorrer la pantalla (FR-001, SC-013). */}
          <BotonExportar />

          {sinNadaGuardado ? (
            <Aviso tono="info">
              Aún no hay nada guardado. Lo más cómodo es empezar por tu{' '}
              <Link to="/perfil">perfil</Link>, para que tus datos y tu logo salgan solos en cada
              PDF, y seguir por el <Link to="/catalogo">catálogo</Link>. Aun así, puedes crear un
              presupuesto ahora mismo y rellenar lo demás después.
            </Aviso>
          ) : (
            <p className="vacio">
              Un presupuesto está <strong>vigente</strong> mientras no pase su fecha de validez, y
              queda en <strong>borrador</strong> mientras le falten líneas o el nombre del cliente.
            </p>
          )}
        </div>

        <div className="tarjeta">
          <h2>Ir a</h2>
          <nav className="accesos" aria-label="Secciones de la aplicación">
            <Acceso
              a="/presupuestos"
              titulo="Presupuestos"
              descripcion={
                datos.presupuestos.length === 0
                  ? 'Todavía ninguno'
                  : `${datos.presupuestos.length} en total`
              }
            />
            <Acceso a="/clientes" titulo="Clientes" descripcion="Los que repites, guardados" />
            <Acceso a="/catalogo" titulo="Catálogo" descripcion="Tus servicios y sus precios" />
            <Acceso a="/perfil" titulo="Perfil" descripcion="Tus datos y tu logo en el PDF" />
          </nav>
        </div>
      </div>
    </>
  )
}

function Dato({ cifra, rotulo }: { cifra: number; rotulo: string }) {
  return (
    <div className="dato">
      <span className="dato-cifra">{cifra}</span>
      <span className="dato-rotulo">{rotulo}</span>
    </div>
  )
}

function Acceso({ a, titulo, descripcion }: { a: string; titulo: string; descripcion: string }) {
  return (
    <Link to={a} className="acceso">
      <strong>{titulo}</strong>
      <span>{descripcion}</span>
    </Link>
  )
}

function etiquetar(cantidad: number, singular: string): string {
  return cantidad === 1 ? singular.charAt(0).toUpperCase() + singular.slice(1) : `${singular}s`
}
