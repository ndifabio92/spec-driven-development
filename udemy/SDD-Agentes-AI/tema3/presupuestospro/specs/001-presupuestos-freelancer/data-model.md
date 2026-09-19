# Modelo de datos: Presupuestos para Freelancers (PresupuestosPro v0)

**Fecha**: 2026-09-18
**Spec**: [spec.md](./spec.md) · **Decisiones técnicas**: [research.md](./research.md)

Todo lo descrito aquí vive en el navegador del freelancer, en un único documento JSON (ver [contracts/almacen-schema.md](./contracts/almacen-schema.md)).

## Idea central: qué se copia y qué se consulta en vivo

La spec obliga a que un presupuesto ya creado no cambie de importe a espaldas del freelancer (FR-015, FR-016). Eso se consigue con una regla sencilla:

| Dato | Comportamiento | Motivo |
|---|---|---|
| Precio y descripción de una línea | **Se copian** al presupuesto al añadir la línea | Cambiar el catálogo no debe alterar un presupuesto ya enviado (FR-015) |
| Datos del cliente | **Se copian** al presupuesto al crearlo | Editar o borrar la ficha del cliente no debe alterar presupuestos pasados (FR-016) |
| Datos del freelancer (perfil y logo) | **Se consultan en vivo** al generar el PDF | Es su marca actual: si cambia de logo o teléfono, quiere que salga el nuevo (Historia 3, escenario 2) |

## Entidades

### Perfil (único)

La identidad del freelancer. Solo existe uno.

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `nombre` | texto | Sí, para generar PDF | No vacío |
| `nif` | texto | Sí, para generar PDF | No vacío; se guarda tal cual lo escribe el freelancer, sin validar el formato oficial |
| `contacto` | texto | No | Texto libre multilínea (dirección, email, teléfono) |
| `logo` | imagen en base64 + ancho y alto originales | No | PNG o JPG, máximo 1 MB; si falta, el PDF se genera igual sin logo |

> **Por qué no se valida el NIF**: la spec no lo pide y el Principio V dice pedir solo lo imprescindible. Un validador estricto molestaría más de lo que ayuda (NIF, NIE, CIF, clientes extranjeros).

### Cliente

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `id` | identificador | Sí | Generado por el sistema, nunca visible al usuario |
| `nombre` | texto | Sí | No vacío |
| `nif` | texto | No | Texto libre |
| `contacto` | texto | No | Texto libre multilínea |
| `tipo` | `"empresa"` \| `"particular"` | Sí | Determina si puede aplicarse retención (FR-008) |

Se pueden crear, editar y eliminar (FR-003). Eliminar un cliente **no** toca los presupuestos ya emitidos con él.

### Servicio (catálogo)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `id` | identificador | Sí | Generado por el sistema |
| `nombre` | texto | Sí | No vacío |
| `precioPorDefecto` | número | Sí | Mayor o igual que 0 |

Se pueden crear, editar y eliminar (FR-002). Nada de esto afecta a presupuestos existentes.

### Presupuesto

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `id` | identificador | Sí | Generado por el sistema |
| `numero` | texto `AAAA-NNN` | Sí | Asignado al guardar la primera línea y **nunca recalculado** (FR-009, FR-018) |
| `fechaEmision` | fecha | Sí | Fecha de creación; fija |
| `fechaValidez` | fecha | Sí | `fechaEmision` + 30 días (FR-010) |
| `cliente` | copia de los datos del cliente (`nombre`, `nif`, `contacto`, `tipo`) | Sí | Copia congelada en el momento de creación (FR-016) |
| `clienteId` | identificador | No | Referencia informativa a la ficha; puede quedar huérfana si se elimina el cliente |
| `lineas` | lista de Líneas | Sí | Puede estar vacía mientras se edita; no se puede generar PDF vacío (FR-014) |
| `retencionActivada` | sí/no | Sí | Valor por defecto: no |
| `tipoRetencion` | `15` \| `7` | Sí | Valor por defecto: 15; solo tiene efecto si la retención está activada **y** el cliente es empresa |

No existe estado (borrador/enviado/aceptado): la spec lo deja fuera de alcance. Tampoco se pueden eliminar presupuestos en v1, porque ningún requisito lo pide.

### Línea de presupuesto

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `id` | identificador | Sí | Generado por el sistema |
| `descripcion` | texto | Sí | No vacía |
| `cantidad` | número | Sí | Mayor que 0; admite decimales (ej. 2,5 horas) |
| `precioUnitario` | número | Sí | Mayor o igual que 0 |
| `origen` | `"catalogo"` \| `"manual"` | Sí | Informativo; una línea de catálogo es editable como cualquier otra |
| `servicioId` | identificador | No | Referencia informativa al servicio del que se copió |

El importe de la línea (`cantidad × precioUnitario`) **no se almacena**: se calcula siempre a partir de los dos campos, para que no puedan quedar desincronizados.

## Reglas de cálculo (FR-006, FR-007, FR-008)

Orden exacto, y único sitio del sistema donde se calcula:

```text
baseImponible   = suma de (cantidad × precioUnitario) de todas las líneas
iva             = baseImponible × 0,21
aplicaRetencion = retencionActivada Y cliente.tipo = "empresa"
retencion       = aplicaRetencion ? baseImponible × (tipoRetencion / 100) : 0
total           = baseImponible + iva − retencion
```

- **Precisión**: los cuatro cálculos anteriores se hacen sin redondear. Solo al presentarlos (pantalla o PDF) se redondean a 2 decimales con redondeo *half-up*.
- **Cliente particular**: `aplicaRetencion` es falso por definición aunque la casilla esté marcada. La casilla conserva su valor por si el freelancer cambia el tipo de cliente después, pero la regla fiscal manda siempre (FR-008).
- **IVA**: 21 % constante en esta versión, definido en un único punto del código.

## Regla de numeración (FR-009)

Al añadir la primera línea a un presupuesto nuevo, que es el momento en que se guarda por primera vez (FR-018):

1. Se toma el año en curso (`AAAA`).
2. Se busca el número más alto ya usado en ese año.
3. El nuevo presupuesto recibe ese número + 1, con al menos 3 dígitos (`001`, `002`… `999`, `1000`, sin tope superior).
4. El número queda fijo para siempre: editar el presupuesto, aunque sea al año siguiente, no lo cambia.

> Derivar el número del máximo existente, en vez de guardar un contador aparte, elimina la posibilidad de que contador y presupuestos se desincronicen. Es seguro porque en v1 los presupuestos no se eliminan.

## Validaciones y mensajes al usuario

Todos los mensajes van en español de España (Principio II) y explican qué hacer, no qué ha fallado internamente.

| Situación | Comportamiento |
|---|---|
| Intentar generar el PDF sin líneas | Se impide y se avisa: hace falta al menos una línea (FR-014) |
| Cantidad o precio no numéricos o negativos | No se aceptan; el campo indica el valor esperado |
| Guardar perfil sin nombre o NIF | Se permite guardar, pero al generar el PDF se avisa de que faltan datos de la marca |
| Logo mayor de 1 MB | Se rechaza con un mensaje que sugiere una imagen más ligera |
| Almacenamiento del navegador lleno o bloqueado | Se avisa de que los cambios no se han podido guardar, en vez de fallar en silencio |

## Trazabilidad con la spec

| Requisito | Dónde se cumple en este modelo |
|---|---|
| FR-001 | Entidad Perfil |
| FR-002 | Entidad Servicio |
| FR-003, FR-004 | Entidad Cliente + copia `cliente` en Presupuesto |
| FR-005 | Entidad Línea (origen catálogo o manual) |
| FR-006 | Reglas de cálculo + regla de redondeo |
| FR-007 | `retencionActivada` y `tipoRetencion` por presupuesto |
| FR-008 | `aplicaRetencion` en las reglas de cálculo |
| FR-009 | Regla de numeración + `numero` fijo |
| FR-010 | `fechaEmision` y `fechaValidez` |
| FR-011, FR-012 | Sin estado bloqueado; importes siempre derivados de las líneas |
| FR-013 | [contracts/pdf-documento.md](./contracts/pdf-documento.md) |
| FR-014 | Validación de presupuesto sin líneas |
| FR-015 | Copia de descripción y precio en la Línea |
| FR-016 | Copia de `cliente` en el Presupuesto |
| FR-017 | [contracts/almacen-schema.md](./contracts/almacen-schema.md) |
| FR-018 | Regla de numeración (el presupuesto se guarda al añadir su primera línea) |
