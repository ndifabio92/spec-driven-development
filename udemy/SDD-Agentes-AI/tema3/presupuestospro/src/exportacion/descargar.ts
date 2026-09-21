// El único punto del código que toca la descarga del navegador.
//
// Está aislado a propósito: todo lo demás de la exportación produce bytes, y
// los bytes se pueden comprobar. Lo que no se puede comprobar con una prueba
// —el enlace temporal, el clic simulado, la URL que hay que liberar— vive aquí
// y en ningún otro sitio.

/**
 * Entrega al navegador los trozos del archivo, en orden, con el nombre indicado.
 * El archivo no sale del dispositivo: no hay petición de red de por medio (FR-022).
 */
export function descargar(partes: ReadonlyArray<Uint8Array>, nombre: string): void {
  // Los trozos van al Blob uno a uno, sin juntarlos antes en un único búfer:
  // juntarlos duplicaría el archivo entero en memoria justo en el momento de mayor
  // consumo, y el techo de esta operación es precisamente la memoria (Decisión 3
  // de research.md). Cada trozo se reenvuelve como vista sobre sus mismos bytes
  // —no se copia nada— para que el tipo diga ArrayBuffer y no ArrayBufferLike.
  const trozos = partes.map(
    (parte) => new Uint8Array(parte.buffer as ArrayBuffer, parte.byteOffset, parte.byteLength),
  )
  const blob = new Blob(trozos, { type: 'application/zip' })
  const url = URL.createObjectURL(blob)

  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombre
  document.body.appendChild(enlace)
  enlace.click()
  document.body.removeChild(enlace)

  // Se libera después de que el navegador haya tomado el archivo: hacerlo en el
  // mismo instante del clic cancela la descarga en algunos navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
