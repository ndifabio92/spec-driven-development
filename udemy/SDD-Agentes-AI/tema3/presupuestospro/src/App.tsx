import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import { ProveedorDatos, useDatos } from './almacen/useDatos'
import { Aviso } from './componentes/Aviso'
import { Inicio } from './paginas/Inicio'
import { Presupuestos } from './paginas/Presupuestos'
import { EditorPresupuesto } from './paginas/EditorPresupuesto'
import { Clientes } from './paginas/Clientes'
import { Catalogo } from './paginas/Catalogo'
import { Perfil } from './paginas/Perfil'

/**
 * Navegación en modo hash (#/): el botón "atrás" del móvil funciona como se espera
 * y la carpeta dist/ se publica en cualquier alojamiento estático sin configurar nada.
 *
 * La entrada de la aplicación es Inicio; la lista de presupuestos vive ahora en
 * #/presupuestos y conserva todo lo que hacía (contracts/navegacion.md).
 */
export function App() {
  return (
    <ProveedorDatos>
      <HashRouter>
        <Cabecera />
        <main className="contenido">
          <AvisoDeGuardado />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/presupuestos" element={<Presupuestos />} />
            <Route path="/presupuestos/nuevo" element={<EditorPresupuesto />} />
            <Route path="/presupuestos/:id" element={<EditorPresupuesto />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </main>
      </HashRouter>
    </ProveedorDatos>
  )
}

const SECCIONES = [
  { a: '/', texto: 'Inicio', exacta: true },
  { a: '/presupuestos', texto: 'Presupuestos', exacta: false },
  { a: '/clientes', texto: 'Clientes', exacta: false },
  { a: '/catalogo', texto: 'Catálogo', exacta: false },
  { a: '/perfil', texto: 'Perfil', exacta: false },
]

/**
 * Aparece en todas las pantallas y lleva a cualquier sección en un solo toque,
 * sin usar el botón "atrás" (FR-005). Los cinco accesos están siempre visibles:
 * si no caben en una línea, saltan a la siguiente.
 */
function Cabecera() {
  return (
    <header className="cabecera">
      <div className="cabecera-fila">
        <NavLink to="/" className="marca">
          PresupuestosPro
        </NavLink>
        <nav className="navegacion" aria-label="Secciones">
          {SECCIONES.map((seccion) => (
            <NavLink
              key={seccion.a}
              to={seccion.a}
              end={seccion.exacta}
              // aria-current comunica la sección actual a quien no ve el color;
              // la clase la marca además con peso y un subrayado grueso (FR-006).
              className={({ isActive }) => (isActive ? 'activa' : '')}
            >
              {seccion.texto}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

/** Si el navegador impide guardar, se dice en pantalla en vez de fallar en silencio. */
function AvisoDeGuardado() {
  const { aviso, descartarAviso } = useDatos()
  if (!aviso) return null
  return (
    <Aviso tono="error" onCerrar={descartarAviso}>
      {aviso}
    </Aviso>
  )
}

function NoEncontrada() {
  return (
    <div className="tarjeta">
      <h1>Esta página no existe</h1>
      <p className="subtitulo">
        Vuelve al <NavLink to="/">inicio</NavLink> o a{' '}
        <NavLink to="/presupuestos">tus presupuestos</NavLink> para seguir trabajando.
      </p>
    </div>
  )
}
