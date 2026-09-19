import type { ReactNode } from 'react'

type Variante = 'principal' | 'secundario' | 'peligro'

interface Props {
  children: ReactNode
  onClick?: () => void
  variante?: Variante
  tipo?: 'button' | 'submit'
  desactivado?: boolean
  ancho?: boolean
  titulo?: string
}

const CLASES: Record<Variante, string> = {
  principal: 'boton boton-principal',
  secundario: 'boton',
  peligro: 'boton boton-peligro',
}

/** Boton con zona pulsable de al menos 44 px (ver global.css). */
export function Boton({
  children,
  onClick,
  variante = 'secundario',
  tipo = 'button',
  desactivado = false,
  ancho = false,
  titulo,
}: Props) {
  return (
    <button
      type={tipo}
      className={`${CLASES[variante]}${ancho ? ' boton-ancho' : ''}`}
      onClick={onClick}
      disabled={desactivado}
      title={titulo}
    >
      {children}
    </button>
  )
}
