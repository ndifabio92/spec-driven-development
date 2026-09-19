import { useEffect, useId, useRef, useState } from 'react'
import { leerNumero, textoDeNumero } from '../dominio/formato'

interface Props {
  etiqueta: string
  valor: number
  onCambiar: (valor: number) => void
  /** Error de negocio calculado fuera (por ejemplo, "mayor que 0"). */
  error?: string | null
  ayuda?: string
  /** Oculta visualmente la etiqueta, util dentro de la tabla de lineas. */
  etiquetaOculta?: boolean
}

/**
 * Campo de importes y cantidades. Usa inputMode="decimal" para que el movil abra
 * el teclado numerico, y acepta la coma decimal espanola (2,5).
 */
export function CampoNumero({
  etiqueta,
  valor,
  onCambiar,
  error,
  ayuda,
  etiquetaOculta = false,
}: Props) {
  const id = useId()
  const [texto, setTexto] = useState(() => textoDeNumero(valor))
  const [ilegible, setIlegible] = useState(false)
  const enfocado = useRef(false)

  // Si el valor cambia desde fuera (por ejemplo, al copiar un precio del catalogo)
  // se refresca el texto, pero nunca mientras el freelancer esta escribiendo.
  useEffect(() => {
    if (!enfocado.current) {
      setTexto(textoDeNumero(valor))
      setIlegible(false)
    }
  }, [valor])

  function alEscribir(nuevoTexto: string) {
    setTexto(nuevoTexto)
    const numero = leerNumero(nuevoTexto)
    if (numero === null) {
      setIlegible(true)
      return
    }
    setIlegible(false)
    onCambiar(numero)
  }

  const mensaje = ilegible ? 'Escribe un número, por ejemplo 2,5' : (error ?? null)
  const idMensaje = `${id}-mensaje`
  const idAyuda = `${id}-ayuda`
  const descrito = [ayuda ? idAyuda : null, mensaje ? idMensaje : null].filter(Boolean).join(' ')

  return (
    <label className="campo" htmlFor={id}>
      {!etiquetaOculta && <span className="campo-etiqueta">{etiqueta}</span>}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={texto}
        aria-label={etiquetaOculta ? etiqueta : undefined}
        aria-invalid={mensaje ? true : undefined}
        aria-describedby={descrito || undefined}
        onFocus={() => {
          enfocado.current = true
        }}
        onBlur={() => {
          enfocado.current = false
          if (!ilegible) setTexto(textoDeNumero(valor))
        }}
        onChange={(e) => alEscribir(e.target.value)}
      />
      {ayuda && (
        <span className="campo-ayuda" id={idAyuda}>
          {ayuda}
        </span>
      )}
      {mensaje && (
        <span className="campo-error" id={idMensaje}>
          {mensaje}
        </span>
      )}
    </label>
  )
}
