// Numeracion automatica AAAA-NNN con reinicio anual (FR-009).

/**
 * Devuelve el numero que le toca al siguiente presupuesto del ano indicado.
 *
 * El numero se deriva del mas alto ya usado ese ano, en vez de guardar un contador
 * aparte: asi contador y presupuestos no pueden desincronizarse. Es seguro porque
 * en esta version los presupuestos no se eliminan.
 */
export function siguienteNumero(
  presupuestos: ReadonlyArray<{ numero: string }>,
  anio: number = new Date().getFullYear(),
): string {
  const prefijo = String(anio)

  const maximo = presupuestos.reduce((mayor, presupuesto) => {
    const partes = /^(\d{4})-(\d+)$/.exec(presupuesto.numero)
    if (!partes || partes[1] !== prefijo) return mayor
    const orden = Number(partes[2])
    return orden > mayor ? orden : mayor
  }, 0)

  // Al menos 3 digitos (001), pero sin tope superior: tras el 999 viene el 1000.
  return `${prefijo}-${String(maximo + 1).padStart(3, '0')}`
}
