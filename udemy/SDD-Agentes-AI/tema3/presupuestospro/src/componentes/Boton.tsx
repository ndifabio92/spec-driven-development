import type { ReactNode } from 'react'

type Variante = 'principal' | 'secundario' | 'peligro'

interface Props {
  children: ReactNode
  onClick?: () => void
  variante?: Variante
  tipo?: 'button' | 'submit'
  desactivado?: boolean
  /** Esto esta en marcha. Un unico tratamiento para todo el producto (FR-043). */
  ocupado?: boolean
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
  ocupado = false,
  ancho = false,
  titulo,
}: Props) {
  return (
    <button
      type={tipo}
      className={`${CLASES[variante]}${ancho ? ' boton-ancho' : ''}${ocupado ? ' ocupado' : ''}`}
      onClick={onClick}
      disabled={desactivado}
      aria-busy={ocupado || undefined}
      title={titulo}
    >
      {children}
    </button>
  )
}
