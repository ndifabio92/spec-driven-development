# Research: Pantalla de inicio e imagen «Mediterráneo» (PresupuestosPro v1.1 → v1.3)

**Fecha**: 2026-09-19
**Spec**: [spec.md](./spec.md) · **Propuesta de origen**: [direccion-visual-mediterranea.md](../propuestas/direccion-visual-mediterranea.md)
**Constitución aplicada**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

## Punto de partida

Aquí no hay que elegir stack: lo fija la [spec 001](../001-presupuestos-freelancer/plan.md) y no se toca. Las decisiones de la v1.1 que **siguen en pie sin discusión** son tres, y se repiten aquí para que nadie las reabra:

- **Los tokens visuales viven en un único bloque del CSS y el generador del PDF los lee de ahí** (Decisión 1 de la v1.1). Es lo que hace que «definido en un único lugar» sea literal y no una promesa. Esta revisión la **amplía**: ahora hay que leer también tamaños, no solo colores.
- **La situación de un presupuesto se deduce, nunca se guarda ni se pregunta** (Decisión 4 de la v1.1). Intacta: FR-017, FR-017a y FR-017b no cambian y sus pruebas siguen valiendo.
- **El inicio es la entrada y la navegación común se completa, no se reinventa** (Decisiones 5 y 6 de la v1.1). Intactas. Lo único que se les añade es que la barra siga visible al desplazarse (FR-050).

Lo que esta revisión tiene que decidir es más estrecho: **cómo llevar una dirección visual con carácter a una pantalla y a un PDF que se dibuja punto por punto, sin añadir dependencias, sin tocar un céntimo y sin romper lo que ya funciona**. Once decisiones.

---

## Decisión 1 — Las tipografías viajan dentro del producto, no se piden a un tercero

**Decisión**: los archivos de tipografía se guardan en el repositorio y se sirven desde el propio alojamiento, junto al resto de `dist/`. **Ninguna petición a Google Fonts ni a ningún CDN.** El respaldo declarado es la tipografía del sistema, así que si un archivo no llega, la aplicación sigue legible.

**Qué significa para el negocio**: la dirección del freelancer nunca viaja a un servidor ajeno para conseguir una letra (Principio V), la aplicación sigue funcionando sin conexión después de la primera carga (SC-028) y no hay un tercero que pueda caerse y dejar el producto feo.

**Por qué no `@fontsource` ni un paquete de npm**: sería **una dependencia nueva** contra una lista cerrada, y solo para copiar dos archivos binarios a `dist/`. Los archivos se copian sin intermediario. **No se añade ningún paquete**, así que la lista cerrada de dependencias de la constitución no se toca.

**Consecuencia que hay que asumir y documentar**: distribuir una tipografía obliga a **incluir su licencia** en el producto. Las dos elegidas son de licencia abierta (SIL Open Font License), y el archivo de licencia viaja con ellas. Es un requisito legal, no un detalle: sin él, publicar `dist/` incumple la licencia de la fuente.

---

## Decisión 2 — Dos archivos, no cuatro: se usan fuentes variables

**Decisión**: **dos archivos**, en formato `woff2` y con el juego de caracteres latino:

| Archivo | Para qué |
|---|---|
| Familia de lectura, **variable** (un solo archivo cubre los tres grosores: 400, 500 y 700) | Cuerpo, campos, rótulos, importes |
| Familia de titulares, **un solo grosor fuerte** | Título de pantalla y marca |

**Qué significa para el negocio**: el tope que fijó la spec era de cuatro archivos (D3); se entregan **dos**. Un archivo variable pesa parecido a un grosor estático y da los tres, así que se ahorran dos descargas y el producto arranca antes.

**Por qué no la familia de titulares también variable**: sus ejes de variación (anchura y tamaño óptico) engordan el archivo sin que esta dirección los use: se necesita **un** grosor fuerte y nada más. La versión estática es más pequeña.

**Cómo se evita el salto de maquetación** (el caso raro de la spec: «las letras no llegan a cargarse»): la familia de lectura se **precarga** en la página, y se declara con intercambio inmediato de respaldo. Como el archivo viaja en el mismo alojamiento, la ventana en la que se ve la letra del sistema es de milisegundos; y si nunca llega, todo sigue legible con el respaldo.

---

## Decisión 3 — El PDF no incrusta tipografías; el parecido se consigue con color, aire y jerarquía

**Decisión**: el documento mantiene la familia de métricas Helvetica/Arial que el PDF lleva de serie. Lo que adopta de la dirección nueva es la **paleta**, la **escala de espaciado** y la **jerarquía** (FR-019, FR-052).

**Qué significa para el negocio**: el cliente recibe un documento con la cara nueva sin que cada descarga engorde. Una tipografía incrustada se repite **en cada PDF**, así que en la exportación en lote el coste se multiplica por el número de presupuestos — exactamente la trampa que ya documenta `CLAUDE.md` para el logo.

**Consecuencia asumida y escrita en la spec**: la aplicación y el PDF se reconocen como el mismo producto por su color, su aire y su jerarquía, **no** por la forma exacta de la letra (D1 de las Clarifications).

**Alternativa descartada**: incrustar un subconjunto de la familia de lectura. Se descarta por peso por documento y por FR-053; merece su propia spec con un presupuesto medido.

---

## Decisión 4 — El documento tiene su propia conversión de la escala: 1 rem = 9 pt

**Decisión**: los tamaños del PDF dejan de estar escritos a mano y se derivan de la escala tipográfica del sistema con **una conversión declarada: 1 rem = 9 pt**.

| Nivel del sistema | En pantalla | En el documento |
|---|---|---|
| Apoyo | 0,875 rem | 7,9 pt |
| Texto y campos | 1 rem | 9 pt |
| Título de bloque | 1,25 rem | 11,25 pt |
| Título de pantalla | 1,75 rem | 15,75 pt |
| Total a pagar | 2 rem | **18 pt** |

**Qué significa para el negocio**: el total pasa a ser el elemento mayor del documento (14 pt hoy → 18 pt), y el número del presupuesto baja de 24 pt a 15,75 pt, donde le corresponde. La densidad del documento **no cambia**: el texto de la tabla se queda en los 9 pt de siempre.

**Por qué 9 pt y no la conversión directa** (1 rem = 16 px = 12 pt): con 12 pt de texto base, la tabla de líneas crecería un 33 %, un presupuesto largo ocuparía más páginas y el archivo pesaría más — poniendo en riesgo FR-053 y la exportación en lote. La conversión es una **decisión de producto declarada**, no un descuido: el documento es más denso que una pantalla, y siempre lo fue.

**Lo que esto arregla de fondo**: hoy el generador tiene catorce tamaños escritos a mano (8, 9, 9.5, 10, 12, 14, 24…). Después, todos salen de la escala, igual que ya salían los colores. Es la mitad de FR-051.

---

## Decisión 5 — Los tokens se mantienen legibles por máquina: la fluidez vive en la regla, no en el valor

**Decisión**: el título de pantalla es fluido —28 px en móvil, hasta 36 px en escritorio— pero **la expresión que lo hace fluido está en la regla del título, no dentro del token**. Los dos extremos son dos tokens de valor plano.

**Por qué es importante y no un detalle de estilo**: el generador del PDF lee los tokens preguntándoselos al navegador, y lo que recibe es **el texto tal y como está escrito**, no un valor resuelto. Si el token fuese la expresión fluida, el PDF recibiría una fórmula que no sabe interpretar y caería a su valor de respaldo sin avisar: un documento con tamaños silenciosamente equivocados. Con los dos extremos como valores planos, el PDF lee el que le corresponde y la pantalla compone la fluidez a partir de ellos.

**Regla general que queda escrita en el contrato**: **todo token que el PDF necesite leer es un valor plano.** Las expresiones calculadas (fluidez, mezclas de color) se permiten en las reglas que las usan, nunca en el valor del token.

---

## Decisión 6 — Los tonos derivados que el PDF necesita pasan a ser tokens propios; los demás siguen calculados

**Decisión**: los rellenos teñidos y las líneas intermedias que hoy se calculan mezclando colores dentro de las reglas pasan a ser **tokens con su propio valor** cuando el PDF los necesita —el relleno del desglose y la línea que estructura la tabla—, y siguen calculados cuando solo viven en pantalla —el relleno de las etiquetas de situación—.

**Por qué no convertirlo todo en token**: multiplicaría la paleta por dos sin que nadie tome una decisión nueva; una mezcla derivada de un token no es un color suelto, es ese mismo token más suave. La frontera la marca quién tiene que leerlo: **si lo lee el PDF, es un token plano; si solo lo pinta el navegador, puede seguir siendo una mezcla.**

**Lo que esto arregla**: hoy hay ocho mezclas escritas dentro de las reglas y el PDF no puede ver ninguna. Por eso el desglose del documento no puede compartir el relleno con la pantalla.

---

## Decisión 7 — Dos hallazgos de contraste que corrigen la paleta de la propuesta

Al comprobar la paleta contra el mínimo que exige FR-037 aparecieron dos valores que no llegaban. **Se corrigen aquí y se corrige la tabla de la spec**, en lugar de descubrirlo en la verificación manual:

| Valor propuesto | Problema | Valor que se adopta |
|---|---|---|
| Tinta tenue `#A3958C` para el texto inactivo | **2,9:1** sobre papel. Ni siquiera llega al 3:1 de los elementos de interfaz, así que un botón desactivado sería ilegible | **`#8D7D74`** — 3,9:1. Sigue leyéndose como «inactivo» porque queda claramente por detrás del texto secundario (5,2:1), pero se lee |
| Línea `#F0E2D8` como borde de los campos | **1,27:1**. Como borde decorativo entre filas es perfecto; como **única señal de que ahí hay un campo donde escribir** incumple el mínimo de 3:1 | Se añade **borde de control `#A08A7C`** — 3,3:1, solo para el contorno de campos, desplegables y botones secundarios |

**Regla que se deriva**: hay **tres** tokens de línea con trabajos distintos —separación decorativa entre filas, separación que estructura (cabecera de tabla y regla del total) y contorno de un control donde se puede escribir o pulsar—. Confundirlos es lo que deja un formulario sin contraste.

**Nota sobre el texto inactivo**: las pautas de accesibilidad eximen a los controles desactivados del mínimo de 4,5:1, y esta revisión se acoge a esa excepción de forma explícita, pero **no** por debajo de 3:1. FR-044 pide que el texto de un elemento inactivo se siga leyendo, y 2,9:1 no lo cumplía.

---

## Decisión 8 — La escala de espaciado se cambia en dos pasos, y el primero no se ve

**Decisión**: FR-041 se cumple partiendo el cambio en dos, en este orden:

**Paso 1 — renombrar, sin tocar nada de lo que se ve.** Cada peldaño actual pasa a su nombre nuevo conservando su valor, y se declaran los dos peldaños que aún no se usan:

| Hoy | Valor | Pasa a llamarse | Valor tras el paso 1 |
|---|---|---|---|
| `--espacio-1` | 0,25 rem | `--espacio-1` | 0,25 rem (igual) |
| — | — | `--espacio-2` | 0,5 rem (**nuevo, todavía sin usar**) |
| `--espacio-2` | 0,75 rem | `--espacio-3` | 0,75 rem |
| `--espacio-3` | 1 rem | `--espacio-4` | 1 rem |
| `--espacio-4` | 1,5 rem | `--espacio-5` | 1,5 rem |
| `--espacio-5` | 2,5 rem | `--espacio-6` | **2,5 rem de momento** |
| — | — | `--espacio-7` | 3 rem (**nuevo, todavía sin usar**) |

Al terminar el paso 1, la aplicación se ve **exactamente igual que antes**. Es lo que lo hace verificable: si algo se movió, hay un error de renombrado.

**Paso 2 — ajustar valores y repartir los peldaños nuevos.** `--espacio-6` pasa a 2 rem, el aire entre secciones pasa a `--espacio-7`, y los huecos pequeños que hoy usan 4 px pasan a los 8 px de `--espacio-2`. Cada movimiento es una decisión visible y revisable.

**Por qué no de golpe**: cambiar nombre y valor a la vez significa que **ninguna diferencia es atribuible**. Con más de cien usos en la hoja de estilos, un error de renombrado quedaría escondido detrás de un cambio de diseño y se descubriría en producción.

---

## Decisión 9 — Los estados se resuelven una vez, en un sitio, para todos los controles

**Decisión**: los seis estados de FR-043 se escriben **una vez** sobre las clases base que ya existen (botón, enlace de navegación, acceso, campo), no control a control. El estado inactivo deja de apagarse con transparencia y pasa a tener fondo, borde y color de texto propios.

**Qué significa para el negocio**: hoy el mismo concepto está resuelto de dos maneras distintas —dos valores de transparencia diferentes para «desactivado»— y ninguna de las dos se lee bien. Después habrá un solo tratamiento, aplicado en todas partes, y el freelancer sabrá siempre qué puede pulsar.

**Por qué no un componente nuevo que envuelva a los controles**: el producto ya tiene sus componentes y el Principio I manda; el problema no es de estructura, es que las reglas de estado no estaban escritas. Se escriben.

**El movimiento se apaga entero cuando el sistema lo pide**: una sola regla global anula transiciones y animaciones cuando el freelancer tiene activado «reducir movimiento», y los estados siguen siendo perceptibles porque se distinguen por color y posición, no por la animación (FR-046).

---

## Decisión 10 — La barra de secciones se queda pegada arriba, y eso obliga a mantenerla baja

**Decisión**: la navegación común se ancla a la parte superior y sigue visible al desplazarse (FR-050).

**La consecuencia que hay que vigilar**: en un móvil, el total a pagar ya está anclado abajo mientras se editan las líneas. Con la barra anclada arriba, el alto útil se reduce por los dos lados. Por eso la barra **tiene que caber en una línea** en móvil y quedarse en unos 56 px: si los cinco accesos saltan a dos líneas y encima se queda pegada, se come la pantalla justo donde se trabaja.

**Cómo se resuelve sin esconder nada**: los cinco accesos siguen visibles y en una sola línea en móvil gracias al peldaño de 8 px y a un relleno lateral más ajustado en esa anchura; lo que no se toca es la zona pulsable de 44 px. Si en la verificación manual no cupieran, la salida **no** es un menú desplegable —FR-005 lo prohíbe— sino dejar de anclar la barra en móvil y mantenerla anclada solo en escritorio.

---

## Decisión 11 — El tercer punto de ruptura reparte, no añade pantallas

**Decisión**: se añade un segundo punto de ruptura en escritorio ancho. Lo que hace es **repartir en dos columnas** lo que hoy es una pila de tarjetas (el resumen de actividad junto a los accesos en el inicio; el desglose junto a la tabla en el editor) y limitar el ancho de los párrafos largos. No aparece ninguna pantalla nueva ni ningún elemento que no exista hoy.

**Qué significa para el negocio**: el freelancer que trabaja en un monitor grande deja de ver su herramienta como una columna estrecha entre dos franjas vacías (FR-048), sin que el móvil —donde más se usa— cambie en nada.

**El detalle que arregla la fila huérfana** (FR-049): el resumen de actividad son **cinco** cifras, y una rejilla que las coloca «las que quepan» produce filas de cuatro más una. Se reparte en un número de columnas declarado por anchura, de forma que nunca quede una sola cifra suelta.

---

---

## Hallazgo al cerrar el diseño — la escala contra su propio requisito

Al comprobar la escala contra FR-032 apareció una contradicción **en la propia spec**: el requisito exigía 4 px mínimos entre niveles, y la escala elegida pone el apoyo a 14 px con el texto base a 16. Dos píxeles, exactamente el defecto que originó el requisito.

**Cómo se resuelve**: el requisito estaba mal enunciado, no la escala. Los 2 px que molestan son los que separan un **título de bloque** del párrafo que le sigue, porque un título tiene que anunciarse; los 2 px entre el texto normal y el texto de apoyo son el patrón correcto de toda la vida, y además el apoyo se distingue por color (`--color-tinta-suave`) y por su papel.

FR-032 se reformula: **la distancia mínima de 4 px se exige entre el texto normal y cada nivel por encima de él** —título de bloque, título de pantalla y total—, y el nivel de apoyo queda por debajo a 2 px a propósito. La escala no cambia: 14 · 16 · 20 · 28→36 · 32.

**Por qué se anota**: es el tipo de contradicción que, sin registrar, reaparece en la verificación manual como un «esto no cumple FR-032» y termina con alguien subiendo el apoyo a 12 px, que es justo lo que el suelo de 16 px quiere evitar en móvil.

## Riesgos asumidos conscientemente

| Riesgo | Impacto | Postura en esta revisión |
|---|---|---|
| El renombrado del espaciado descuadra las seis pantallas en silencio | Alto, y difícil de atribuir | Decisión 8: el paso 1 no cambia nada visible y se verifica antes de seguir |
| El PDF lee un token que no es un valor plano y cae al respaldo sin avisar | Alto: documento con tamaños equivocados y nadie se entera | Decisión 5: regla escrita en el contrato. El respaldo del lector sigue existiendo, pero deja de ser un camino silencioso para los tamaños |
| Al remaquetar el PDF se parte el bloque de totales o se pierde la cabecera repetida | Alto: es el entregable | FR-022, ya escrito; se comprueba con un presupuesto largo en el guion |
| El total sube a 18 pt y el bloque de totales deja de caber donde cabía | Medio | Se comprueba en el mismo apartado del guion que la cabecera repetida |
| La barra anclada arriba más el total anclado abajo dejan sin sitio al editor en un móvil pequeño | Medio | Decisión 10, con salida escrita: dejar de anclar en móvil antes que esconder accesos |
| La familia de titulares resulta ruidosa en títulos largos | Bajo | Limitada al título de pantalla y a la marca; la salida es caer a una sola familia sin rehacer nada |
| El acento del documento choca con el logo del freelancer | Bajo | Acento fijo y aire entre los dos; se comprueba con un logo de colores fríos |
| Tocar seis pantallas esconde sin querer algún botón | Medio | FR-014 lo prohíbe y el guion recorre pantalla por pantalla |

## Descartado explícitamente (y por qué)

- **Modo oscuro y temas alternativos**: no los pide la spec (Principio III) y duplicarían el trabajo de contraste. Renuncia consciente, recogida en D4.
- **Pedir las tipografías a un servicio externo**: filtra la dirección del freelancer a un tercero (Principio V) y rompe SC-028.
- **Un paquete de npm para las fuentes**: dependencia nueva para copiar dos archivos.
- **Incrustar tipografías en el PDF**: peso por documento y riesgo en la exportación en lote (Decisión 3).
- **Librería de componentes, framework de CSS o librería de iconos**: dependencias nuevas contra una lista cerrada, para seis pantallas.
- **Un paso de compilación que genere los tokens para pantalla y PDF desde un archivo común**: infraestructura nueva para algo que ya funciona leyendo del CSS (Decisión 1 de la v1.1).
- **Animaciones de entrada, ilustraciones e iconografía**: fuera de alcance por la propia spec.
- **Pruebas automáticas de interfaz o de PDF**: la verificación la hace una persona (Principio IV). Esta revisión **no añade ni una prueba automática**, porque no añade ni una regla de dominio: la situación, el cálculo y el formato no se tocan.
