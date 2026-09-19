import type { ReactNode } from 'react'

type Tono = 'atencion' | 'error' | 'info'

interface Props {
  children: ReactNode
  tono?: Tono
  onCerrar?: () => void
}

const CLASES: Record<Tono, string> = {
  atencion: 'aviso',
  error: 'aviso aviso-error',
  info: 'aviso aviso-info',
}

/** Mensaje en espanol para el freelancer: dice que hacer, no que ha fallado por dentro. */
export function Aviso({ children, tono = 'atencion', onCerrar }: Props) {
  return (
    <div className={CLASES[tono]} role={tono === 'error' ? 'alert' : 'status'}>
      <div className="aviso-cabecera">
        <p>{children}</p>
        {onCerrar && (
          <button type="button" className="boton" onClick={onCerrar} aria-label="Cerrar aviso">
            Cerrar
          </button>
        )}
      </div>
    </div>
  )
}
