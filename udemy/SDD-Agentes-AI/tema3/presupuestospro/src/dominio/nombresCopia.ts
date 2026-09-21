// Nombres de los archivos que salen dentro de la copia de seguridad.
// Contrato exacto: specs/003-exportar-copia-zip/contracts/estructura-copia.md
//
// Esto vive en dominio/ y lleva pruebas por el mismo motivo que los importes
// (Decisión 6 de research.md): un nombre mal construido no da un error visible,
// da un archivo que no se descomprime o dos presupuestos que se pisan y uno que
// desaparece de la copia sin que nadie se entere.
//
// Aquí no se importa nada de React ni del navegador: la fecha entra como parámetro.

/** Los nueve caracteres que ningún sistema de archivos admite, más los de control. */
const PROHIBIDOS = /[/\\:*?"<>|\u0000-\u001f\u007f]/g

/** Un nombre de cliente más largo no cabe en la lista de archivos de nadie. */
const MAXIMO_CLIENTE = 60

/** presupuestospro-copia-AAAA-MM-DD.zip, con la fecha del día de la exportación (FR-005). */
export function nombreZip(hoy: string): string {
  return `presupuestospro-copia-${hoy}.zip`
}

/**
 * `<número> - <cliente>.pdf` (FR-010, FR-011).
 *
 * El número entra tal cual: ya viene con un formato seguro (AAAA-NNN) y es lo
 * que identifica el documento. Lo que se limpia es el nombre del cliente, en el
 * orden exacto del contrato.
 */
export function nombrePdf(numero: string, cliente: string): string {
  // 1) Los caracteres imposibles pasan a ser un guion. 2) Los acentos y la eñe
  //    no se tocan: el zip marca el nombre como UTF-8 para que se extraigan bien.
  const sinProhibidos = cliente.replace(PROHIBIDOS, '-')

  // 3) Los espacios que hayan quedado sueltos se colapsan y se recortan.
  const compacto = sinProhibidos.replace(/\s+/g, ' ').trim()

  // 4) Los puntos se conservan, también el final: "S.L." sigue siendo "S.L." y
  //    el archivo acaba en "S.L..pdf". Windows solo rechaza el nombre que TERMINA
  //    en punto, y detrás siempre va la extensión.
  // 5) Se recorta el cliente, nunca el número, y se vuelve a limpiar el final.
  const recortado = compacto.slice(0, MAXIMO_CLIENTE).trimEnd()

  // 6) Red de seguridad: FR-008 deja fuera los presupuestos sin cliente, así que
  //    esto no debería activarse nunca, pero un archivo sin nombre no es opción.
  const limpio = recortado === '' ? 'Cliente' : recortado

  return `${numero} - ${limpio}.pdf`
}

/**
 * Devuelve el nombre libre de colisiones, añadiendo " (2)", " (3)"… antes de la
 * extensión (FR-012). Casi nunca se activa, porque el número de presupuesto es
 * único y va delante; existe para que el número de PDF del zip coincida SIEMPRE
 * con el de presupuestos completos, pase lo que pase con los nombres.
 */
export function nombreUnico(nombre: string, usados: ReadonlySet<string>): string {
  if (!usados.has(nombre)) return nombre

  const punto = nombre.lastIndexOf('.')
  const base = punto === -1 ? nombre : nombre.slice(0, punto)
  const extension = punto === -1 ? '' : nombre.slice(punto)

  let copia = 2
  let candidato = `${base} (${copia})${extension}`
  while (usados.has(candidato)) {
    copia += 1
    candidato = `${base} (${copia})${extension}`
  }
  return candidato
}
