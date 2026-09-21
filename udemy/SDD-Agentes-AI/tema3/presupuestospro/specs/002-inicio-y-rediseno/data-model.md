# Modelo de datos: Pantalla de inicio e imagen «Mediterráneo» (PresupuestosPro v1.1 → v1.3)

**Fecha**: 2026-09-19
**Spec**: [spec.md](./spec.md) · **Decisiones**: [research.md](./research.md)

## Lo primero: aquí no se guarda nada nuevo, y la revisión no cambia nada de esto

El modelo de datos de esta funcionalidad es **el de la [spec 001](../001-presupuestos-freelancer/data-model.md), sin un solo cambio**. Ni entidades nuevas, ni campos nuevos, ni valores nuevos, ni migración. El documento JSON del navegador se sigue leyendo y escribiendo tal y como fija su [contrato](../001-presupuestos-freelancer/contracts/almacen-schema.md).

**La revisión «Mediterráneo» no toca este documento en su fondo.** Cambia cómo se ve la etiqueta de situación —Vigente pasa del acento al oliva— y nada más: las reglas de cuándo se aplica cada situación son exactamente las de la v1.1, y sus pruebas automáticas siguen siendo las mismas.

Lo que este documento describe son **dos cosas que se calculan en el momento y se olvidan**: la situación de un presupuesto y el resumen del inicio.

| Concepto | ¿Se guarda? | ¿Lo elige el freelancer? | De dónde sale |
|---|---|---|---|
| Situación de un presupuesto | **No** | **No** | De sus líneas, su cliente y su fecha de validez |
| Resumen de actividad del inicio | **No** | **No** | De contar lo que ya hay guardado |

## Situación de un presupuesto (FR-015, FR-016, FR-017)

Tres valores posibles, y solo tres:

| Situación | Cuándo | Qué le dice al freelancer |
|---|---|---|
| **Borrador** | El presupuesto **no tiene ninguna línea** o **no tiene nombre de cliente** | Todavía no se puede entregar: son justo los casos en los que la aplicación no deja generar el PDF |
| **Caducado** | Está completo y su **fecha de validez ya pasó** | El plazo que se le dio al cliente se agotó |
| **Vigente** | Está completo y su **fecha de validez no ha pasado** | Está en pie |

### Cómo se decide, en orden

```text
1. ¿Le falta algo para entregarse?   (sin líneas  O  sin nombre de cliente)   → Borrador
2. ¿Su fecha de validez es anterior a hoy?                                    → Caducado
3. En cualquier otro caso                                                     → Vigente
```

El orden importa y es la regla de FR-017a: **un presupuesto incompleto es Borrador aunque su validez ya haya pasado**, porque nunca llegó a estar en condiciones de salir. Mostrarlo como «Caducado» daría a entender que se envió y expiró, que es otra historia.

### Las dos fronteras que hay que blindar

- **El día de la validez cuenta como vigente.** Un presupuesto válido hasta el 18/10/2026 está Vigente **durante todo** el 18 de octubre, y pasa a Caducado el 19. Equivocarse aquí caduca los presupuestos un día antes de tiempo.
- **La comparación se hace sobre el texto `AAAA-MM-DD`**, que es como ya se guardan las fechas: ordenadas alfabéticamente coinciden con el orden cronológico. No hay que construir fechas ni pensar en zonas horarias para responder «¿caducó?».

Las dos están cubiertas con pruebas automáticas desde la v1.1, y **esta revisión no las toca**. Que sigan en verde es parte de la garantía de FR-024 … FR-028.

### Casos raros, resueltos

| Caso | Situación | Por qué |
|---|---|---|
| Presupuesto con líneas pero con la cantidad o el precio mal puestos | **No es Borrador** por eso | FR-017 dice «sin líneas o sin nombre de cliente», y nada más. Esos errores ya se señalan en la propia línea; hacer saltar la etiqueta mientras se escribe sería ruido |
| Presupuesto en edición que todavía no se ha guardado (sin número, FR-018 de la 001) | No aparece en ninguna parte | Todavía no existe: no está en la lista ni en el recuento |
| Presupuesto sin fecha de validez | **Borrador** | Solo puede ocurrir en un presupuesto sin guardar, que además está incompleto por definición |

## Resumen de actividad del inicio (FR-003, FR-018)

Un recuento que se calcula al abrir la pantalla:

| Dato | Cómo se obtiene |
|---|---|
| Presupuestos en Borrador · Vigente · Caducado | Contando los presupuestos guardados por su situación |
| Clientes guardados | Tamaño de la ficha de clientes |
| Servicios del catálogo | Tamaño del catálogo |

Reglas:

- **Un presupuesto cuenta en una situación y solo en una**: las tres son excluyentes, así que la suma de los tres recuentos es el total de presupuestos guardados. Eso es lo que hace que el inicio y la lista siempre cuadren (FR-018).
- **Los tres recuentos se muestran siempre**, aunque valgan cero: un cero informa («no tienes nada caducado»), un hueco desconcierta.
- **Aplicación recién estrenada**: todo a cero, acompañado de una indicación de por dónde empezar, nunca una pantalla en blanco.
- **[v1.3]** Son **cinco** cifras y se colocan en un número de columnas declarado por anchura, no «las que quepan»: así no queda una fila huérfana con una sola cifra (FR-049). Es una regla de presentación, no de datos.

## Trazabilidad con la spec

| Requisito | Dónde se cumple |
|---|---|
| FR-003, FR-018 | Resumen de actividad (este documento) |
| FR-015, FR-016 | Etiqueta de situación → [contracts/sistema-visual.md](./contracts/sistema-visual.md) |
| FR-017, FR-017a | Reglas de decisión y orden (este documento) |
| FR-017b | No existe ningún campo ni control para marcar la situación: no se guarda nada |
| FR-001, FR-002, FR-004 … FR-007, FR-050 | [contracts/navegacion.md](./contracts/navegacion.md) |
| FR-008 … FR-014, FR-031 … FR-051 | [contracts/sistema-visual.md](./contracts/sistema-visual.md) |
| FR-019 … FR-023, FR-029, FR-052, FR-053 | [contracts/pdf-presentacion.md](./contracts/pdf-presentacion.md) |
| FR-024 … FR-028, FR-030 | **Por construcción**: los módulos de cálculo, numeración, formato, situación y almacenamiento no se tocan en esta revisión. `src/dominio/` y `src/almacen/` quedan intactos, y sus pruebas son la red que lo demuestra |
