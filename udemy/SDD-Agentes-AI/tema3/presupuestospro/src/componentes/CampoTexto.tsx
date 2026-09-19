import { useId } from 'react'

interface Props {
  etiqueta: string
  valor: string
  onCambiar: (valor: string) => void
  ayuda?: string
  error?: string | null
  multilinea?: boolean
  marcador?: string
  autoFoco?: boolean
}

/** Campo de texto de una o varias lineas, con etiqueta siempre visible. */
export function CampoTexto({
  etiqueta,
  valor,
  onCambiar,
  ayuda,
  error,
  multilinea = false,
  marcador,
  autoFoco = false,
}: Props) {
  const id = useId()
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`
  const descrito = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(' ')

  const comunes = {
    id,
    value: valor,
    placeholder: marcador,
    autoFocus: autoFoco,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': descrito || undefined,
  }

  return (
    <label className="campo" htmlFor={id}>
      <span className="campo-etiqueta">{etiqueta}</span>
      {multilinea ? (
        <textarea {...comunes} onChange={(e) => onCambiar(e.target.value)} />
      ) : (
        <input type="text" {...comunes} onChange={(e) => onCambiar(e.target.value)} />
      )}
      {ayuda && (
        <span className="campo-ayuda" id={idAyuda}>
          {ayuda}
        </span>
      )}
      {error && (
        <span className="campo-error" id={idError}>
          {error}
        </span>
      )}
    </label>
  )
}
