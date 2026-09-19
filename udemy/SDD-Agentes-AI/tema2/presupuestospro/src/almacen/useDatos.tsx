// Acceso a los datos desde la interfaz: un unico estado en React que se guarda
// en el navegador tras cada cambio confirmado por el freelancer.

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Cliente, Datos, Perfil, Presupuesto, Servicio } from '../dominio/tipos'
import { escribirDatos, leerDatos } from './almacen'

interface ContextoDatos {
  datos: Datos
  /** Mensaje pendiente de leer sobre el guardado (fallo al leer o al escribir). */
  aviso: string | null
  descartarAviso: () => void
  guardarPerfil: (perfil: Perfil) => void
  guardarCliente: (cliente: Cliente) => void
  eliminarCliente: (id: string) => void
  guardarServicio: (servicio: Servicio) => void
  eliminarServicio: (id: string) => void
  guardarPresupuesto: (presupuesto: Presupuesto) => void
}

const Contexto = createContext<ContextoDatos | null>(null)

export function ProveedorDatos({ children }: { children: ReactNode }) {
  const lectura = useMemo(() => leerDatos(), [])
  const [datos, setDatos] = useState<Datos>(lectura.datos)
  const [aviso, setAviso] = useState<string | null>(lectura.aviso)

  // La referencia siempre tiene el ultimo valor, aunque lleguen dos cambios seguidos.
  const ultimos = useRef(datos)

  const actualizar = useCallback((cambio: (anteriores: Datos) => Datos) => {
    const siguientes = cambio(ultimos.current)
    ultimos.current = siguientes
    setDatos(siguientes)

    // Se guarda fuera del render: aqui es donde el cambio queda confirmado.
    const escritura = escribirDatos(siguientes)
    if (escritura.aviso) setAviso(escritura.aviso)
  }, [])

  const valor = useMemo<ContextoDatos>(
    () => ({
      datos,
      aviso,
      descartarAviso: () => setAviso(null),

      guardarPerfil: (perfil) => actualizar((d) => ({ ...d, perfil })),

      guardarCliente: (cliente) =>
        actualizar((d) => ({
          ...d,
          clientes: reemplazarOAnadir(d.clientes, cliente),
        })),

      eliminarCliente: (id) =>
        actualizar((d) => ({ ...d, clientes: d.clientes.filter((c) => c.id !== id) })),

      guardarServicio: (servicio) =>
        actualizar((d) => ({
          ...d,
          servicios: reemplazarOAnadir(d.servicios, servicio),
        })),

      eliminarServicio: (id) =>
        actualizar((d) => ({ ...d, servicios: d.servicios.filter((s) => s.id !== id) })),

      guardarPresupuesto: (presupuesto) =>
        actualizar((d) => ({
          ...d,
          presupuestos: reemplazarOAnadir(d.presupuestos, presupuesto),
        })),
    }),
    [datos, aviso, actualizar],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useDatos(): ContextoDatos {
  const contexto = useContext(Contexto)
  if (!contexto) throw new Error('useDatos debe usarse dentro de ProveedorDatos')
  return contexto
}

function reemplazarOAnadir<T extends { id: string }>(lista: T[], elemento: T): T[] {
  const existe = lista.some((x) => x.id === elemento.id)
  return existe ? lista.map((x) => (x.id === elemento.id ? elemento : x)) : [...lista, elemento]
}
