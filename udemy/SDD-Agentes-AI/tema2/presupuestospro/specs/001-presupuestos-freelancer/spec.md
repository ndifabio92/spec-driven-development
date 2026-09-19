# Feature Specification: Presupuestos para Freelancers (PresupuestosPro v0)

**Feature Branch**: `001-presupuestos-freelancer`

**Created**: 2026-09-18

**Status**: Draft

**Input**: User description: "PresupuestosPro v0 — herramienta para que un freelancer español cree presupuestos profesionales con su marca y los descargue en PDF, calculando IVA y retención de IRPF automáticamente, sin usar Excel ni plantillas manuales." (ver `prompt_spec_servilleta.md`)

## Clarifications

### Session 2026-09-18

- Q: Cuando un cálculo como el 21 % de IVA da un resultado con más de dos decimales, ¿en qué momento debe redondearse a céntimos? → A: Redondear solo los totales finales mostrados (base, IVA, retención, total) a 2 decimales; los cálculos intermedios mantienen precisión completa.
- Q: ¿Qué debe pasar si en un mismo año un freelancer llega a crear más de 999 presupuestos (por ejemplo, el número 1000)? → A: El número crece sin límite de dígitos cuando se supera 999 (2026-1000, 2026-1001...).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Crear un presupuesto con cálculo automático de impuestos (Priority: P1)

Como freelancer, quiero crear un presupuesto eligiendo o dando de alta un cliente y añadiendo líneas (del catálogo o escritas a mano), para que la base imponible, el IVA, la retención de IRPF (cuando corresponda) y el total se calculen solos, sin arriesgarme a equivocarme con los impuestos.

**Why this priority**: Es el corazón del negocio: pasar de "calculadora del móvil a las once de la noche" a un cálculo fiable en minutos. Sin esto no hay producto.

**Independent Test**: Puede probarse creando un presupuesto nuevo, indicando un cliente (particular o empresa/autónomo), añadiendo dos líneas manuales con cantidad y precio, y comprobando que la base, el IVA, la retención (si aplica) y el total se calculan y se recalculan solos al cambiar cualquier dato.

**Acceptance Scenarios**:

1. **Given** un presupuesto con dos líneas (1.500,00 € y 500,00 €) para un cliente empresa/autónomo con retención del 15 % activada, **When** se revisa el desglose, **Then** la base imponible es 2.000,00 €, el IVA es 420,00 €, la retención es −300,00 € y el total es 2.120,00 €.
2. **Given** el mismo presupuesto, **When** se cambia la retención al 7 %, **Then** el total se recalcula solo a 2.280,00 €.
3. **Given** el mismo presupuesto, **When** se cambia el tipo de cliente a "particular", **Then** la retención de IRPF deja de aplicarse (aunque estuviera activada) y el total sube a 2.420,00 €.
4. **Given** un presupuesto con al menos una línea, **When** se edita o borra cualquier línea, **Then** el desglose y el total se actualizan automáticamente.
5. **Given** un presupuesto sin ninguna línea, **When** el freelancer intenta finalizarlo, **Then** el sistema avisa de que no se puede continuar sin líneas.

---

### User Story 2 - Descargar el presupuesto como PDF con marca (Priority: P2)

Como freelancer, quiero descargar el presupuesto como PDF con mi logo, número, fechas y el desglose completo, para enviárselo al cliente con buena imagen.

**Why this priority**: El PDF es el entregable final: sin él, el cálculo hecho en la Historia 1 no llega nunca al cliente. Depende de tener ya un presupuesto calculado.

**Independent Test**: Puede probarse generando el PDF de un presupuesto ya creado y comprobando visualmente que incluye logo, datos del freelancer y del cliente, número, fecha de emisión, validez de 30 días y el desglose de base/IVA/retención/total.

**Acceptance Scenarios**:

1. **Given** un presupuesto con al menos una línea, **When** el freelancer genera el PDF, **Then** el documento muestra el logo (si está configurado), los datos del freelancer y del cliente, el número AAAA-NNN, la fecha de emisión, la validez de 30 días y el desglose completo.
2. **Given** un presupuesto ya descargado como PDF, **When** el freelancer edita una línea o un importe, **Then** puede volver a descargar un PDF actualizado conservando el mismo número de presupuesto.
3. **Given** el segundo presupuesto creado en el año, **When** se genera su PDF, **Then** el número mostrado es el siguiente al del primero (por ejemplo, 2026-002).

---

### User Story 3 - Configurar mi perfil de freelancer (Priority: P3)

Como freelancer, quiero configurar mi nombre, NIF, datos de contacto y logo una sola vez, para que todos mis presupuestos salgan con mi marca sin repetirla cada vez.

**Why this priority**: Mejora la imagen profesional del PDF, pero la aplicación puede funcionar (Historias 1 y 2) con un perfil vacío o incompleto mientras se configura.

**Independent Test**: Puede probarse rellenando el perfil una vez, creando después un presupuesto nuevo, y comprobando que sus datos aparecen automáticamente en el PDF sin volver a introducirlos.

**Acceptance Scenarios**:

1. **Given** que el freelancer guarda su nombre, NIF, contacto y logo, **When** crea un presupuesto nuevo, **Then** esos datos aparecen automáticamente en el PDF generado.
2. **Given** un perfil ya guardado, **When** el freelancer lo edita, **Then** los presupuestos que se generen a partir de ese momento reflejan los datos actualizados.
3. **Given** que el freelancer cierra y vuelve a abrir la aplicación, **When** consulta su perfil, **Then** los datos siguen guardados tal y como los dejó.

---

### User Story 4 - Mantener un catálogo de servicios reutilizables (Priority: P4)

Como freelancer, quiero mantener un catálogo de mis servicios con un precio por defecto cada uno, para no reescribir lo mismo en cada presupuesto.

**Why this priority**: Ahorra tiempo en encargos repetitivos, pero no es imprescindible: la Historia 1 ya permite escribir líneas a mano.

**Independent Test**: Puede probarse creando un servicio en el catálogo con nombre y precio, usándolo después como línea en un presupuesto nuevo, y comprobando que el precio se rellena solo (y puede ajustarse para ese presupuesto concreto).

**Acceptance Scenarios**:

1. **Given** un servicio guardado en el catálogo con un precio por defecto, **When** se añade como línea a un presupuesto, **Then** su descripción y precio se rellenan automáticamente, pudiendo ajustarse solo para ese presupuesto.
2. **Given** un servicio del catálogo usado ya en presupuestos anteriores, **When** el freelancer cambia su precio por defecto, **Then** los presupuestos ya creados conservan el precio que tenían y solo los presupuestos nuevos usan el precio actualizado.
3. **Given** un servicio del catálogo, **When** el freelancer lo edita o lo elimina, **Then** el catálogo refleja el cambio sin afectar a presupuestos ya existentes.

---

### User Story 5 - Mantener una ficha de clientes reutilizable (Priority: P5)

Como freelancer, quiero guardar los datos de cada cliente (nombre, NIF, contacto y tipo) para elegirlo de una lista al crear un presupuesto, en vez de escribir sus datos cada vez.

**Why this priority**: Ahorra tiempo y evita errores al repetir clientes habituales, pero no es imprescindible: la Historia 1 permite dar de alta un cliente nuevo al vuelo mientras se crea el presupuesto.

**Independent Test**: Puede probarse dando de alta un cliente de forma independiente, seleccionándolo después al crear un presupuesto nuevo, y comprobando que sus datos y tipo (empresa/autónomo o particular) se aplican correctamente al cálculo de la retención.

**Acceptance Scenarios**:

1. **Given** un cliente guardado con tipo "empresa/autónomo", **When** se selecciona en un presupuesto nuevo, **Then** la retención de IRPF está disponible para activarse en ese presupuesto.
2. **Given** un cliente guardado con tipo "particular", **When** se selecciona en un presupuesto nuevo, **Then** la retención de IRPF no puede aplicarse.
3. **Given** un cliente ya usado en presupuestos anteriores, **When** el freelancer edita o elimina esa ficha, **Then** los presupuestos ya creados conservan los datos del cliente tal y como estaban en el momento de crearse.

---

### Edge Cases

- Presupuesto sin ninguna línea: no se genera el PDF; se avisa al freelancer.
- Presupuesto nuevo que se abandona sin añadir ninguna línea: no se guarda, no consume número y no aparece en la lista.
- Línea escrita a mano, fuera del catálogo: permitida (no todo encargo está catalogado).
- Cliente particular con la retención de IRPF activada por error: la retención no se aplica; manda el tipo de cliente, nunca la casilla marcada.
- Freelancer que no ha configurado un logo: el PDF se genera igualmente, simplemente sin imagen de logo.
- Logo de más de 1 MB: no se acepta y se explica al freelancer que use una imagen más ligera, porque el espacio de almacenamiento del navegador es limitado.
- Cliente eliminado de la ficha de clientes después de haberse usado en un presupuesto: el presupuesto ya creado conserva los datos del cliente que tenía en el momento de crearse.
- Presupuesto creado a final de un año y editado ya entrado el año siguiente: conserva el número (AAAA-NNN) que se le asignó en el momento de su creación; no se renumera.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST permitir guardar y editar el perfil del freelancer: nombre, NIF, datos de contacto y logo.
- **FR-002**: El sistema MUST permitir crear, editar y eliminar servicios del catálogo, cada uno con nombre y precio por defecto.
- **FR-003**: El sistema MUST permitir crear, editar y eliminar clientes de forma independiente, cada uno con nombre, NIF, datos de contacto y tipo (empresa/autónomo o particular), para poder elegirlos al crear un presupuesto.
- **FR-004**: El sistema MUST permitir crear un presupuesto eligiendo un cliente ya guardado o dando de alta uno nuevo en el momento, indicando siempre su tipo (empresa/autónomo o particular).
- **FR-005**: Cada línea de un presupuesto MUST poder venir del catálogo de servicios o escribirse a mano, con descripción, cantidad y precio unitario editables.
- **FR-006**: El sistema MUST calcular automáticamente, en cada presupuesto: base imponible = suma de (cantidad × precio unitario) de todas las líneas; IVA = base imponible × 21 % (tipo por defecto); total = base imponible + IVA − retención de IRPF. Los cálculos intermedios MUST mantener precisión completa (sin redondear); el redondeo a 2 decimales (céntimos) MUST aplicarse únicamente a los importes finales que se muestran (base imponible, IVA, retención y total).
- **FR-007**: El sistema MUST permitir activar o desactivar la retención de IRPF de forma independiente en cada presupuesto (no como ajuste global del perfil), y elegir entre 15 % o 7 % cuando esté activada.
- **FR-008**: Cuando el cliente de un presupuesto sea "particular", el sistema MUST impedir que se aplique la retención de IRPF, aunque esté marcada como activada.
- **FR-009**: El sistema MUST numerar los presupuestos automáticamente con el formato AAAA-NNN (por ejemplo, 2026-001), reiniciando el contador cada año, y ese número MUST permanecer fijo aunque el presupuesto se edite después. Si en un mismo año se superan los 999 presupuestos, el contador MUST seguir creciendo sin límite de dígitos (por ejemplo, 2026-1000) en lugar de bloquear la creación de nuevos presupuestos.
- **FR-010**: El sistema MUST mostrar en cada presupuesto la fecha de emisión y una validez de 30 días desde esa fecha.
- **FR-011**: El sistema MUST permitir editar o eliminar cualquier línea de un presupuesto tanto antes como después de haber generado su PDF, recalculando siempre el desglose y el total.
- **FR-012**: El sistema MUST permitir volver a generar el PDF de un presupuesto ya editado, conservando su número original.
- **FR-013**: El sistema MUST generar un PDF con el logo (si existe), los datos del freelancer y del cliente, el número, las fechas de emisión y validez, la tabla de líneas y el desglose de base, IVA, retención (si la hay) y total.
- **FR-014**: El sistema MUST impedir generar el PDF de un presupuesto sin ninguna línea, avisando al freelancer del motivo.
- **FR-015**: Cuando se cambie el precio por defecto de un servicio del catálogo, el sistema MUST conservar sin cambios el importe de los presupuestos ya creados que usaron ese servicio; el nuevo precio solo MUST aplicarse a presupuestos creados a partir de ese momento.
- **FR-016**: Cuando se edite o elimine la ficha de un cliente, el sistema MUST conservar sin cambios los datos de ese cliente en los presupuestos ya creados con él.
- **FR-017**: El sistema MUST conservar el perfil, el catálogo, la ficha de clientes y todos los presupuestos entre sesiones, de modo que sigan disponibles al cerrar y volver a abrir la aplicación.
- **FR-018**: Un presupuesto nuevo MUST recibir su número y su fecha de emisión en el momento en que se le añade la primera línea, nunca antes. Si el freelancer abandona un presupuesto sin ninguna línea, el sistema MUST descartarlo sin guardarlo y sin consumir número.

### Key Entities *(include if feature involves data)*

- **Perfil del Freelancer**: identidad y marca del único usuario de la aplicación — nombre, NIF, datos de contacto y logo. Se usa en todos los presupuestos y PDFs.
- **Cliente**: destinatario de un presupuesto — nombre, NIF, datos de contacto y tipo (empresa/autónomo o particular). El tipo determina si puede aplicarse retención de IRPF.
- **Servicio (línea de catálogo)**: plantilla reutilizable de un concepto facturable habitual — nombre y precio por defecto. Sirve como origen opcional de las líneas de un presupuesto.
- **Presupuesto**: documento comercial dirigido a un cliente — número (AAAA-NNN), fecha de emisión, validez (30 días), cliente asociado (con sus datos en el momento de creación), retención de IRPF (activada o no, y su tipo), y los totales calculados (base imponible, IVA, retención, total).
- **Línea de Presupuesto**: concepto facturado dentro de un presupuesto — descripción, cantidad, precio unitario e importe, con origen catálogo o manual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un freelancer puede crear un presupuesto completo (cliente, al menos dos líneas y cálculo de impuestos) y descargar su PDF en menos de 5 minutos.
- **SC-002**: El total calculado coincide al céntimo con el ejemplo de referencia en el 100 % de los casos: 2.120,00 € con retención del 15 %, 2.280,00 € con retención del 7 %, y 2.420,00 € sin retención (cliente particular), partiendo de la misma base imponible de 2.000,00 €.
- **SC-003**: El número de presupuesto se asigna automáticamente y en orden correlativo (AAAA-NNN) en el 100 % de los presupuestos creados, sin que el freelancer tenga que calcularlo ni corregirlo manualmente.
- **SC-004**: El 100 % de los PDFs generados muestran, sin que el freelancer tenga que comprobarlo aparte, el logo (cuando existe), el número, las fechas y el desglose completo de impuestos.
- **SC-005**: Tras cerrar y volver a abrir la aplicación, el 100 % del perfil, catálogo, clientes y presupuestos guardados previamente sigue disponible, sin pérdida de datos.

## Assumptions

- La aplicación es de un único usuario (el propio freelancer), sin cuentas ni inicio de sesión; todos los datos se guardan localmente en el equipo del freelancer, sin sincronización en la nube.
- Todo el producto (interfaz, textos y PDF) se presenta en español de España, con importes exclusivamente en euros.
- La elección entre retención del 15 % o del 7 % se hace de forma independiente en cada presupuesto (no es una configuración fija del perfil), ya que depende de la situación fiscal del freelancer en el momento de emitir cada presupuesto.
- Los clientes se gestionan como una ficha reutilizable (crear, editar, eliminar, listar), de forma análoga al catálogo de servicios, en lugar de reintroducirse a mano en cada presupuesto.
- Un presupuesto sigue siendo editable después de generar su PDF; no existe un estado "bloqueado" o "definitivo" en esta versión.
- Modificar el precio de un servicio del catálogo, o editar/eliminar un cliente, nunca altera presupuestos ya creados: estos conservan una copia de los datos (precio, cliente) tal como estaban en el momento de su creación.
- Los datos del freelancer (nombre, NIF, contacto y logo) se leen siempre de su perfil actual y no se congelan en el presupuesto: si cambia su marca y vuelve a descargar el PDF de un presupuesto antiguo, saldrá con los datos nuevos. Solo se congelan los datos del cliente y los precios de las líneas (FR-015, FR-016).
- Esta versión no incluye estados de presupuesto (borrador, enviado, aceptado, rechazado); solo existe el presupuesto en sí y su PDF descargable.

## Out of Scope

- No es una factura: sin facturación electrónica ni VeriFactu en esta versión.
- Sin cuentas de usuario ni inicio de sesión con contraseña.
- Sin almacenamiento en la nube: los datos viven únicamente en el equipo del freelancer.
- Sin soporte multidivisa: solo euros.
- Sin envío del PDF por email desde la propia aplicación (el freelancer lo descarga y lo envía él mismo).
- Sin descuentos por línea ni descuentos globales sobre el presupuesto.
