# Contrato: la cara del PDF

**Tipo de contrato**: capa visual del documento que recibe el cliente (FR-019 … FR-023)
**Relación con la 001**: **el contenido lo sigue fijando [contracts/pdf-documento.md](../../001-presupuestos-freelancer/contracts/pdf-documento.md), sin un solo cambio.** Este documento solo dice cómo se presenta.

## Por qué existe este contrato

El PDF es el producto: es lo único que ve el cliente del freelancer. Se rediseña para que transmita la misma imagen que la aplicación, y se escribe aparte para dejar muy claro **dónde está la frontera**: se puede mover, agrandar y colorear; no se puede añadir, quitar ni recalcular nada.

## Lo que no se toca (heredado de la 001)

| Sigue igual | Detalle |
|---|---|
| Los bloques y su orden | Logo, emisor, identificación, destinatario, tabla de líneas y desglose |
| Los textos | Mismos rótulos, mismos porcentajes en las etiquetas |
| Los importes | Mismo formato español, mismo redondeo, mismas cifras al céntimo (FR-021) |
| El nombre del archivo | `Presupuesto-2026-001.pdf` |
| El formato | A4 vertical, márgenes de 15 mm, **texto real seleccionable** |
| La comprobación de referencia | El desglose del ejemplo de la spec 001 debe seguir saliendo exactamente igual |

**Regla que manda sobre todas**: los importes se siguen pidiendo al mismo módulo de cálculo que alimenta la pantalla. El PDF **no recalcula nada por su cuenta**, ni siquiera un redondeo.

## Lo que sí cambia

| Elemento | Cómo queda |
|---|---|
| Cabecera | Banda superior con el color de acento, que da carácter al documento sin ensuciar la información |
| Tipografía | La familia del sistema visual (métricas Helvetica/Arial), con la misma jerarquía que la aplicación |
| Color | Solo los tokens de [sistema-visual.md](./sistema-visual.md), leídos en el momento de generar el documento |
| Aire | Separación entre bloques según la escala de espaciado; se acaba el amontonamiento |
| Tabla de líneas | Más ligera: cabecera clara, filas separadas por una línea fina, importes alineados a la derecha |
| Desglose | Bloque destacado, con el **Total a pagar** claramente por encima del resto |
| Sin logo | La cabecera se recompone sin dejar un hueco vacío (FR-023) |

## Reglas de maquetación que hay que respetar sí o sí

Son las dos cosas que una remaquetación rompe con más facilidad, y las dos están escritas como requisito (FR-022):

1. **La tabla que no cabe continúa en la página siguiente repitiendo su cabecera.**
2. **El bloque de totales nunca se parte entre dos páginas.** Si no cabe entero, pasa entero a la siguiente.

Y una tercera, de la 001, que sigue vigente:

3. **Los importes del PDF son exactamente los mismos que muestra la pantalla.**

## De dónde salen los colores

El generador **lee los tokens del sistema visual** en el momento de construir el documento, en vez de llevar su propia copia de la paleta (Decisión 1 de [research.md](../research.md)). Consecuencias:

- Cambiar el acento en un sitio lo cambia en la aplicación y en el PDF a la vez.
- **Si un token no se pudiera leer, el documento se genera igualmente** con un color por defecto: un PDF que no sale es un fallo mucho peor que un PDF con un gris distinto.

## Lo que este contrato prohíbe

- **Imprimir la situación del presupuesto** (Borrador, Vigente, Caducado). Es información para el freelancer, no para su cliente: un «Borrador» impreso en un presupuesto ya enviado le haría daño. El contrato de contenido de la 001 no la incluye.
- Añadir o quitar bloques, rótulos, notas al pie, numeración de páginas o cualquier texto que hoy no esté.
- Incrustar fuentes o imágenes que engorden el documento.
- Rasterizar el documento: sigue siendo texto real, seleccionable y nítido al imprimir.
- Tocar cualquier cifra, formato de importe o regla de redondeo.
