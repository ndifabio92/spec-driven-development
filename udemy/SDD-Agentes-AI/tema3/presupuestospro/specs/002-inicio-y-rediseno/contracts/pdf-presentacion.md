# Contrato: la cara del PDF

**Tipo de contrato**: capa visual del documento que recibe el cliente (FR-019 … FR-023, FR-029, FR-044, FR-052, FR-053)
**Relación con la 001**: **el contenido lo sigue fijando [contracts/pdf-documento.md](../../001-presupuestos-freelancer/contracts/pdf-documento.md), sin un solo cambio.** Este documento solo dice cómo se presenta.
**Sustituye a**: la versión de este contrato de la v1.1

## Por qué existe este contrato

El PDF es el producto: es lo único que ve el cliente del freelancer. Se rediseña para que transmita la misma imagen que la aplicación, y se escribe aparte para dejar muy claro **dónde está la frontera**: se puede mover, agrandar y colorear; no se puede añadir, quitar ni recalcular nada.

## Lo que no se toca (heredado de la 001)

| Sigue igual | Detalle |
|---|---|
| Los bloques y su orden | Logo, emisor, identificación, destinatario, tabla de líneas y desglose |
| Los textos | Mismos rótulos, mismos porcentajes en las etiquetas |
| Los importes | Mismo formato español, mismo redondeo, mismas cifras al céntimo (FR-021) |
| El nombre del archivo | `Presupuesto-2026-001.pdf` (FR-027) |
| El formato | A4 vertical, márgenes de 15 mm, **texto real seleccionable** |
| La comprobación de referencia | El desglose del ejemplo de la spec 001 debe seguir saliendo exactamente igual: **2.120,00 €** (FR-028) |

**Regla que manda sobre todas**: los importes se siguen pidiendo al mismo módulo de cálculo que alimenta la pantalla. El PDF **no recalcula nada por su cuenta**, ni siquiera un redondeo.

## Lo que sí cambia en esta revisión

| Elemento | Cómo queda |
|---|---|
| Cabecera | Banda superior en `--color-acento` (terracota), que da carácter al documento sin ensuciar la información |
| Desglose | Bloque destacado sobre `--color-acento-suave`, con el **Total a pagar** claramente por encima del resto |
| Tabla de líneas | Cabecera en `--color-tinta-suave` con peso medio, filas separadas por `--color-linea-fuerte`, importes alineados a la derecha con cifras de ancho fijo |
| Jerarquía | **El Total a pagar pasa a ser el elemento tipográficamente mayor del documento** (18 pt). El número del presupuesto baja de 24 pt a 15,75 pt, donde le corresponde |
| Tamaños | **Dejan de estar escritos a mano** y se derivan de la escala del sistema visual, igual que ya ocurría con los colores (FR-051) |
| Aire | Separación entre bloques según la escala de espaciado, leída de los mismos tokens que la pantalla |
| Tipografía | **Sin cambios**: la familia de métricas Helvetica/Arial que el PDF lleva de serie (ver más abajo) |
| Sin logo | La cabecera se recompone sin dejar un hueco vacío (FR-023) |

## La conversión de la escala: 1 rem = 9 pt

Los tamaños del documento se derivan de los tokens de tipografía del sistema visual con **una conversión declarada**:

| Nivel del sistema | En pantalla | En el documento |
|---|---|---|
| `--tipo-apoyo` | 0,875 rem | 7,9 pt |
| `--tipo-base` | 1 rem | 9 pt |
| `--tipo-seccion` | 1,25 rem | 11,25 pt |
| `--tipo-titulo` | 1,75 rem | 15,75 pt |
| `--tipo-total` | 2 rem | **18 pt** |

**Por qué 9 y no la conversión directa** (1 rem = 16 px = 12 pt): con 12 pt de texto base, la tabla de líneas crecería un tercio, un presupuesto largo ocuparía más páginas y el archivo pesaría más, poniendo en riesgo FR-053. El documento es más denso que una pantalla, y siempre lo fue. La conversión es una decisión declarada, no un descuido ([research.md](../research.md), Decisión 4).

**Consecuencia que hay que comprobar**: el texto de la tabla se queda en los 9 pt de siempre, así que **la paginación de un presupuesto ya existente no debería cambiar**. Si cambia, es señal de que algún tamaño no salió de la escala.

## La tipografía no viaja al documento

El PDF **no incrusta archivos de tipografía** (FR-052) y mantiene la familia de métricas Helvetica/Arial que lleva de serie.

- **Por qué**: una fuente incrustada se repite **en cada documento**, igual que el logo, así que el coste de la exportación en lote crece con el número de presupuestos — la misma trampa que ya documenta `CLAUDE.md`.
- **Consecuencia asumida**: la aplicación y el documento se reconocen como el mismo producto **por su color, su aire y su jerarquía**, no por la forma exacta de la letra. Está decidido y escrito en las Clarifications de la spec (D1).
- **Tope de peso**: un PDF no puede pesar más de un 20 % por encima del mismo PDF antes de la revisión (FR-053), y la exportación de la copia en `.zip` tiene que seguir completándose igual.

## Reglas de maquetación que hay que respetar sí o sí

Son las tres cosas que una remaquetación rompe con más facilidad:

1. **La tabla que no cabe continúa en la página siguiente repitiendo su cabecera** (FR-022).
2. **El bloque de totales nunca se parte entre dos páginas.** Si no cabe entero, pasa entero a la siguiente (FR-022). *Atención en esta revisión*: el total sube de 14 pt a 18 pt, así que el bloque ocupa más alto que antes y este es el requisito con más riesgo de romperse.
3. **Los importes del PDF son exactamente los mismos que muestra la pantalla** (FR-021).

## De dónde salen los colores y los tamaños

El generador **lee los tokens del sistema visual** en el momento de construir el documento, en vez de llevar su propia copia (Decisión 1 de la v1.1). Consecuencias:

- Cambiar el acento en un sitio lo cambia en la aplicación y en el PDF a la vez.
- **Si un token no se pudiera leer, el documento se genera igualmente** con un valor por defecto: un PDF que no sale es un fallo mucho peor que un PDF con un gris distinto.
- **Y por eso mismo, todo token que el PDF lea tiene que ser un valor plano.** Si un token se convirtiera en expresión calculada, el lector recibiría una fórmula, caería al respaldo **sin avisar** y el documento saldría con tamaños o colores equivocados sin que nadie se enterase. La lista de qué tokens lee el PDF está en [sistema-visual.md](./sistema-visual.md), marcada columna a columna.

## Lo que este contrato prohíbe

- **Imprimir la situación del presupuesto** (Borrador, Vigente, Caducado). Es información para el freelancer, no para su cliente: un «Borrador» impreso en un presupuesto ya enviado le haría daño. El contrato de contenido de la 001 no la incluye (FR-029).
- Añadir o quitar bloques, rótulos, notas al pie, numeración de páginas o cualquier texto que hoy no esté.
- **Incrustar fuentes** o imágenes que engorden el documento (FR-052).
- Rasterizar el documento: sigue siendo texto real, seleccionable y nítido al imprimir.
- Tocar cualquier cifra, formato de importe o regla de redondeo.
- Teñir la banda de la cabecera con los colores del logo del freelancer: el acento del documento es **fijo**. Si el logo choca, se resuelve con aire y separación (D5 de las Clarifications).
