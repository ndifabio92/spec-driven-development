# Contrato: documento PDF del presupuesto

**Tipo de contrato**: entregable que el cliente final recibe (FR-013)
**Nombre del archivo**: `Presupuesto-2026-001.pdf` (número del presupuesto)
**Formato**: A4 vertical, márgenes de 15 mm, texto real (seleccionable), en español de España

## Por qué existe este contrato

El PDF es lo único que ve el cliente del freelancer. Es el producto. Este documento fija qué debe aparecer siempre, para que pueda comprobarse a simple vista sin leer código (Principio IV de la constitución).

## Contenido obligatorio, de arriba a abajo

| Bloque | Contenido | Si falta el dato |
|---|---|---|
| Cabecera | Logo del freelancer (máximo 40 mm de ancho, proporción respetada) | Se omite el logo y el resto se coloca igual |
| Emisor | Nombre, NIF y datos de contacto del freelancer | Se avisa antes de generar, pero no se bloquea |
| Identificación | Título "Presupuesto", número `AAAA-NNN`, fecha de emisión (`18/09/2026`) y validez (`Válido hasta el 18/10/2026`) | Nunca falta: son datos del sistema |
| Destinatario | Nombre, NIF y contacto del cliente, **tal como estaban al crear el presupuesto** | Se muestran solo los campos rellenos |
| Tabla de líneas | Una fila por línea: descripción, cantidad, precio unitario e importe | Nunca vacía: sin líneas no se genera el PDF (FR-014) |
| Desglose | Base imponible, IVA (21 %), retención de IRPF (solo si se aplica, con signo negativo) y **Total a pagar** destacado | La fila de retención se omite por completo si no se aplica |

## Reglas de presentación

- **Importes**: siempre formato español con dos decimales y símbolo de euro — `1.500,00 €`, `−300,00 €`.
- **Porcentajes**: visibles en su etiqueta — `IVA (21 %)`, `Retención de IRPF (−15 %)`.
- **Total**: tipografía mayor o en negrita, claramente separado del resto; es el dato que el cliente busca.
- **Varias páginas**: si las líneas no caben, la tabla continúa en la página siguiente repitiendo la cabecera; el desglose de totales nunca se parte entre páginas.
- **Coherencia**: los importes del PDF son exactamente los mismos que muestra la pantalla, con el mismo redondeo. No se recalcula nada distinto al generar el documento.

## Comprobación de referencia

Con el ejemplo de la spec (líneas de 1.500,00 € y 500,00 €, cliente empresa, retención 15 %), el desglose impreso debe ser exactamente:

```text
Base imponible                 2.000,00 €
IVA (21 %)                       420,00 €
Retención de IRPF (−15 %)       −300,00 €
Total a pagar                  2.120,00 €
```
