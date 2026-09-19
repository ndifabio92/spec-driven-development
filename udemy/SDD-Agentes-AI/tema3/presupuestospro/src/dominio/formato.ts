// Formato espanol de importes y fechas (Principio II de la constitucion).
// Se usa el formateador nativo del navegador: sin librerias de formato ni de fechas.

const FORMATEADOR_EUROS = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // El espanol no separa los miles en numeros de 4 cifras ("1500,00"), pero el
  // contrato del PDF exige "1.500,00 €": se fuerza siempre el separador.
  useGrouping: 'always',
})

const FORMATEADOR_FECHA = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/**
 * Sustituye los caracteres "bonitos" que devuelve Intl (espacio fino antes del euro
 * y signo menos tipografico) por sus equivalentes normales, porque el generador de
 * PDF solo dibuja con seguridad los caracteres corrientes.
 */
function normalizar(texto: string): string {
  return texto.replace(/[  ]/g, ' ').replace(/−/g, '-')
}

/** 1500 -> "1.500,00 €" · -300 -> "-300,00 €" */
export function formatearEuros(importe: number): string {
  const seguro = Number.isFinite(importe) ? importe : 0
  // `|| 0` evita que un -0 salga impreso como "-0,00 €".
  return normalizar(FORMATEADOR_EUROS.format(seguro || 0))
}

/** "2026-09-18" -> "18/09/2026" */
export function formatearFecha(iso: string): string {
  const fecha = fechaDesdeIso(iso)
  if (!fecha) return ''
  return normalizar(FORMATEADOR_FECHA.format(fecha))
}

/**
 * Lee un numero escrito a mano admitiendo la coma decimal espanola ("2,5") y el
 * punto de los miles ("1.500,50"). Devuelve null si lo escrito no es un numero.
 */
export function leerNumero(texto: string): number | null {
  const limpio = texto.trim()
  if (limpio === '') return null

  const tieneComa = limpio.includes(',')
  // Con coma, el punto solo puede ser separador de miles: se descarta.
  const normalizado = tieneComa ? limpio.replace(/\./g, '').replace(',', '.') : limpio

  if (!/^-?\d*\.?\d+$/.test(normalizado)) return null

  const valor = Number(normalizado)
  return Number.isFinite(valor) ? valor : null
}

/** Devuelve el numero listo para editarse en un campo, con coma decimal. */
export function textoDeNumero(valor: number): string {
  if (!Number.isFinite(valor)) return ''
  return String(valor).replace('.', ',')
}

/** Fecha de hoy en formato AAAA-MM-DD, segun el calendario local del freelancer. */
export function hoyIso(): string {
  return aIso(new Date())
}

/** "2026-09-18" + 30 -> "2026-10-18" */
export function sumarDias(iso: string, dias: number): string {
  const fecha = fechaDesdeIso(iso)
  if (!fecha) return iso
  fecha.setDate(fecha.getDate() + dias)
  return aIso(fecha)
}

function aIso(fecha: Date): string {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

function fechaDesdeIso(iso: string): Date | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!partes) return null
  // Se construye en hora local a mediodia para que ningun cambio horario mueva el dia.
  const fecha = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]), 12)
  return Number.isNaN(fecha.getTime()) ? null : fecha
}
