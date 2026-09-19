// Tipos del dominio segun data-model.md.
// Aqui no se importa nada de React ni del navegador: es logica pura.

/** Logo del freelancer, guardado en base64 junto a su tamano original. */
export interface Logo {
  datos: string
  ancho: number
  alto: number
}

/** Identidad del freelancer. Solo existe uno. */
export interface Perfil {
  nombre: string
  nif: string
  contacto: string
  logo: Logo | null
}

/**
 * El tipo de cliente decide si puede aplicarse la retencion de IRPF (FR-008).
 * Un autonomo cuenta como "empresa": tambien lleva retencion.
 */
export type TipoCliente = 'empresa' | 'particular'

/** Datos del cliente que se copian dentro del presupuesto (FR-016). */
export interface DatosCliente {
  nombre: string
  nif: string
  contacto: string
  tipo: TipoCliente
}

export interface Cliente extends DatosCliente {
  id: string
}

/** Servicio del catalogo: plantilla reutilizable de una linea. */
export interface Servicio {
  id: string
  nombre: string
  precioPorDefecto: number
}

export type OrigenLinea = 'catalogo' | 'manual'

/**
 * Linea de un presupuesto. El importe (cantidad x precioUnitario) NO se guarda:
 * se calcula siempre, para que no puedan quedar desincronizados.
 */
export interface LineaPresupuesto {
  id: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  origen: OrigenLinea
  servicioId?: string
}

export type TipoRetencion = 15 | 7

export interface Presupuesto {
  id: string
  /** AAAA-NNN. Se asigna al anadir la primera linea y no se recalcula nunca (FR-009, FR-018). */
  numero: string
  /** AAAA-MM-DD */
  fechaEmision: string
  /** AAAA-MM-DD, 30 dias despues de la emision (FR-010). */
  fechaValidez: string
  /** Referencia informativa a la ficha; puede quedar huerfana si se elimina el cliente. */
  clienteId?: string
  /** Copia congelada de los datos del cliente (FR-016). */
  cliente: DatosCliente
  lineas: LineaPresupuesto[]
  retencionActivada: boolean
  tipoRetencion: TipoRetencion
}

/** Documento unico que se guarda en el navegador (contracts/almacen-schema.md). */
export interface Datos {
  version: 1
  perfil: Perfil
  clientes: Cliente[]
  servicios: Servicio[]
  presupuestos: Presupuesto[]
}
