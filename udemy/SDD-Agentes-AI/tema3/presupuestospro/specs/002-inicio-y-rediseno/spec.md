# Feature Specification: Pantalla de inicio e imagen «Mediterráneo» (PresupuestosPro v1.1 → v1.3)

**Feature Branch**: `002-inicio-y-rediseno`

**Created**: 2026-09-19

**Revisada**: 2026-09-19 — reescritura completa de la capa visual. Las historias 1 y 4 ya están entregadas y no cambian; la dirección visual de toda la aplicación y del PDF se redefine.

**Status**: Revisada — lista para `/speckit-plan`

**Input**: User description: "Mejorar la presentación de PresupuestosPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente. Primero: añadir una página de inicio (index) que sea el punto de entrada de la aplicación al acceder a la raíz del servidor, con navegación clara hacia las cuatro secciones existentes (Presupuestos, Clientes, Catálogo y Perfil) y un pequeño resumen de actividad (por ejemplo, número de presupuestos por estado). Además, todas las páginas deben compartir una navegación común visible para moverse entre secciones sin usar el botón atrás. Segundo: rediseñar la apariencia visual de toda la aplicación para que resulte profesional y sobria: tipografía consistente, paleta de colores limitada definida en un único lugar, espaciado uniforme, jerarquía visual clara entre títulos, tablas, formularios y totales, y estados visuales distinguibles para los presupuestos (Borrador, Enviado, Aceptado, Rechazado, Caducado). El rediseño debe aplicarse también a la plantilla del PDF para que el documento que recibe el cliente transmita la misma imagen profesional. Debe mantenerse el enfoque mobile-first ya existente y todos los textos en español de España. La lógica de negocio, los cálculos, la API y el esquema de datos no deben cambiar en absoluto."

**Input de la revisión**: "Reescribir esta spec, no crear una nueva. Los criterios de modificación están en [`specs/propuestas/direccion-visual-mediterranea.md`](../propuestas/direccion-visual-mediterranea.md). Ajustar la spec 002 por completo para que refleje todos los cambios de ese documento."

**Documento base de la revisión**: [Pre-especificación: dirección visual «Mediterráneo»](../propuestas/direccion-visual-mediterranea.md). Cada criterio de aceptación de esa propuesta (CA-001 … CA-026) está trazado a un criterio de éxito de esta spec.

## Estado de la revisión

La v1.1 de esta spec está **implementada**. La revisión no la tira: conserva lo que ya funciona y **sustituye la dirección visual**, que resultó sobria pero genérica. Esto es lo que cambia y lo que no:

| Parte de la spec | Estado | Qué le pasa en la revisión |
|---|---|---|
| Historia 1 — Inicio y navegación común | **Entregada** (v1.1) | Se conserva entera. Solo se le añade que la navegación siga visible al desplazarse (FR-043) |
| Historia 4 — Situación de cada presupuesto | **Entregada** (v1.1) | Se conserva entera. Único cambio: *Vigente* deja el acento y pasa al oliva, porque el acento ya no puede significar dos cosas (FR-032) |
| Historia 2 — Imagen de la aplicación | **Se rehace** | Cambia de «sobria y coherente» a una dirección con carácter propio: dos familias tipográficas, paleta cálida, escala de espaciado completa, tres radios y tres elevaciones |
| Historia 3 — Imagen del PDF | **Se rehace** | Nueva paleta, nuevo aire y el total a pagar como elemento mayor del documento. Su contenido sigue intacto |
| Historia 5 — Estados e interacción | **Nueva** | Hoy no existen: `hover` imperceptible, ningún estado pulsado, un único movimiento en toda la aplicación |
| Historia 6 — Densidad y adaptación | **Nueva** | Hoy hay un único punto de ruptura y una columna estrecha centrada; la cabecera se va con el desplazamiento |
| Cálculos, datos, numeración y lo que el PDF *dice* | **Intactos** | FR-024 … FR-030. No se toca ni un céntimo ni un rótulo |

**Numeración**: FR-001 … FR-026 conservan su número y su significado porque el código ya los cita en sus comentarios. Todo lo que aporta la revisión entra a partir de **FR-027**.

## Clarifications

### Session 2026-09-19 (spec original)

- Q: El encargo pide cinco situaciones para los presupuestos (Borrador, Enviado, Aceptado, Rechazado, Caducado) y a la vez que el esquema de datos no cambie. Con los datos de la spec 001 solo son deducibles dos de ellas. ¿Qué prevalece? → A: Prevalece no tocar los datos. Se reconocen únicamente las situaciones que pueden deducirse de lo ya guardado — **Borrador**, **Vigente** y **Caducado** — y esta funcionalidad sigue siendo un cambio de presentación puro. Registrar si un presupuesto se ha enviado, aceptado o rechazado queda fuera de alcance y, si algún día se quiere, deberá pasar por su propia spec.

### Session 2026-09-19 (revisión «Mediterráneo»)

Las seis decisiones que la pre-especificación dejó abiertas (D1 … D6) se cierran aquí, cada una según la recomendación de ese documento. Son reversibles: cambiarlas es volver a pasar por `/speckit-clarify`.

- Q (D1): La tipografía nueva, ¿viaja al PDF? El contrato vigente prohíbe incrustar fuentes en el documento. → A: **No se incrustan fuentes.** El PDF adopta la paleta, el aire y la jerarquía de la dirección nueva, y mantiene la familia de métricas del sistema que ya usa. Motivo: una fuente incrustada se repite **en cada documento**, igual que el logo, así que el coste de la exportación en lote crece con el número de presupuestos. Incrustar tipografía necesitaría su propia spec, con un presupuesto de peso medido. Consecuencia aceptada: la aplicación y el PDF se reconocen como el mismo producto por color, aire y jerarquía, **no** por la forma exacta de la letra (FR-044).
- Q (D2): ¿Una familia tipográfica o dos? → A: **Dos.** Una de titulares, con carácter, limitada al título de pantalla y a la marca; otra de lectura para todo lo demás. Si en la verificación manual la de titulares resulta ruidosa en móvil, se cae a una sola familia sin rehacer nada más (FR-027).
- Q (D3): ¿Cuántos archivos de fuente entran en el producto? → A: **Cuatro como máximo**, con el juego de caracteres latino, servidos desde la propia aplicación y nunca desde un tercero (FR-031). Es la primera vez que el producto añade un recurso externo desde `fflate`, así que el plan debe justificarlo contra el Principio I de la constitución.
- Q (D4): ¿Modo oscuro? → A: **Fuera de alcance**, igual que en la v1.1. Esta dirección es papel cálido y el PDF es siempre papel blanco: un tema oscuro duplicaría la paleta sin mejorar el documento. Es una renuncia consciente, no un olvido.
- Q (D5): El acento del PDF puede chocar con el logo del freelancer. ¿Se hace configurable? → A: **No.** El acento del documento es fijo y la banda no se tiñe con el logo. Si el choque molesta, se resuelve con aire y separación, nunca con una paleta configurable (FR-032, Out of Scope).
- Q (D6): La escala de espaciado nueva reutiliza nombres que hoy valen otra cosa. ¿Renombrar o reasignar? → A: **Renombrar primero**, en un paso propio y verificable, antes de tocar un solo valor visual. Si no, cada separación del producto cambia en silencio y el ritmo de las seis pantallas se descuadra sin que nadie lo haya decidido (FR-036).

## Contexto

PresupuestosPro ya funciona: calcula impuestos, numera presupuestos y genera el PDF que recibe el cliente ([spec 001](../001-presupuestos-freelancer/spec.md)), y desde la v1.1 tiene pantalla de inicio, navegación común y situación deducida por presupuesto. Desde la v1.2 exporta una copia en `.zip` ([spec 003](../003-exportar-copia-zip/spec.md)).

Esta revisión **no añade capacidades nuevas al producto**: cambia cómo se ve y cómo responde. Todo lo que hoy se puede hacer se seguirá pudiendo hacer, con los mismos importes, el mismo número y el mismo contenido en el PDF.

La regla que manda sobre todo lo que sigue, igual que en la v1.1: **si un cambio altera un cálculo, un dato guardado o lo que *dice* el PDF, no pertenece a esta spec**.

### Por qué se rehace la capa visual

El sistema visual de la v1.1 cumplió su encargo —tokens en un único sitio, paleta corta, mobile-first— pero el resultado no distingue al producto de cualquier plantilla. Siete problemas concretos, cada uno con su requisito de salida en esta revisión:

1. **Tipografía sin decisión**: la familia es la pila del sistema y la escala no progresa; el título de sección queda 2 px por encima del párrafo y el subtítulo de bloque tiene exactamente el mismo tamaño que el texto normal. → FR-027, FR-028.
2. **Un solo peso hace de jerarquía**: rótulo de campo, pastilla de navegación, botón, importe, etiqueta de situación y mensaje de error comparten el mismo grosor y casi el mismo tamaño. El dinero pesa lo mismo que el rótulo de un formulario. → FR-029, FR-030.
3. **Gris sobre gris y un acento que hace de todo**: el lienzo y las superficies se diferencian en un 2 % de luminosidad, y un mismo color marca marca, enlace, sección activa, botón principal, progreso y situación *Vigente*. → FR-032, FR-034.
4. **La escala de espaciado está rota**: falta el peldaño intermedio, y eso deja 4 px de hueco entre accesos de 44 px y una etiqueta de situación sin aire por arriba ni por abajo. → FR-035, FR-036.
5. **Nueve componentes con el mismo dibujo**: tarjeta, cifra, acceso, resumen, agrupador, campo, botón, imagen y fila de tabla comparten fondo, borde y esquina, con una única elevación para toda la aplicación. → FR-037.
6. **Los estados casi no existen**: el cambio al pasar por encima es imperceptible, no hay estado pulsado, lo inactivo se apaga con transparencia (con dos valores distintos) y hay un único movimiento en todo el producto. → FR-038 … FR-041.
7. **Densidad de sitio web, no de aplicación**: un único punto de ruptura, una columna estrecha centrada entre dos franjas vacías en monitor ancho, y la cabecera que se va con el desplazamiento. → FR-042, FR-043.

## Dirección visual elegida (decisión de producto)

Se evaluaron tres direcciones y se elige la **C — «Mediterráneo»**.

**Referencias**: **Holded** (calidez sin infantilismo, color valiente en las acciones) y **Qonto** (acento saturado sobre neutros cálidos, jerarquía construida con tamaño y aire, no con bordes).

**Qué es**: neutros cálidos de papel en lugar de grises fríos; terracota para todo lo pulsable y para la marca; oliva para lo que va bien; titulares con carácter y cuerpo de lectura; esquinas amplias, aire generoso y cifras de ancho fijo. El total a pagar deja de competir con nada.

**Qué transmite al cliente que recibe el presupuesto**: «detrás de esto hay una persona, y le importa». Cercanía sin blandura; el documento se lee rápido, el total es inequívoco y el conjunto parece hecho por un profesional con criterio en lugar de exportado de una plantilla. Encaja cuando el destinatario es pyme, estudio, agencia o particular.

**Por qué esta y no las otras dos**: la A («Papel Timbrado», serif editorial) transmite autoridad fiscal pero acerca el producto a un documento notarial; la B («Instrumento», densa y fría) optimiza para quien vive dentro de la herramienta, no para quien recibe el documento, y su modo oscuro nativo no tiene sentido en un PDF que siempre es papel blanco. La C es la única que mejora las dos caras del producto con la misma decisión.

**Lo que esta dirección hereda y no discute**: mobile-first, una columna en móvil, 44 px de zona pulsable, 16 px reales de texto mínimo, el color nunca como único portador de información, y los valores visuales definidos en un único sitio.

### Paleta

Los valores son decisión de producto: son lo que el cliente ve en el documento y lo que se compara a ojo contra esta tabla impresa durante la verificación. El nombre técnico de cada uno y las reglas de uso a nivel de hoja de estilos viven en [`contracts/sistema-visual.md`](./contracts/sistema-visual.md), que `/speckit-plan` debe enmendar.

| Color | Valor | Papel |
|---|---|---|
| Fondo | `#FFF8F3` | Lienzo cálido de la página |
| Papel | `#FFFFFF` | Superficies: tarjetas, campos, cabecera |
| Tinta | `#241A15` | Texto principal, títulos, importes |
| Tinta suave | `#7A6A62` | Texto secundario, ayudas, rótulos menores |
| Tinta tenue | `#8D7D74` | **Nuevo.** Texto inactivo: sustituye a apagar con transparencia |
| Línea | `#F0E2D8` | Separación **decorativa**: entre filas de una lista, borde de una tarjeta |
| Línea fuerte | `#E0CBBD` | **Nuevo.** Separación **que estructura**: cabecera de tabla, regla del total |
| Borde de control | `#A08A7C` | **Nuevo.** Contorno de lo que se puede escribir o pulsar: campos, desplegables, botones secundarios |
| Acento (terracota) | `#B34A25` | Marca, botón principal, enlaces, sección actual, progreso |
| Acento pulsado | `#8F3A1C` | **Nuevo.** El acento al pasar por encima y al pulsar |
| Acento suave | `#FBEBE3` | **Nuevo.** Relleno teñido: sección actual, bloque destacado, desglose del PDF |
| Oliva | `#4E5F33` | **Nuevo.** Lo que va bien: situación *Vigente* y confirmaciones |
| Atención | `#8A5A0E` | Avisos que no son fallos, situación *Caducado* |
| Error | `#A32A22` | Algo que corregir, acciones destructivas |

Tres valores de esta tabla están donde están **por contraste**, no por gusto, y no se cambian sin recalcularlo (FR-037):

- El terracota es `#B34A25` y no el `#C4562F` de la propuesta original: ese se queda en 4,48:1 sobre blanco y no llega al mínimo para texto normal.
- La tinta tenue es `#8D7D74` y no el `#A3958C` de la propuesta: ese se queda en 2,9:1 y dejaría ilegible el texto de un botón desactivado. El valor adoptado da 3,9:1 y sigue leyéndose como «inactivo» porque queda por detrás del texto secundario (5,2:1).
- El **borde de control** no estaba en la propuesta y hace falta: `#F0E2D8` da 1,27:1, perfecto como separación decorativa pero insuficiente cuando es **la única señal de que ahí hay un campo donde escribir**. `#A08A7C` da 3,3:1. De ahí que haya tres tonos de línea con tres trabajos distintos, y que el contorno de un campo nunca use el de separar filas.

### Tipografía

| Nivel | Tamaño | Peso | Uso |
|---|---|---|---|
| Título de pantalla | 28 px en móvil, creciendo con fluidez hasta 36 px en escritorio | Fuerte | Solo el título de la pantalla, con la familia de titulares |
| Total a pagar | 32 px | Fuerte | El dato que más se busca, en pantalla y en el PDF |
| Título de bloque | 20 px | Medio | Secciones dentro de una pantalla |
| Texto y campos | 16 px | Normal | **Suelo infranqueable**: por debajo, el móvil hace zoom solo |
| Apoyo | 14 px | Normal o medio | Ayudas, datos secundarios, cabeceras de tabla |

Dos familias: una **de titulares**, con carácter, limitada al título de pantalla y a la marca; otra **de lectura** para todo lo demás, incluidos los importes. Tres pesos con trabajo asignado —normal para texto corrido, medio para rótulos y navegación, fuerte para títulos, importes y total— en lugar del grosor único de hoy.

### Espaciado, forma y movimiento

- **Espaciado**: siete peldaños de base 4 — 4, 8, 12, 16, 24, 32 y 48 px. El peldaño de **8 px**, que hoy no existe, es el que arregla los huecos de la navegación y el aire de las etiquetas.
- **Esquinas**: tres grados — 8 px para campos y etiquetas, 14 px para botones y tarjetas, 20 px para la tarjeta destacada y el bloque de totales — más la forma de pastilla completa para la etiqueta de situación. El campo y la tarjeta dejan de tener la misma esquina.
- **Elevación**: tres niveles — reposo, elevado y la sombra invertida del total pegado al borde inferior en móvil — en lugar de la única sombra actual.
- **Movimiento**: dos duraciones, 120 ms para color y fondo y 200 ms para tamaño y posición. Con «reducir movimiento» activado en el sistema, ninguna.
- **Anchura**: la aplicación ocupa hasta unos 1.090 px de ancho y los párrafos largos no pasan de unos 670 px, con dos puntos de ruptura (móvil → escritorio y escritorio ancho) en lugar del único de hoy.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar y saber dónde estoy (Entregada en v1.1)

Como freelancer, quiero que al abrir la aplicación me reciba una pantalla de inicio con accesos claros a Presupuestos, Clientes, Catálogo y Perfil, y un resumen de cómo va mi actividad, para orientarme de un vistazo en vez de aterrizar directamente en una lista.

**Estado**: entregada. La revisión **no la modifica**, salvo que la navegación común pasa a seguir visible al desplazarse (FR-043).

**Independent Test**: abrir la aplicación en su dirección web y comprobar que la primera pantalla es el inicio, que desde ella se llega a las cuatro secciones, y que desde cualquier sección se vuelve a cualquier otra sin usar el botón "atrás".

**Acceptance Scenarios**:

1. **Given** un freelancer que abre la dirección web de la aplicación, **When** termina de cargar, **Then** la primera pantalla que ve es la de inicio, con acceso visible a Presupuestos, Clientes, Catálogo y Perfil.
2. **Given** la pantalla de inicio, **When** el freelancer la mira sin pulsar nada, **Then** ve cuántos presupuestos tiene en cada situación y cuántos clientes y servicios tiene guardados.
3. **Given** cualquier pantalla de la aplicación (incluida la de edición de un presupuesto), **When** el freelancer quiere cambiar de sección, **Then** encuentra la navegación común visible y llega a su destino en un solo toque, sin usar el botón "atrás".
4. **Given** un freelancer que acaba de instalar la aplicación y no tiene nada guardado, **When** abre el inicio, **Then** el resumen aparece a cero y se le indica por dónde empezar, en vez de mostrar una pantalla vacía sin explicación.
5. **Given** la pantalla de inicio, **When** el freelancer quiere crear un presupuesto, **Then** puede hacerlo desde ahí directamente, sin pasar antes por la lista.
6. **Given** una lista larga de presupuestos, **When** el freelancer se desplaza hacia abajo, **Then** la navegación común sigue visible sin tener que volver arriba.

---

### User Story 2 - Que la herramienta tenga carácter propio (Priority: P1)

Como freelancer, quiero que toda la aplicación tenga una imagen cálida, reconocible y coherente —dos tipografías con un trabajo claro cada una, una paleta corta con un significado por color, aire generoso y una jerarquía que ponga el dinero por encima de todo—, para trabajar con una herramienta que no parezca una plantilla.

**Why this priority**: es el corazón de la revisión y afecta a las seis pantallas. Todo lo demás de esta reescritura se apoya en el sistema que crea esta historia.

**Independent Test**: recorrer las seis pantallas en móvil y en escritorio con la tabla de paleta impresa al lado, y comprobar a simple vista que comparten familias, colores, ritmo y jerarquía, y que todo lo que se podía hacer antes se sigue pudiendo hacer.

**Acceptance Scenarios**:

1. **Given** las seis pantallas de la aplicación, **When** se recorren una tras otra, **Then** los títulos de pantalla usan la familia de titulares, todo lo demás la de lectura, y no aparece ningún color que no esté en la tabla de paleta.
2. **Given** la pantalla de inicio, **When** el freelancer la mira sin acercarse, **Then** distingue dónde acaba el fondo y dónde empieza cada tarjeta.
3. **Given** cualquier pantalla con formulario, **When** el freelancer la mira, **Then** distingue sin esfuerzo el título de la pantalla, los títulos de bloque, las etiquetas de los campos, los textos de ayuda y los mensajes de error, y ningún título de bloque tiene el mismo tamaño que el párrafo que lo sigue.
4. **Given** un presupuesto abierto, **When** se le pide a alguien que no conoce la aplicación que señale el dato más importante, **Then** señala el **Total a pagar**.
5. **Given** una fila de la lista de presupuestos, **When** el freelancer la mira, **Then** el importe destaca sobre la etiqueta de situación que tiene al lado.
6. **Given** cualquier importe de la aplicación, **When** se compara con el importe de la fila de arriba, **Then** las cifras quedan alineadas en columna, sin bailar de anchura.
7. **Given** un presupuesto creado antes de la revisión, **When** se abre después, **Then** muestra exactamente el mismo número, las mismas líneas y los mismos importes.
8. **Given** un teléfono, **When** el freelancer usa cualquier pantalla, **Then** todo se lee sin hacer zoom y las zonas pulsables se aciertan con el pulgar.
9. **Given** la aplicación ya abierta una vez y el dispositivo sin conexión, **When** se recarga, **Then** la tipografía sigue siendo la misma: las letras no vienen de internet.

---

### User Story 3 - Que el PDF transmita lo mismo (Priority: P2)

Como freelancer, quiero que el PDF que recibe mi cliente tenga la misma imagen cuidada que la aplicación y un total imposible de no ver, para que el documento hable bien de mí.

**Why this priority**: el PDF es lo único que ve el cliente final. Va después de la historia 2 porque hereda su paleta y su escala, pero antes que el resto porque es la cara comercial del producto.

**Independent Test**: descargar el PDF de un presupuesto ya existente, ponerlo al lado del anterior y comprobar que contiene exactamente la misma información, presentada con la paleta, el aire y la jerarquía nuevos.

**Acceptance Scenarios**:

1. **Given** un presupuesto con líneas, **When** se descarga su PDF, **Then** el documento conserva todos los bloques obligatorios (logo, emisor, identificación, destinatario, tabla de líneas y desglose) y ninguno cambia de contenido.
2. **Given** el presupuesto del ejemplo de referencia, **When** se compara el PDF nuevo con el anterior, **Then** los cuatro importes del desglose y el número del presupuesto son idénticos.
3. **Given** el PDF nuevo, **When** se mira de un vistazo, **Then** el **Total a pagar** es el elemento tipográficamente mayor del documento.
4. **Given** un presupuesto de muchas líneas, **When** se descarga su PDF, **Then** la tabla sigue repitiendo su cabecera al cambiar de página y el bloque de totales sigue sin partirse.
5. **Given** el PDF nuevo abierto junto a la aplicación, **When** se comparan, **Then** se reconocen como el mismo producto por su color, su aire y su jerarquía.
6. **Given** el mismo presupuesto antes y después de la revisión, **When** se comparan los tamaños de los dos archivos en el explorador, **Then** el nuevo no pesa más de un 20 % por encima del anterior.
7. **Given** un freelancer con logo de colores fríos, **When** descarga su PDF, **Then** el logo y la banda de la cabecera se leen bien, separados por aire, sin que ninguno tiña al otro.

---

### User Story 4 - Ver de un vistazo en qué punto está cada presupuesto (Entregada en v1.1)

Como freelancer, quiero distinguir a simple vista en qué situación está cada presupuesto, para saber cuáles siguen vigentes y cuáles ya no.

**Estado**: entregada. La revisión **no cambia ninguna regla**: solo el tono de *Vigente*, que pasa del acento al oliva para que el acento no signifique dos cosas a la vez.

**Independent Test**: tener a la vez un presupuesto sin líneas, uno con fecha de validez pasada y uno normal, y comprobar que cada uno se presenta con su etiqueta, que ninguna ha habido que marcarla a mano, y que el recuento del inicio coincide con la lista.

**Acceptance Scenarios**:

1. **Given** varios presupuestos en distinta situación, **When** el freelancer mira la lista, **Then** cada uno muestra su situación —Borrador, Vigente o Caducado— con una etiqueta legible y distinguible del resto.
2. **Given** un presupuesto cuya fecha de validez ya ha pasado, **When** el freelancer lo mira, **Then** se presenta como **Caducado** sin que él haya tenido que marcarlo.
3. **Given** un presupuesto al que se le han borrado todas las líneas, o uno sin nombre de cliente, **When** el freelancer lo mira, **Then** se presenta como **Borrador**.
4. **Given** un presupuesto cuya fecha de validez es justo hoy, **When** el freelancer lo mira, **Then** se presenta como **Vigente**, no como caducado.
5. **Given** un presupuesto sin líneas y además con la validez pasada, **When** el freelancer lo mira, **Then** se presenta como **Borrador**, no como caducado.
6. **Given** las etiquetas de situación, **When** se miran en blanco y negro o con visión daltónica, **Then** siguen distinguiéndose, porque el color no es lo único que las diferencia.
7. **Given** el resumen del inicio, **When** se compara con la lista de presupuestos, **Then** los recuentos de cada situación coinciden exactamente.
8. **Given** cualquier presupuesto, **When** el freelancer lo abre, **Then** no encuentra ningún control para cambiar su situación a mano: la situación se deduce sola.
9. **Given** la etiqueta de situación, **When** el freelancer la mira, **Then** tiene aire por encima y por debajo de su texto, en lugar de parecer aplastada.

---

### User Story 5 - Que la aplicación acuse cada toque (Priority: P3)

Como freelancer, quiero que todo lo que puedo pulsar reaccione de forma visible —al pasar por encima, al pulsar, al recibir el foco del teclado y cuando está inactivo—, para saber en todo momento qué he tocado y qué puedo tocar.

**Why this priority**: es lo que separa una aplicación de una maqueta, y hoy prácticamente no existe. Va después del PDF porque no se ve en el documento que recibe el cliente, pero es lo que más nota el freelancer al trabajar.

**Independent Test**: recorrer una pantalla con formulario primero con el ratón, luego solo con el tabulador y luego con «reducir movimiento» activado, comprobando que cada estado se distingue sin compararlo con una captura anterior.

**Acceptance Scenarios**:

1. **Given** cualquier botón o acceso, **When** el freelancer pasa el ratón por encima, **Then** aprecia el cambio sin necesidad de compararlo con una captura previa.
2. **Given** cualquier botón, **When** el freelancer lo pulsa y mantiene, **Then** el botón acusa la pulsación.
3. **Given** un botón desactivado, **When** el freelancer lo mira, **Then** lo distingue de uno activo y su texto se sigue leyendo sin esfuerzo.
4. **Given** cualquier pantalla, **When** el freelancer la recorre solo con el tabulador, **Then** en todo momento ve dónde está el foco, y el indicador es el mismo en enlaces, botones y campos.
5. **Given** una acción que tarda, como exportar la copia en `.zip`, **When** está en marcha, **Then** la aplicación lo dice con el mismo tratamiento que cualquier otra espera del producto.
6. **Given** «reducir movimiento» activado en el sistema, **When** el freelancer usa la aplicación, **Then** nada se desplaza ni se atenúa progresivamente.

---

### User Story 6 - Que se vea bien del móvil al monitor grande (Priority: P4)

Como freelancer, quiero que la aplicación aproveche la pantalla que tengo delante —el móvil, el portátil o el monitor grande— sin quedarse en una columna estrecha ni dejar filas sueltas, para no sentir que uso una web antigua.

**Why this priority**: es el diagnóstico que menos afecta al trabajo diario en móvil, que es donde más se usa el producto, pero el que más delata la edad de la interfaz en escritorio. Va la última porque las otras cinco se entregan sin ella.

**Independent Test**: abrir la misma pantalla en un móvil, en un escritorio estrecho, en una tablet en horizontal y en un monitor de 1440 px o más, comprobando que en cada anchura el contenido está colocado a propósito.

**Acceptance Scenarios**:

1. **Given** un monitor de 1440 px o más, **When** el freelancer abre cualquier pantalla, **Then** la aplicación no aparece como una columna estrecha centrada entre dos franjas vacías más anchas que el propio contenido.
2. **Given** una tablet en horizontal (unos 1024 px), **When** el freelancer abre el inicio, **Then** las cinco cifras del resumen de actividad no dejan una fila huérfana con una sola cifra.
3. **Given** un móvil, **When** el freelancer edita las líneas de un presupuesto, **Then** la tabla sigue siendo tarjetas apiladas y el total sigue a la vista, como antes de la revisión.
4. **Given** un párrafo largo en escritorio ancho, **When** el freelancer lo lee, **Then** la línea no cruza la pantalla entera.
5. **Given** cualquier anchura entre el móvil y el monitor grande, **When** el freelancer cambia el tamaño de la ventana, **Then** el contenido se recoloca sin que ningún elemento se salga ni obligue a desplazarse en horizontal.

---

### Edge Cases

- **Aplicación recién estrenada, sin ningún dato**: el inicio muestra el resumen a cero y una indicación de por dónde empezar; ninguna pantalla aparece en blanco sin explicación.
- **Un presupuesto al que se le han borrado todas las líneas**: sigue apareciendo en la lista, se presenta como **Borrador** y cuenta como tal en el resumen del inicio.
- **Presupuesto en edición sin guardar todavía** (aún sin número, según FR-018 de la spec 001): no aparece en ningún recuento del inicio, porque todavía no existe.
- **Freelancer sin logo**: el PDF sigue generándose y la cabecera no deja un hueco desajustado.
- **Logo con colores que chocan con el acento del documento**: el PDF se genera igual y los dos se leen bien, separados por aire; el acento no se adapta al logo.
- **Las letras no llegan a cargarse**: la aplicación se ve con la tipografía del sistema y todo sigue legible, sin saltos de maquetación que oculten información.
- **Nombres de cliente o descripciones muy largos**: la maquetación no se descuadra ni en la pantalla estrecha de un móvil ni en el PDF, y un título largo con la familia de titulares no se sale ni se corta.
- **Muchos presupuestos acumulados**: el resumen del inicio sigue siendo legible sin desplazarse, la navegación sigue visible al bajar por la lista y nada obliga a esperar.
- **«Reducir movimiento» activado**: todos los cambios de estado siguen siendo perceptibles, solo que sin transición.
- **Impresión en blanco y negro**: las tres situaciones siguen distinguiéndose y el total sigue siendo el elemento mayor.
- **Avisos ya existentes** (navegador sin espacio, datos no legibles, logo de más de 1 MB): siguen apareciendo y siguen siendo legibles con la apariencia nueva.
- **Exportar la copia en `.zip` con muchos presupuestos**: sigue completándose y el peso total no se dispara por el cambio de imagen.

## Requirements *(mandatory)*

### Functional Requirements

#### Inicio y navegación (entregado en v1.1)

- **FR-001**: Al abrir la aplicación en su dirección web, la primera pantalla que MUST mostrarse es la de inicio.
- **FR-002**: La pantalla de inicio MUST ofrecer acceso directo y visible a las cuatro secciones existentes: Presupuestos, Clientes, Catálogo y Perfil.
- **FR-003**: La pantalla de inicio MUST mostrar un resumen de actividad con, al menos: cuántos presupuestos hay en cada una de las tres situaciones de FR-017 (Borrador, Vigente y Caducado), el número de clientes guardados y el número de servicios del catálogo.
- **FR-004**: La pantalla de inicio MUST permitir empezar un presupuesto nuevo sin pasar antes por la lista.
- **FR-005**: Todas las pantallas de la aplicación MUST mostrar una navegación común y visible que permita ir a cualquier sección en un solo toque, sin recurrir al botón "atrás" del dispositivo.
- **FR-006**: La navegación común MUST indicar en qué sección se encuentra el freelancer en cada momento.
- **FR-007**: La lista de presupuestos, que hasta la v1.1 era la pantalla de entrada, MUST seguir siendo accesible y conservar todo lo que ya hacía.

#### Imagen de la aplicación

- **FR-008**: Toda la aplicación MUST usar el mismo conjunto de familias tipográficas y la misma paleta corta de colores, **definidas en un único lugar del sistema**, de modo que un cambio en ese lugar se refleje en todas las pantallas y en el PDF.
- **FR-009**: El espaciado entre elementos MUST seguir una escala uniforme en todas las pantallas, en lugar de valores decididos pantalla a pantalla.
- **FR-010**: La aplicación MUST presentar esta jerarquía visual, de más a menos peso, en todas las pantallas: total a pagar, título de pantalla, títulos de bloque y cabeceras de tabla, datos y campos, etiquetas de campo, y textos de ayuda y datos secundarios.
- **FR-011**: El total a pagar de un presupuesto MUST ser el elemento tipográficamente mayor de su pantalla y MUST seguir visible mientras se editan las líneas, también en pantalla de móvil.
- **FR-012**: El rediseño MUST mantener el enfoque mobile-first ya existente: contenido legible sin zoom, formularios de una sola columna en móvil, zonas pulsables de al menos 44 px cómodas para el pulgar, teclado numérico en los campos de cantidad e importe y tabla de líneas como tarjetas apiladas en pantalla estrecha.
- **FR-013**: Todos los textos MUST seguir en español de España, incluidos los mensajes de error y los estados vacíos, y MUST seguir explicando qué hacer.
- **FR-014**: El rediseño MUST conservar todas las acciones hoy disponibles en cada pantalla: ninguna función existente puede desaparecer, quedar oculta ni requerir más pasos que antes.

#### Situación de los presupuestos (entregado en v1.1)

- **FR-015**: Cada presupuesto MUST mostrar su situación mediante una etiqueta legible, tanto en la lista como al abrirlo, con aire suficiente por encima y por debajo de su texto.
- **FR-016**: Las etiquetas de situación MUST distinguirse entre sí sin depender únicamente del color (texto y forma incluidos), para que sigan siendo legibles en blanco y negro o con visión daltónica.
- **FR-017**: El sistema MUST reconocer exactamente tres situaciones, todas **deducidas en el momento a partir de los datos que ya se guardan**, sin registrar ni pedir ningún dato nuevo:
  - **Borrador**: al presupuesto le falta algo para poder entregarse al cliente, es decir, no tiene ninguna línea o no tiene nombre de cliente (justo los casos en los que hoy no se puede generar su PDF).
  - **Caducado**: el presupuesto está completo y su fecha de validez ya ha pasado.
  - **Vigente**: el presupuesto está completo y su fecha de validez no ha pasado. El propio día de la validez cuenta como vigente.
- **FR-017a**: Cuando un presupuesto encaje a la vez en Borrador y en Caducado, MUST presentarse como **Borrador**, porque nunca llegó a estar en condiciones de entregarse.
- **FR-017b**: El sistema MUST NOT registrar si un presupuesto se ha enviado, aceptado o rechazado: esa información no se guarda hoy y queda fuera de alcance (ver Clarifications).
- **FR-018**: Los recuentos por situación del inicio MUST coincidir exactamente con lo que muestra la lista de presupuestos.

#### Imagen del PDF

- **FR-019**: El PDF MUST compartir con la aplicación la paleta, la escala de espaciado y la jerarquía visual, de modo que los dos se reconozcan como el mismo producto.
- **FR-020**: El PDF MUST conservar, sin cambios de contenido, todos los bloques obligatorios de la versión anterior: logo (si existe), datos del emisor, título, número, fecha de emisión y validez, datos del destinatario, tabla de líneas y desglose de base imponible, IVA, retención (cuando se aplique) y total a pagar.
- **FR-021**: Los importes del PDF MUST seguir siendo idénticos a los que muestra la pantalla, con el mismo formato español y el mismo redondeo que ya se aplica.
- **FR-022**: El PDF MUST seguir comportándose igual con presupuestos largos: la tabla continúa en la página siguiente repitiendo su cabecera y el bloque de totales no se parte entre páginas.
- **FR-023**: El PDF MUST seguir generándose cuando el freelancer no tiene logo, sin que la cabecera quede descuadrada.

#### Lo que no puede cambiar

- **FR-024**: El sistema MUST conservar sin ningún cambio las reglas de cálculo de base imponible, IVA, retención de IRPF, redondeo y total definidas en la spec 001.
- **FR-025**: El sistema MUST conservar sin ningún cambio la numeración de los presupuestos y las fechas de emisión y validez ya asignadas.
- **FR-026**: El sistema MUST seguir leyendo y escribiendo los datos ya guardados sin pedirle nada al freelancer: al actualizar la aplicación, sus presupuestos, clientes, catálogo y perfil MUST seguir estando ahí, intactos.
- **FR-027**: El sistema MUST conservar sin ningún cambio los nombres de los archivos que salen del producto —el PDF de un presupuesto y la copia en `.zip` con todo su contenido— y el formato de datos de esa copia.
- **FR-028**: El desglose del ejemplo de referencia de la spec 001 MUST seguir dando **2.120,00 €**, idéntico en pantalla y en PDF, antes y después de la revisión.
- **FR-029**: El PDF MUST NOT mostrar la situación del presupuesto (Borrador, Vigente o Caducado): es información para el freelancer, no para su cliente.
- **FR-030**: El producto MUST seguir funcionando sin servidor, sin cuentas y sin que ningún dato del freelancer salga de su navegador.

#### Tipografía

- **FR-031**: La aplicación MUST usar **dos familias tipográficas con un trabajo asignado**: una de titulares, reservada al título de pantalla y a la marca, y otra de lectura para todo lo demás, incluidos los importes.
- **FR-032**: Los tamaños de texto MUST formar una escala progresiva de cinco niveles. Entre el texto normal y **cada nivel por encima de él** —título de bloque, título de pantalla y total— MUST haber al menos 4 px de diferencia, para que ningún título quede a los 2 px que hoy lo separan del párrafo que le sigue. El nivel de apoyo, que va **por debajo** del texto normal, queda a 2 px de él a propósito y se distingue además por color y por su papel secundario. El texto normal y los campos MUST NOT bajar de 16 px reales.
- **FR-033**: El sistema MUST usar exactamente tres grosores de letra, cada uno con un trabajo asignado —texto corrido, rótulos y navegación, y títulos e importes—, en lugar de aplicar un mismo grosor a elementos de rango distinto.
- **FR-034**: Todos los importes, en pantalla y en el PDF, MUST usar cifras de ancho fijo y alinearse a la derecha, para que queden en columna.
- **FR-035**: Los archivos de tipografía MUST servirse desde la propia aplicación y MUST NOT solicitarse a ningún tercero, para que ninguna dirección del freelancer viaje fuera. Si no se pueden cargar, la aplicación MUST seguir legible con la tipografía del sistema.

#### Color

- **FR-036**: Cada color de la paleta MUST tener **un único significado**: el acento marca acción y marca; el oliva, lo vigente y las confirmaciones; el tono de atención, lo caducado y los avisos; el de error, lo que hay que corregir. Ningún color MUST usarse para dos significados distintos.
- **FR-037**: Todo texto normal MUST alcanzar un contraste mínimo de 4,5:1 contra su fondo, y los elementos de interfaz y los indicadores de estado un mínimo de 3:1.
- **FR-038**: Las superficies MUST distinguirse del fondo de la página sin depender únicamente de su borde.
- **FR-039**: Ningún color MUST ser el único portador de una información, ni en pantalla ni en el PDF: si algo se distingue por color, se distingue también por texto, forma o grosor.

#### Espaciado y forma

- **FR-040**: El espaciado MUST salir de una escala de siete peldaños de base 4 (4, 8, 12, 16, 24, 32 y 48 px), que incluye el peldaño intermedio de 8 px que hoy no existe.
- **FR-041**: El cambio de escala de espaciado MUST hacerse en dos pasos verificables por separado: primero renombrar los peldaños existentes sin alterar ningún valor visible, y solo después ajustar los valores. Ningún paso puede cambiar una separación sin que esté escrito que cambia.
- **FR-042**: El sistema MUST distinguir tres grados de esquina —campos y etiquetas, botones y tarjetas, y tarjeta destacada y bloque de totales— y tres niveles de elevación, en lugar de un único redondeo y una única sombra para todo.

#### Estados e interacción

- **FR-043**: Todo elemento pulsable MUST resolver seis estados distinguibles: reposo, ratón encima, pulsado, enfocado por teclado, inactivo y ocupado.
- **FR-044**: Lo inactivo MUST distinguirse por color propio y MUST NOT señalarse apagando el elemento con transparencia; el texto de un elemento inactivo MUST seguir leyéndose.
- **FR-045**: El indicador de foco de teclado MUST ser visible en todo momento y MUST ser el mismo en enlaces, botones y campos.
- **FR-046**: El movimiento MUST limitarse a dos duraciones —una corta para color y fondo, otra algo mayor para tamaño y posición— y MUST desaparecer por completo cuando el sistema del freelancer pide reducir el movimiento.

#### Densidad y adaptación

- **FR-047**: La aplicación MUST colocar su contenido a propósito en al menos tres anchuras: móvil, escritorio y escritorio ancho, con dos puntos de ruptura en lugar del único actual.
- **FR-048**: En escritorio ancho la aplicación MUST NOT quedar reducida a una columna centrada entre dos franjas vacías más anchas que el propio contenido, y los párrafos largos MUST NOT cruzar la pantalla entera.
- **FR-049**: El resumen de actividad MUST NOT dejar una fila huérfana con una sola cifra en ninguna anchura.
- **FR-050**: La navegación común MUST seguir visible mientras el freelancer se desplaza por una pantalla larga.

#### Disciplina del sistema visual

- **FR-051**: Ningún color, tamaño de letra, separación, esquina, sombra ni duración MUST escribirse a mano fuera del lugar único donde se definen, ni en la aplicación ni en el generador del PDF. Las excepciones que existen hoy MUST cerrarse como parte de esta revisión, no dejarse para después.
- **FR-052**: El PDF MUST NOT incrustar archivos de tipografía: el documento mantiene la familia de métricas del sistema que ya usa, y su parecido con la aplicación se consigue con color, aire y jerarquía (ver Clarifications, D1).
- **FR-053**: Un PDF generado después de la revisión MUST NOT pesar más de un 20 % por encima del mismo PDF generado antes, y la exportación de la copia en `.zip` MUST seguir completándose igual que hoy.

### Key Entities *(include if feature involves data)*

Esta funcionalidad **no crea entidades nuevas ni añade campos** a las existentes (Perfil, Cliente, Servicio, Presupuesto y Línea de Presupuesto, definidas en la spec 001). Solo cambia cómo se presentan.

- **Situación de un presupuesto**: etiqueta —Borrador, Vigente o Caducado— que se **deduce en el momento** de las líneas, del nombre del cliente y de la fecha de validez que el presupuesto ya tiene. No se guarda, no se elige y no añade ningún campo.
- **Resumen de actividad**: recuento que se calcula en el momento a partir de lo que ya hay guardado. No se almacena.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Todos se comprueban usando la aplicación y mirando el PDF, sin leer código ni ejecutar comandos (Principio IV de la constitución). Entre paréntesis, el criterio equivalente de la [pre-especificación](../propuestas/direccion-visual-mediterranea.md).

#### Orientación y uso (heredados de la v1.1)

- **SC-001**: Desde el 100 % de las pantallas, el freelancer llega a cualquiera de las cuatro secciones en un solo toque, sin usar el botón "atrás".
- **SC-002**: Al abrir la aplicación, el freelancer sabe cuántos presupuestos tiene en cada situación sin abrir ninguno y sin desplazarse por la pantalla.
- **SC-003**: Una persona que no conoce la aplicación localiza desde el inicio dónde se crea un presupuesto en menos de 10 segundos.
- **SC-009**: El tiempo de crear un presupuesto completo y descargar su PDF sigue por debajo de 5 minutos, es decir, la revisión no añade pasos.

#### Nada se ha roto

- **SC-004**: El 100 % de los presupuestos creados antes de la revisión muestran, después de ella, el mismo número, las mismas líneas y los mismos cuatro importes (CA-022).
- **SC-005**: El PDF de un presupuesto contiene, antes y después de la revisión, exactamente la misma información: mismo número, mismas fechas, mismas líneas y mismo desglose al céntimo; el desglose de referencia sigue dando 2.120,00 € (CA-021, CA-023).
- **SC-025**: En un presupuesto de más de una página, la tabla repite su cabecera y el bloque de totales no se parte, igual que antes (CA-023).
- **SC-026**: El `.zip` de 20 presupuestos se descarga completo, y un PDF no pesa más de un 20 % por encima de lo que pesaba antes de la revisión, comparado en el explorador de archivos (CA-025).

#### Identidad y jerarquía

- **SC-006**: Recorriendo las seis pantallas y el PDF, una persona cuenta **dos** familias tipográficas —una en los títulos de pantalla, otra en todo lo demás—, no encuentra ningún color fuera de la tabla de paleta y reconoce aplicación y documento como el mismo producto (CA-001, CA-002, CA-024).
- **SC-010**: En la pantalla de inicio se distingue a simple vista dónde acaba el fondo y dónde empieza cada tarjeta, sin acercar la vista (CA-003).
- **SC-011**: Se le pide a una persona que no conoce la aplicación que señale el dato más importante de un presupuesto abierto, y señala el **Total a pagar** (CA-004).
- **SC-012**: El título de la pantalla, los títulos de bloque y el texto normal se distinguen por tamaño sin leer lo que dicen, y ningún título de bloque tiene el mismo tamaño que el párrafo que lo sigue (CA-005, CA-006).
- **SC-013**: En una fila de la lista de presupuestos, el importe destaca sobre la etiqueta de situación que tiene al lado (CA-007).
- **SC-027**: Los importes de una lista o de una tabla quedan alineados en columna, sin que las cifras cambien de anchura entre filas.

#### Densidad y ritmo

- **SC-014**: Entre dos accesos de la navegación se ve un hueco: no se tocan (CA-008).
- **SC-015**: La etiqueta Borrador / Vigente / Caducado tiene aire por encima y por debajo de su texto y no parece aplastada (CA-009).
- **SC-016**: En un monitor de 1440 px o más, la aplicación no aparece como una columna estrecha centrada entre dos franjas vacías más anchas que el propio contenido (CA-010).
- **SC-017**: En una tablet en horizontal, las cinco cifras del resumen de actividad no dejan una fila huérfana con una sola cifra (CA-011).
- **SC-018**: Bajando por una lista larga de presupuestos, la navegación sigue visible arriba (CA-012).

#### Estados

- **SC-019**: Al pasar el ratón por un botón se aprecia el cambio sin compararlo con una captura anterior (CA-013).
- **SC-020**: Al pulsar y mantener un botón, el botón acusa la pulsación (CA-014).
- **SC-021**: Un botón desactivado se distingue de uno activo y su texto se sigue leyendo sin esfuerzo (CA-015).
- **SC-022**: Recorriendo una pantalla solo con el tabulador, en todo momento se ve dónde está el foco, y el indicador es el mismo en enlaces, botones y campos (CA-016).
- **SC-023**: Con «reducir movimiento» activado en el sistema, nada se desplaza ni se atenúa progresivamente, y todos los estados siguen siendo perceptibles (CA-017).

#### Accesibilidad

- **SC-007**: En un teléfono, el 100 % de los textos se leen sin hacer zoom y el 100 % de los botones y campos se aciertan con el pulgar a la primera (CA-019).
- **SC-008**: Las etiquetas de situación siguen distinguiéndose al imprimir la pantalla en blanco y negro (CA-018).
- **SC-024**: Ningún mensaje de error se distingue de un texto de ayuda solo por el color (CA-020).
- **SC-028**: Con la aplicación ya abierta una vez y el dispositivo sin conexión, al recargar la tipografía sigue siendo la misma: las letras no vienen de internet (CA-026).

## Assumptions

- **Esta revisión reescribe la 002, no crea una spec nueva.** El número, la rama y la carpeta se mantienen; lo entregado en la v1.1 sigue en pie y lo que cambia es la capa visual.
- **La numeración de requisitos no se reordena.** FR-001 … FR-026 conservan su significado porque el código ya los cita; lo nuevo entra a partir de FR-027. Renumerar dejaría comentarios apuntando a requisitos que ya no existen.
- **Los valores de color y los tamaños son decisión de producto**, no detalle de construcción: son lo que el cliente ve en el documento y lo que se compara a ojo durante la verificación. El nombre técnico de cada valor y las reglas de uso a nivel de hoja de estilos viven en [`contracts/sistema-visual.md`](./contracts/sistema-visual.md), que `/speckit-plan` debe enmendar.
- **«Con carácter propio» se interpreta** como: dos familias tipográficas con un trabajo claro, paleta corta de neutros cálidos con un significado por color, esquinas y elevaciones con jerarquía, y estados perceptibles. Sigue sin haber imágenes decorativas, degradados, iconografía ni animaciones de entrada.
- **La paleta no es configurable** por el freelancer: su marca entra en el PDF a través de su logo, como ya ocurre hoy.
- **El parecido entre aplicación y PDF se consigue con color, aire y jerarquía**, no con la forma exacta de la letra, porque el documento no incrusta fuentes (D1).
- **Los archivos de tipografía viajan dentro del producto.** Es la primera vez que se añade un recurso externo desde `fflate`, así que el plan debe justificarlo contra el Principio I igual que se hizo entonces, con un tope de cuatro archivos.
- **La revisión puede reorganizar la colocación** de los elementos de una pantalla (agrupar, tarjetas, orden visual, columnas en escritorio ancho) siempre que ninguna acción existente desaparezca, quede escondida o cueste más pasos que antes.
- **El PDF cambia de aspecto, no de contenido**: se mantienen los bloques y el orden que fija el contrato de la spec 001, y el documento sigue siendo texto real seleccionable, en A4 vertical.
- **No hay migración de datos**: lo guardado se sigue leyendo tal cual, porque el formato no cambia.
- **Se mantienen los avisos ya existentes** (datos solo en este navegador, fallo al guardar, logo demasiado pesado), solo que con la apariencia nueva.
- **La verificación es manual.** No se añaden pruebas automáticas de interfaz ni de PDF: cada criterio de éxito lo comprueba una persona con el guion del `quickstart.md`, que `/speckit-plan` debe actualizar.

## Out of Scope

- **Modo oscuro, temas alternativos o personalización de colores** por parte del freelancer.
- **Incrustar archivos de tipografía en el PDF.** Necesita su propia spec, con un presupuesto de peso medido (ver Clarifications, D1).
- **Iconografía, ilustraciones, imágenes decorativas, degradados y animaciones de entrada.**
- Cambiar cualquier cálculo, la numeración, las fechas o el formato de los importes.
- Añadir, quitar o renombrar campos de los datos guardados: ninguno.
- Cambiar los nombres de los archivos que salen del producto ni el formato de la copia en `.zip`.
- Cambiar lo que el PDF **dice**: bloques, rótulos, porcentajes, notas al pie o numeración de páginas.
- Registrar si un presupuesto se ha **enviado, aceptado o rechazado**. Exigiría guardar un dato nuevo y darle al freelancer una forma de marcarlo, con lo que dejaría de ser un cambio de presentación para ser funcionalidad de negocio. Si se quiere, debe proponerse en su propia spec (ver Clarifications).
- **Gráficas, tendencias o histogramas** en el resumen de actividad: los cinco recuentos siguen siendo cinco números.
- Funcionalidades nuevas de negocio: enviar el PDF por email, duplicar presupuestos, eliminarlos, buscar, filtrar u ordenar la lista, descuentos, multidivisa, facturación.
- **Restaurar una copia**, exportar a Excel o CSV, y cualquier otra salida de datos.
- **Framework de CSS, librería de componentes, librería de estado o librería de iconos.** La lista cerrada de dependencias sigue en pie.
- **Pruebas automáticas de interfaz o de PDF.**
- Copias de seguridad automáticas, sincronización entre dispositivos o cuentas de usuario.
- Traducir la aplicación a otros idiomas.
- Cambiar el comportamiento de la aplicación sin conexión o convertirla en instalable.
- **Pantallas nuevas.** Siguen siendo las mismas seis.

## Dependencias y documentos afectados

| Documento | Qué le pasa |
|---|---|
| [`contracts/sistema-visual.md`](./contracts/sistema-visual.md) | **Reescrito** por `/speckit-plan`: valores nuevos, apartados nuevos (estados, esquinas, elevaciones, movimiento, anchuras, los tres tonos de línea) y la regla «sin fuentes externas» pasa a «sin fuentes de terceros, servidas desde la propia aplicación» |
| [`contracts/pdf-presentacion.md`](./contracts/pdf-presentacion.md) | **Reescrito**: paleta, aire y jerarquía nuevos, el total como elemento mayor y la conversión declarada de la escala al documento. Se mantiene la prohibición de incrustar fuentes (D1) |
| [`contracts/navegacion.md`](./contracts/navegacion.md) | **Ampliado** con una sola regla: la navegación común sigue visible al desplazarse, y su restricción en móvil (FR-050) |
| [`research.md`](./research.md) | **Reescrito**: las once decisiones de esta revisión, más los hallazgos de contraste y de escala que corrigieron la paleta y FR-032 |
| [`data-model.md`](./data-model.md) | **Sin cambios de fondo**: aquí no se guarda nada nuevo. Solo se anota que *Vigente* cambia de tono y que el resumen se reparte en columnas declaradas |
| [`quickstart.md`](./quickstart.md) | **Reescrito**: añade el paso del renombrado que no se tiene que ver, escritorio ancho, tablet, recorrido con teclado, «reducir movimiento», sin conexión, y comparación de páginas y peso del PDF |
| [`plan.md`](./plan.md) | **Rehecho** por `/speckit-plan` para la v1.3, con el orden de ejecución obligado |
| `tasks.md` | **No existe ahora mismo**: el de la v1.1 se retiró y lo regenera `/speckit-tasks` a partir del plan nuevo |
| `checklists/ux.md` | **No existe ahora mismo**: la checklist de UX de la v1.1 quedó obsoleta con la dirección antigua y se retiró. Si se quiere una nueva, la genera `/speckit-checklist` |
| [`001/contracts/pdf-documento.md`](../001-presupuestos-freelancer/contracts/pdf-documento.md) | **Intacto.** El contenido del PDF no se toca |
| [`001/contracts/almacen-schema.md`](../001-presupuestos-freelancer/contracts/almacen-schema.md) | **Intacto** |
| [`003/contracts/`](../003-exportar-copia-zip/) | **Intactos.** La copia, su estructura y sus nombres de archivo no cambian |
| `CLAUDE.md` | Se actualiza al implementar: familias tipográficas, dónde viven los archivos de fuente y la escala de espaciado nueva |
| [`specs/README.md`](../README.md) | Se actualiza la fila 002 al terminar el `implement`, no antes |

## Riesgos

| # | Riesgo | Cómo se controla |
|---|---|---|
| R1 | La escala de espaciado nueva reutiliza nombres que hoy valen otra cosa y descuadra las seis pantallas en silencio | FR-041: renombrar primero, en un paso verificable, y solo después cambiar valores |
| R2 | El producto engorda con los archivos de tipografía | Tope de cuatro archivos con el juego latino (D3); SC-026 vigila el peso del PDF y del `.zip` |
| R3 | El acento del documento choca con el logo del freelancer | D5: acento fijo, se resuelve con aire; historia 3, escenario 7 |
| R4 | Un acento bonito que no llega al contraste mínimo | Ya resuelto en la paleta: `#B34A25` en lugar de `#C4562F`; FR-037 lo exige para todo |
| R5 | La familia de titulares resulta ruidosa en móvil | D2: limitada al título de pantalla y a la marca; se cae a una sola familia sin rehacer nada más |
| R6 | Las excepciones que hoy escriben valores a mano se multiplican con el rediseño | FR-051 las cierra como parte del trabajo |
| R7 | La revisión toca de refilón un importe o un rótulo del PDF | FR-028 y SC-004, SC-005 y SC-025 lo detectan; el desglose de 2.120,00 € es el atajo de siempre |
| R8 | El código implementado de la v1.1 se da por bueno sin comprobar que sigue cumpliendo lo que dice esta spec reescrita | La replanificación parte del estado real del código, no de `tasks.md`, que queda obsoleto |
