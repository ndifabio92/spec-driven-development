# Feature Specification: Pantalla de inicio e imagen profesional (PresupuestosPro v1.1)

**Feature Branch**: `002-inicio-y-rediseno`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Mejorar la presentación de PresupuestosPro (aplicación ya implementada en la spec 001) con dos cambios, sin alterar ninguna funcionalidad ni dato existente. Primero: añadir una página de inicio (index) que sea el punto de entrada de la aplicación al acceder a la raíz del servidor, con navegación clara hacia las cuatro secciones existentes (Presupuestos, Clientes, Catálogo y Perfil) y un pequeño resumen de actividad (por ejemplo, número de presupuestos por estado). Además, todas las páginas deben compartir una navegación común visible para moverse entre secciones sin usar el botón atrás. Segundo: rediseñar la apariencia visual de toda la aplicación para que resulte profesional y sobria: tipografía consistente, paleta de colores limitada definida en un único lugar, espaciado uniforme, jerarquía visual clara entre títulos, tablas, formularios y totales, y estados visuales distinguibles para los presupuestos (Borrador, Enviado, Aceptado, Rechazado, Caducado). El rediseño debe aplicarse también a la plantilla del PDF para que el documento que recibe el cliente transmita la misma imagen profesional. Debe mantenerse el enfoque mobile-first ya existente y todos los textos en español de España. La lógica de negocio, los cálculos, la API y el esquema de datos no deben cambiar en absoluto."

## Clarifications

### Session 2026-09-19

- Q: El encargo pide cinco situaciones para los presupuestos (Borrador, Enviado, Aceptado, Rechazado, Caducado) y a la vez que el esquema de datos no cambie. Con los datos de la spec 001 solo son deducibles dos de ellas. ¿Qué prevalece? → A: Prevalece no tocar los datos. Se reconocen únicamente las situaciones que pueden deducirse de lo ya guardado — **Borrador**, **Vigente** y **Caducado** — y esta funcionalidad sigue siendo un cambio de presentación puro. Registrar si un presupuesto se ha enviado, aceptado o rechazado queda fuera de alcance y, si algún día se quiere, deberá pasar por su propia spec.

## Contexto

PresupuestosPro ya funciona: calcula impuestos, numera presupuestos y genera el PDF que recibe el cliente ([spec 001](../001-presupuestos-freelancer/spec.md)). Esta versión **no añade capacidades nuevas al producto**: cambia cómo se ve y cómo se recorre. Todo lo que hoy se puede hacer se seguirá pudiendo hacer, con los mismos importes, el mismo número y el mismo contenido en el PDF.

La regla que manda sobre todo lo que sigue: **si un cambio altera un cálculo, un dato guardado o lo que dice el PDF, no pertenece a esta spec**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar y saber dónde estoy (Priority: P1)

Como freelancer, quiero que al abrir la aplicación me reciba una pantalla de inicio con accesos claros a Presupuestos, Clientes, Catálogo y Perfil, y un resumen de cómo va mi actividad, para orientarme de un vistazo en vez de aterrizar directamente en una lista.

**Why this priority**: es el cambio que más se nota y el único que aporta algo que hoy no existe (la visión de conjunto). Además, la navegación común visible es lo que evita depender del botón "atrás" del móvil.

**Independent Test**: abrir la aplicación en su dirección web y comprobar que la primera pantalla es el inicio, que desde ella se llega a las cuatro secciones, y que desde cualquier sección se vuelve a cualquier otra sin usar el botón "atrás".

**Acceptance Scenarios**:

1. **Given** un freelancer que abre la dirección web de la aplicación, **When** termina de cargar, **Then** la primera pantalla que ve es la de inicio, con acceso visible a Presupuestos, Clientes, Catálogo y Perfil.
2. **Given** la pantalla de inicio, **When** el freelancer la mira sin pulsar nada, **Then** ve cuántos presupuestos tiene en cada estado y cuántos clientes y servicios tiene guardados.
3. **Given** cualquier pantalla de la aplicación (incluida la de edición de un presupuesto), **When** el freelancer quiere cambiar de sección, **Then** encuentra la navegación común visible y llega a su destino en un solo toque, sin usar el botón "atrás".
4. **Given** un freelancer que acaba de instalar la aplicación y no tiene nada guardado, **When** abre el inicio, **Then** el resumen aparece a cero y se le indica por dónde empezar, en vez de mostrar una pantalla vacía sin explicación.
5. **Given** la pantalla de inicio, **When** el freelancer quiere crear un presupuesto, **Then** puede hacerlo desde ahí directamente, sin pasar antes por la lista.

---

### User Story 2 - Que la herramienta se vea seria (Priority: P2)

Como freelancer, quiero que toda la aplicación tenga una apariencia sobria y coherente —una sola tipografía, pocos colores, espaciado uniforme y una jerarquía clara entre títulos, formularios, tablas y totales—, para trabajar con una herramienta que no parezca un borrador.

**Why this priority**: afecta a las seis pantallas y es la mitad del encargo, pero el producto ya funciona sin ello; por eso va después de la orientación.

**Independent Test**: recorrer las seis pantallas en móvil y en escritorio y comprobar a simple vista que comparten tipografía, colores, espaciado y jerarquía, y que todo lo que se podía hacer antes se sigue pudiendo hacer.

**Acceptance Scenarios**:

1. **Given** las seis pantallas de la aplicación, **When** se recorren una tras otra, **Then** todas usan la misma familia tipográfica, la misma paleta reducida de colores y el mismo ritmo de espaciado.
2. **Given** cualquier pantalla con formulario, **When** el freelancer la mira, **Then** distingue sin esfuerzo el título de la pantalla, las etiquetas de los campos, los textos de ayuda y los mensajes de error.
3. **Given** un presupuesto abierto, **When** el freelancer edita sus líneas, **Then** el total a pagar destaca claramente sobre el resto de importes y sigue visible mientras edita, también en móvil.
4. **Given** un teléfono, **When** el freelancer usa cualquier pantalla, **Then** todo se lee sin hacer zoom y las zonas pulsables se aciertan con el pulgar.
5. **Given** un presupuesto creado antes del rediseño, **When** se abre después del rediseño, **Then** muestra exactamente el mismo número, las mismas líneas y los mismos importes que antes.

---

### User Story 3 - Que el PDF transmita lo mismo (Priority: P3)

Como freelancer, quiero que el PDF que recibe mi cliente tenga la misma imagen cuidada que la aplicación, para que el documento hable bien de mí.

**Why this priority**: el PDF es lo único que ve el cliente final, pero ya cumple su función; esto mejora la impresión que causa, no lo que dice.

**Independent Test**: descargar el PDF de un presupuesto ya existente y comprobar que contiene exactamente la misma información que antes, presentada con la tipografía, los colores y la jerarquía de la aplicación rediseñada.

**Acceptance Scenarios**:

1. **Given** un presupuesto con líneas, **When** se descarga su PDF, **Then** el documento conserva todos los bloques obligatorios de la versión anterior (logo, emisor, identificación, destinatario, tabla de líneas y desglose) y ninguno cambia de contenido.
2. **Given** el presupuesto del ejemplo de referencia, **When** se compara el PDF nuevo con el anterior, **Then** los cuatro importes del desglose y el número del presupuesto son idénticos.
3. **Given** un presupuesto de muchas líneas, **When** se descarga su PDF, **Then** la tabla sigue repitiendo su cabecera al cambiar de página y el bloque de totales sigue sin partirse.
4. **Given** el PDF rediseñado, **When** se abre junto a la aplicación, **Then** se reconocen como el mismo producto: misma familia tipográfica y mismos colores.

---

### User Story 4 - Ver de un vistazo en qué punto está cada presupuesto (Priority: P4)

Como freelancer, quiero distinguir a simple vista en qué situación está cada presupuesto, para saber cuáles siguen vigentes y cuáles ya no.

**Why this priority**: es lo que da sentido al resumen del inicio, pero ninguna de las otras tres historias depende de ella. Va la última para poder entregarlas aunque esta se recorte.

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

---

### Edge Cases

- **Aplicación recién estrenada, sin ningún dato**: el inicio muestra el resumen a cero y una indicación de por dónde empezar; ninguna pantalla aparece en blanco sin explicación.
- **Un presupuesto al que se le han borrado todas las líneas**: sigue apareciendo en la lista, se presenta como **Borrador** y cuenta como tal en el resumen del inicio.
- **Presupuesto en edición sin guardar todavía** (aún sin número, según FR-018 de la spec 001): no aparece en ningún recuento del inicio, porque todavía no existe.
- **Freelancer sin logo**: el PDF rediseñado sigue generándose y la cabecera no deja un hueco desajustado.
- **Nombres de cliente o descripciones muy largos**: la maquetación no se descuadra ni en la pantalla estrecha de un móvil ni en el PDF.
- **Muchos presupuestos acumulados**: el resumen del inicio sigue siendo legible sin desplazarse y no obliga a esperar.
- **Avisos ya existentes** (navegador sin espacio, datos no legibles, logo de más de 1 MB): siguen apareciendo y siguen siendo legibles con la apariencia nueva.

## Requirements *(mandatory)*

### Functional Requirements

#### Inicio y navegación

- **FR-001**: Al abrir la aplicación en su dirección web, la primera pantalla que MUST mostrarse es la de inicio.
- **FR-002**: La pantalla de inicio MUST ofrecer acceso directo y visible a las cuatro secciones existentes: Presupuestos, Clientes, Catálogo y Perfil.
- **FR-003**: La pantalla de inicio MUST mostrar un resumen de actividad con, al menos: cuántos presupuestos hay en cada una de las tres situaciones de FR-017 (Borrador, Vigente y Caducado), el número de clientes guardados y el número de servicios del catálogo.
- **FR-004**: La pantalla de inicio MUST permitir empezar un presupuesto nuevo sin pasar antes por la lista.
- **FR-005**: Todas las pantallas de la aplicación MUST mostrar una navegación común y visible que permita ir a cualquier sección en un solo toque, sin recurrir al botón "atrás" del dispositivo.
- **FR-006**: La navegación común MUST indicar en qué sección se encuentra el freelancer en cada momento.
- **FR-007**: La lista de presupuestos, que hasta ahora era la pantalla de entrada, MUST seguir siendo accesible y conservar todo lo que ya hacía.

#### Imagen de la aplicación

- **FR-008**: Toda la aplicación MUST usar una única familia tipográfica y una paleta de colores limitada, ambas definidas en un único lugar del sistema, de modo que un cambio en ese lugar se refleje en todas las pantallas.
- **FR-009**: El espaciado entre elementos MUST seguir una escala uniforme en todas las pantallas, en lugar de valores decididos pantalla a pantalla.
- **FR-010**: La aplicación MUST presentar una jerarquía visual clara y coherente entre títulos de pantalla, secciones, etiquetas de formulario, textos de ayuda, tablas de datos y bloques de importes.
- **FR-011**: El total a pagar de un presupuesto MUST destacar visualmente sobre el resto de importes y MUST seguir visible mientras se editan las líneas, también en pantalla de móvil.
- **FR-012**: El rediseño MUST mantener el enfoque mobile-first ya existente: contenido legible sin zoom, formularios de una sola columna en móvil, zonas pulsables cómodas para el pulgar y teclado numérico en los campos de cantidad e importe.
- **FR-013**: Todos los textos MUST seguir en español de España, incluidos los mensajes de error y los estados vacíos, y MUST seguir explicando qué hacer.
- **FR-014**: El rediseño MUST conservar todas las acciones hoy disponibles en cada pantalla: ninguna función existente puede desaparecer, quedar oculta ni requerir más pasos que antes.

#### Situación de los presupuestos

- **FR-015**: Cada presupuesto MUST mostrar su situación mediante una etiqueta legible, tanto en la lista como al abrirlo.
- **FR-016**: Las etiquetas de situación MUST distinguirse entre sí sin depender únicamente del color (texto y forma incluidos), para que sigan siendo legibles en blanco y negro o con visión daltónica.
- **FR-017**: El sistema MUST reconocer exactamente tres situaciones, todas **deducidas en el momento a partir de los datos que ya se guardan**, sin registrar ni pedir ningún dato nuevo:
  - **Borrador**: al presupuesto le falta algo para poder entregarse al cliente, es decir, no tiene ninguna línea o no tiene nombre de cliente (justo los casos en los que hoy no se puede generar su PDF).
  - **Caducado**: el presupuesto está completo y su fecha de validez ya ha pasado.
  - **Vigente**: el presupuesto está completo y su fecha de validez no ha pasado. El propio día de la validez cuenta como vigente.
- **FR-017a**: Cuando un presupuesto encaje a la vez en Borrador y en Caducado, MUST presentarse como **Borrador**, porque nunca llegó a estar en condiciones de entregarse.
- **FR-017b**: El sistema MUST NOT registrar si un presupuesto se ha enviado, aceptado o rechazado: esa información no se guarda hoy y queda fuera de alcance (ver Clarifications).
- **FR-018**: Los recuentos por situación del inicio MUST coincidir exactamente con lo que muestra la lista de presupuestos.

#### Imagen del PDF

- **FR-019**: El PDF MUST rediseñarse para compartir tipografía, colores y jerarquía visual con la aplicación.
- **FR-020**: El PDF MUST conservar, sin cambios de contenido, todos los bloques obligatorios de la versión anterior: logo (si existe), datos del emisor, título, número, fecha de emisión y validez, datos del destinatario, tabla de líneas y desglose de base imponible, IVA, retención (cuando se aplique) y total a pagar.
- **FR-021**: Los importes del PDF MUST seguir siendo idénticos a los que muestra la pantalla, con el mismo formato español y el mismo redondeo que ya se aplica.
- **FR-022**: El PDF MUST seguir comportándose igual con presupuestos largos: la tabla continúa en la página siguiente repitiendo su cabecera y el bloque de totales no se parte entre páginas.
- **FR-023**: El PDF MUST seguir generándose cuando el freelancer no tiene logo, sin que la cabecera quede descuadrada.

#### Lo que no puede cambiar

- **FR-024**: El sistema MUST conservar sin ningún cambio las reglas de cálculo de base imponible, IVA, retención de IRPF, redondeo y total definidas en la spec 001.
- **FR-025**: El sistema MUST conservar sin ningún cambio la numeración de los presupuestos y las fechas de emisión y validez ya asignadas.
- **FR-026**: El sistema MUST seguir leyendo y escribiendo los datos ya guardados sin pedirle nada al freelancer: al actualizar la aplicación, sus presupuestos, clientes, catálogo y perfil MUST seguir estando ahí, intactos.

### Key Entities *(include if feature involves data)*

Esta funcionalidad **no crea entidades nuevas ni añade campos** a las existentes (Perfil, Cliente, Servicio, Presupuesto y Línea de Presupuesto, definidas en la spec 001). Solo cambia cómo se presentan.

- **Situación de un presupuesto**: etiqueta —Borrador, Vigente o Caducado— que se **deduce en el momento** de las líneas, del nombre del cliente y de la fecha de validez que el presupuesto ya tiene. No se guarda, no se elige y no añade ningún campo.
- **Resumen de actividad**: recuento que se calcula en el momento a partir de lo que ya hay guardado. No se almacena.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Desde el 100 % de las pantallas, el freelancer llega a cualquiera de las cuatro secciones en un solo toque, sin usar el botón "atrás".
- **SC-002**: Al abrir la aplicación, el freelancer sabe cuántos presupuestos tiene en cada situación sin abrir ninguno y sin desplazarse por la pantalla.
- **SC-003**: Una persona que no conoce la aplicación localiza desde el inicio dónde se crea un presupuesto en menos de 10 segundos.
- **SC-004**: El 100 % de los presupuestos creados antes del rediseño muestran, después de él, el mismo número, las mismas líneas y los mismos cuatro importes.
- **SC-005**: El PDF de un presupuesto contiene, antes y después del rediseño, exactamente la misma información: mismo número, mismas fechas, mismas líneas y mismo desglose al céntimo.
- **SC-006**: Recorriendo las seis pantallas y el PDF, una persona cuenta una sola familia tipográfica y como mucho cinco colores distintos, y reconoce aplicación y documento como el mismo producto.
- **SC-007**: En un teléfono, el 100 % de los textos se leen sin hacer zoom y el 100 % de los botones y campos se aciertan con el pulgar a la primera.
- **SC-008**: Las etiquetas de situación siguen distinguiéndose al imprimir la pantalla en blanco y negro.
- **SC-009**: El tiempo de crear un presupuesto completo y descargar su PDF sigue por debajo de 5 minutos, es decir, el rediseño no añade pasos.

## Assumptions

- **La pantalla de entrada cambia, la lista no desaparece**: hasta ahora la aplicación abría directamente en la lista de presupuestos; a partir de esta versión abre en el inicio, y la lista pasa a ser una sección más, con todo lo que ya tenía.
- **El inicio vive dentro de la propia aplicación**, no es una página aparte: necesita leer los datos del freelancer para poder mostrar el resumen.
- **La navegación común ya existe parcialmente** (la cabecera con las secciones que introdujo la spec 001); esta funcionalidad la completa —añadiendo el inicio y la indicación de sección actual— en lugar de inventar una nueva.
- **"Profesional y sobria" se interpreta** como: una sola familia tipográfica, una paleta corta de colores neutros con un único color de acento, espaciado regular y ausencia de adornos; nada de imágenes decorativas, degradados ni animaciones.
- **La paleta no es configurable** por el freelancer: su marca entra en el PDF a través de su logo, como ya ocurre hoy.
- **El rediseño puede reorganizar la colocación** de los elementos de una pantalla (agrupar, tarjetas, orden visual) siempre que ninguna acción existente desaparezca, quede escondida o cueste más pasos que antes.
- **El PDF cambia de aspecto, no de contenido**: se mantienen los bloques y el orden que fija el contrato de la spec 001, y el documento sigue siendo texto real seleccionable, en A4 vertical.
- **No hay migración de datos**: lo guardado se sigue leyendo tal cual, porque el formato no cambia.
- **Se mantienen los avisos ya existentes** (datos solo en este navegador, fallo al guardar, logo demasiado pesado), solo que con la apariencia nueva.

## Out of Scope

- Cambiar cualquier cálculo, la numeración, las fechas o el formato de los importes.
- Añadir, quitar o renombrar campos de los datos guardados: ninguno.
- Registrar si un presupuesto se ha **enviado, aceptado o rechazado**. Exigiría guardar un dato nuevo y darle al freelancer una forma de marcarlo, con lo que dejaría de ser un cambio de presentación para ser funcionalidad de negocio. Si se quiere, debe proponerse en su propia spec (ver Clarifications).
- Funcionalidades nuevas de negocio: enviar el PDF por email, duplicar presupuestos, eliminarlos, buscar, filtrar u ordenar la lista, descuentos, multidivisa, facturación.
- Modo oscuro, temas alternativos o personalización de colores por parte del freelancer.
- Copias de seguridad, sincronización entre dispositivos o cuentas de usuario.
- Traducir la aplicación a otros idiomas.
- Cambiar el comportamiento de la aplicación sin conexión o convertirla en instalable.
