# Research: Pantalla de inicio e imagen profesional (PresupuestosPro v1.1)

**Fecha**: 2026-09-19
**Spec**: [spec.md](./spec.md)
**Constitución aplicada**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

## Punto de partida

Aquí no hay que elegir stack: lo fija la [spec 001](../001-presupuestos-freelancer/plan.md) y no se toca. Lo que hay que decidir es más estrecho y más delicado: **cómo mejorar la cara del producto sin rozar su motor**. Tres restricciones mandan:

1. El encargo dice que la lógica, los cálculos y el esquema de datos **no cambian en absoluto**.
2. La constitución exige la solución más simple (Principio I) y prohíbe construir lo que la spec no pide (Principio III).
3. La misma imagen tiene que llegar a dos sitios que funcionan de forma muy distinta: **una pantalla (HTML y CSS)** y **un PDF (dibujado punto por punto)**.

La tercera es el verdadero problema de diseño de esta versión.

---

## Decisión 1 — Los tokens visuales viven en el CSS, y el PDF los lee de ahí

**Decisión**: el color, la tipografía y la escala de espaciado se definen **una sola vez**, como variables CSS al principio de `global.css`. Cuando el freelancer pulsa "Descargar PDF", el generador **consulta esos mismos valores** al navegador y los traduce a lo que jsPDF entiende.

**Qué significa para el negocio**: la paleta deja de estar repartida. Cambiar el azul de la marca es tocar **una línea**, y ese cambio aparece a la vez en las seis pantallas y en el documento que recibe el cliente. No existe el escenario de "la aplicación ya es azul nuevo pero los PDF salen con el azul viejo", que es exactamente como se deteriora la imagen de una herramienta con el tiempo.

**Por qué**: FR-008 pide "definidas en un único lugar". Las alternativas dejan siempre **dos** lugares:

| Alternativa | Por qué se descarta |
|---|---|
| Escribir la paleta en el CSS y repetirla en el código del PDF | Son dos sitios. Funciona el primer día y se desincroniza el segundo; es justo lo que FR-008 quiere evitar |
| Definirla en código y generar el CSS desde ahí al arrancar | También funciona, pero los colores dejan de verse en la hoja de estilos y la página parpadea sin color hasta que arranca el programa |
| Un paso de compilación que genere ambos desde un archivo común | Infraestructura nueva para cuatro colores. El Principio I decide |

**Cautela de implementación**: el PDF solo se genera desde el navegador con la aplicación ya cargada, así que los valores siempre están disponibles. Aun así, la función de lectura lleva un valor de respaldo: **si un token no se pudiera leer, el PDF sale igualmente** con el color por defecto, porque un documento sin generar es un fallo mucho peor que un documento con un gris ligeramente distinto.

---

## Decisión 2 — La aplicación adopta la familia tipográfica que el PDF puede usar, y no al revés

**Decisión**: tanto la pantalla como el PDF usan una **sans-serif neutra de métricas Helvetica/Arial**, que es la que los PDF llevan de serie. La aplicación deja de pedir "la tipografía del sistema" (que en un Windows es una y en un Mac es otra) y pide explícitamente esa familia.

**Qué significa para el negocio**: la aplicación y el documento se reconocen como el mismo producto, que es lo que pide SC-006, y el freelancer ve en pantalla algo muy parecido a lo que va a recibir su cliente.

**Por qué en esa dirección**: la única forma de meter una tipografía distinta en un PDF es **incrustarla dentro del archivo**, lo que engorda cada documento en cientos de kilobytes y obliga a descargar la fuente en la aplicación. Se descarta por el Principio I y porque la 001 ya decidió no incrustar fuentes. Como el PDF no puede ceder, cede la pantalla: no se pierde nada, porque Helvetica y Arial son tipografías sobrias y perfectamente legibles, que es justo el tono que pide el encargo.

**Alternativa descartada**: una fuente web de marca (Inter, Source Sans y compañía). Añade una descarga externa —que además filtra la dirección del freelancer a un tercero, en contra del espíritu del Principio V—, retrasa la primera pantalla y deja el PDF descolgado de todos modos.

---

## Decisión 3 — Una paleta de cuatro tonos, no de cuatro colores sueltos

**Decisión**: la paleta se construye con **un tono neutro en varias intensidades** (texto, texto secundario, líneas, fondo) más **tres tonos con significado**: acento, atención y error. Nada más.

**Qué significa para el negocio**: se cumple lo que pide SC-006 —una persona que recorra la aplicación cuenta unos pocos colores— y el resultado es sobrio por construcción: el color deja de ser decoración y pasa a significar algo. El acento marca lo que hay que pulsar, el de atención avisa y el de error corrige.

**Por qué**: es lo que separa una herramienta que parece seria de una que parece un borrador. Una escala de un mismo tono neutro da profundidad (jerarquía entre título, dato y ayuda) sin sumar colores a la cuenta.

**Cómo se reparte en las situaciones del presupuesto**: Vigente usa el acento, Caducado usa el de atención y Borrador se queda en el neutro. No hace falta un cuarto color, y encaja con la lectura: un borrador todavía no es nada, por eso es gris.

---

## Decisión 4 — La situación se deduce; nunca se guarda ni se pregunta

**Decisión**: Borrador, Vigente y Caducado se calculan en el momento a partir de las líneas, el nombre del cliente y la fecha de validez que el presupuesto ya tiene. Ese cálculo vive en el módulo de dominio, junto al resto de reglas, y **lleva pruebas automáticas**.

**Qué significa para el negocio**: es lo que permite cumplir a la vez las dos cosas que pediste —ver la situación de cada presupuesto y no tocar los datos—. Ningún presupuesto existente se altera, no hay migración y el freelancer no tiene que ir marcando nada a mano.

**Por qué con pruebas, si la 001 dijo "pruebas solo donde está el dinero"**: porque no es pintar, es una regla con bordes afilados, y dos de ellos ya están escritos como criterios de aceptación: **el propio día de la validez todavía cuenta como vigente** (equivocarse ahí caduca presupuestos un día antes de tiempo) y **Borrador manda sobre Caducado**. Son exactamente el tipo de error que nadie ve al mirar la pantalla y que estropea el recuento del inicio. Encaja en la regla de la 001: es lógica pura de dominio, sin React ni navegador.

**Detalle que evita un error clásico**: las fechas se comparan como texto `AAAA-MM-DD`, tal y como ya se guardan. Ordenadas alfabéticamente coinciden con el orden cronológico, así que no hace falta construir fechas ni pelearse con zonas horarias para saber si algo caducó.

---

## Decisión 5 — El inicio entra como pantalla nueva y la lista se queda donde estaba, pero con otra dirección

**Decisión**: la aplicación pasa a abrir en Inicio; la lista de presupuestos se mueve a su propia dirección y conserva todo lo que hacía.

**Qué significa para el negocio**: el freelancer que entra ve primero el estado de su actividad y decide, en vez de aterrizar en una lista sin contexto. Y desde el inicio se puede crear un presupuesto directamente, así que el camino corto —el de "son las once de la noche"— no se alarga ni un paso (SC-009).

**Por qué no un aviso o un panel dentro de la propia lista**: mezclaría dos cosas distintas en una pantalla que en móvil ya va justa, y dejaría la aplicación sin un sitio neutro al que volver. Además, el encargo pide explícitamente una página de inicio.

**Consecuencia asumida**: quien tuviera guardada en favoritos la dirección de la aplicación ahora aterriza en el inicio, no en la lista. No se pierde nada y es la intención del cambio.

---

## Decisión 6 — La navegación común se completa, no se reinventa

**Decisión**: se reutiliza la barra de secciones que ya existe, añadiéndole Inicio y una marca visible de en qué sección está el freelancer. En móvil, si los cinco accesos no caben en una línea, **pasan a la siguiente**.

**Qué significa para el negocio**: se cumple lo de moverse entre secciones sin recurrir al botón "atrás" (FR-005) sin rehacer nada de lo que ya funciona.

**Por qué no un menú desplegable ni una barra inferior**: un menú escondería los accesos detrás de un toque extra, y FR-005 pide que estén **visibles**; una barra inferior fija es más de lo que pide el encargo y come pantalla en el móvil, justo donde se editan las líneas. Que los accesos salten de línea es feo de imaginar y cómodo de usar: siguen todos a la vista y a un solo toque.

---

## Decisión 7 — El PDF cambia de maquetación, no de contenido

**Decisión**: se rediseña el reparto del espacio —una banda de cabecera con el acento, más aire entre bloques, una tabla más ligera y un total claramente destacado—, manteniendo **exactamente** los bloques, el orden y los textos que fija el [contrato de la 001](../001-presupuestos-freelancer/contracts/pdf-documento.md).

**Qué significa para el negocio**: el cliente final recibe un documento que transmite más oficio, pero que dice lo mismo, al céntimo. Un presupuesto ya enviado puede volver a descargarse y seguirá cuadrando con el que recibió el cliente.

**Lo que NO entra en el PDF**: la situación del presupuesto. Borrador, Vigente o Caducado son información **para el freelancer**, no para su cliente; sacar "Borrador" impreso en un presupuesto enviado sería un disparo en el pie. El contrato de la 001 no la incluye y FR-020 prohíbe cambiar el contenido.

**Lo que hay que respetar sí o sí al mover cosas de sitio**: la tabla sigue repitiendo su cabecera al cambiar de página y el bloque de totales sigue sin partirse (FR-022). Son las dos cosas que una maquetación nueva rompe con más facilidad.

---

## Decisión 8 — Cómo se demuestra que no se ha roto nada

**Decisión**: la garantía descansa en tres patas, sin montar infraestructura de pruebas nueva:

1. **Los módulos de dominio no se tocan.** Pantalla y PDF siguen pidiendo los importes al mismo sitio de siempre, así que sus pruebas siguen cubriendo el dinero.
2. **El acceso a los datos no se toca.** Ni una clave, ni un campo: lo guardado se sigue leyendo igual.
3. **Una comparación de "antes y después"** que hace una persona: mismo presupuesto, PDF viejo y PDF nuevo uno al lado del otro. Está en [quickstart.md](./quickstart.md).

**Por qué no pruebas automáticas del PDF o de la interfaz**: exigirían montar un navegador simulado o comparar imágenes, que es la infraestructura que la 001 descartó por el Principio I y que el Principio IV declara innecesaria —lo que se puede comprobar mirando el documento, se comprueba mirando el documento—.

---

## Riesgos asumidos conscientemente

| Riesgo | Impacto | Postura en esta versión |
|---|---|---|
| Al remaquetar el PDF se parte el bloque de totales o se pierde la cabecera repetida | Alto: es el entregable | Están escritos como criterios (FR-022) y se comprueban con un presupuesto largo en el guion de verificación |
| Tocar seis pantallas a la vez esconde sin querer algún botón | Medio | FR-014 lo prohíbe y el guion recorre pantalla por pantalla comprobando que todo lo de antes sigue estando |
| La regla de "caducado" falla por un día | Medio, y silencioso | Cubierto con pruebas automáticas de los dos bordes (Decisión 4) |
| Alguien cuenta "Borrador" como un estado de negocio y espera poder marcarlo | Bajo | La etiqueta es informativa y no hay ningún control para cambiarla; Enviado/Aceptado/Rechazado quedaron fuera de alcance con su motivo escrito |

## Descartado explícitamente (y por qué)

- **Modo oscuro y temas alternativos**: no los pide la spec (Principio III), y duplicarían el trabajo de comprobar contraste en cada pantalla.
- **Librería de componentes o de iconos**: dependencias nuevas contra una lista cerrada, para seis pantallas.
- **Fuentes web**: peso, dependencia externa y un PDF que seguiría sin poder usarlas (Decisión 2).
- **Animaciones y transiciones**: "sobria" es justo lo contrario; además penalizan al móvil.
- **Guardar el estado Enviado/Aceptado/Rechazado**: fuera de alcance por decisión del usuario, recogida en las Clarifications de la spec.
- **Buscar, filtrar u ordenar la lista de presupuestos**: sería funcionalidad nueva aprovechando que se toca la pantalla. La constitución dice proponerlo como spec, no colarlo.
