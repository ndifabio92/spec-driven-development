import type { Situacion } from '../dominio/situacion'

const CLASES: Record<Situacion, string> = {
  Borrador: 'etiqueta etiqueta-borrador',
  Vigente: 'etiqueta etiqueta-vigente',
  Caducado: 'etiqueta etiqueta-caducado',
}

const EXPLICACION: Record<Situacion, string> = {
  Borrador: 'Le faltan líneas o el nombre del cliente, así que todavía no puede entregarse',
  Vigente: 'Completo y dentro de su fecha de validez',
  Caducado: 'Su fecha de validez ya ha pasado',
}

/**
 * La situación de un presupuesto, siempre con su palabra escrita y un contorno
 * propio: así se distingue también en blanco y negro o sin percibir el color (FR-016).
 *
 * Es informativa y no se puede pulsar ni cambiar: la situación se deduce sola
 * de los datos del presupuesto (FR-017b).
 */
export function EtiquetaSituacion({ situacion }: { situacion: Situacion }) {
  return (
    <span className={CLASES[situacion]} title={EXPLICACION[situacion]}>
      {situacion}
    </span>
  )
}
