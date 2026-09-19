import type { Totales } from '../dominio/calculo'
import { TIPO_IVA } from '../dominio/calculo'
import { formatearEuros } from '../dominio/formato'
import type { TipoRetencion } from '../dominio/tipos'

interface Props {
  totales: Totales
  tipoRetencion: TipoRetencion
  /** En móvil se queda pegado abajo para no perder de vista el total al editar. */
  fijo?: boolean
}

/** Desglose de importes. Es lo que el freelancer mira mientras edita las líneas. */
export function ResumenTotales({ totales, tipoRetencion, fijo = false }: Props) {
  return (
    <section className={`resumen${fijo ? ' resumen-fijo' : ''}`} aria-label="Resumen de importes">
      <div className="resumen-fila">
        <span>Base imponible</span>
        <span>{formatearEuros(totales.baseImponible)}</span>
      </div>
      <div className="resumen-fila">
        <span>IVA ({TIPO_IVA} %)</span>
        <span>{formatearEuros(totales.iva)}</span>
      </div>
      {totales.aplicaRetencion && (
        <div className="resumen-fila">
          <span>Retención de IRPF (-{tipoRetencion} %)</span>
          <span>{formatearEuros(-totales.retencion)}</span>
        </div>
      )}
      <div className="resumen-fila resumen-total">
        <span>Total a pagar</span>
        <span>{formatearEuros(totales.total)}</span>
      </div>
    </section>
  )
}
