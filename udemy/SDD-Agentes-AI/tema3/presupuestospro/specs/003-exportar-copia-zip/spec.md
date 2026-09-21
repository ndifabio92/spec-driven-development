# Feature Specification: Exportar todos mis presupuestos en un .zip (PresupuestosPro v1.2)

**Feature Branch**: `003-exportar-copia-zip`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "Exportar todos mis presupuestos en un .zip. Que el freelancer pueda llevarse TODOS sus presupuestos de una sola vez, en un único archivo comprimido .zip, como copia de seguridad y para archivarlos donde quiera. Hoy sus datos viven solo en su navegador: si formatea el ordenador, cambia de navegador o borra el historial, lo pierde todo. Un botón «Exportar todo (.zip)» en la lista de presupuestos descarga un único .zip con un PDF por cada presupuesto —exactamente el mismo PDF que ya genera la app— y un único archivo de datos con toda la información, pensado para poder restaurar la aplicación en el futuro. El zip se llama presupuestospro-copia-AAAA-MM-DD.zip y cada PDF «número - cliente». La exportación no modifica nada. Fuera de alcance: importar la copia, exportar a Excel/CSV, copias automáticas y enviar el zip a ningún sitio."

## Clarifications

### Session 2026-09-19

- Q: Un presupuesto en Borrador puede no tener número ni nombre de cliente, así que la regla «número - cliente» no se le puede aplicar. ¿Qué hace la exportación con los borradores? → A: **Solo se genera PDF de los presupuestos completos** (los que tienen número y cliente, es decir Vigentes y Caducados). Los borradores no producen PDF, pero sí quedan guardados en el archivo de datos, de modo que la copia sigue siendo completa. El aviso posterior a la descarga dice cuántos se han omitido y por qué.
- Q: El encargo enumera el archivo de datos como «presupuestos, catálogo de servicios y perfil con logo», pero la aplicación también guarda la ficha de clientes. ¿Entra en la copia? → A: **Sí: el archivo de datos es una copia completa** de todo lo guardado —perfil, logo, clientes, servicios y presupuestos—. Es lo único que permite que la futura restauración deje la aplicación exactamente como estaba.
- Q: Puede haber 0 presupuestos pero sí perfil, logo, clientes y catálogo. ¿Se bloquea igualmente la exportación? → A: **Solo se bloquea cuando no hay absolutamente nada guardado.** Si hay perfil, clientes o servicios pero ningún presupuesto, la exportación se hace igual: un zip con el archivo de datos y sin PDF, avisando de que no había presupuestos.
- Q: Comprimir en .zip exige una librería nueva y la constitución mantiene la lista de dependencias cerrada (Principio I). ¿Cómo se registra? → A: **Excepción autorizada.** La spec exige el .zip; el plan deberá justificar la dependencia contra el Principio I y elegir la opción más pequeña posible, igual que se hizo con la librería de PDF en la spec 001.
- Q: SC-002 citaba un ejemplo de control de 3.604,00 € que no existe en el proyecto. ¿Contra qué cifra se verifica que los PDF del zip no han cambiado? → A: **Contra el ejemplo de referencia de la spec 001**: base imponible de 2.000,00 € con retención del 15 %, que da un total de **2.120,00 €**. El proyecto mantiene una única cifra de control, reproducible con instrucciones que ya existen.
- Q: ¿Cómo sabrá la aplicación, al restaurar una copia en el futuro, que ese archivo de datos es suyo y que puede leerlo sin estropear nada? → A: **La copia lleva dentro una marca de identidad**: que procede de PresupuestosPro, la versión del formato de datos y la fecha y hora de la exportación. Se exige como requisito ahora, porque las copias hechas hasta entonces ya no se pueden cambiar; cómo se escribe esa marca lo decide el plan.
- Q: El archivo descargado contiene el NIF y los datos de contacto de todos los clientes, sin contraseña ni cifrado. ¿Debe avisarse al freelancer? → A: **Sí, con un aviso breve e informativo** junto al mensaje de «copia lista»: el archivo contiene datos personales suyos y de sus clientes y conviene guardarlo en lugar seguro. No bloquea la exportación ni añade pasos. Cifrar o proteger con contraseña sigue fuera de alcance.
- Q: ¿Qué pasa si el volumen de datos supera lo que el dispositivo del freelancer puede manejar? → A: **La spec no fija un tope numérico**, porque sería una cifra sin medir. Exige que, si la copia no puede completarse, el freelancer vea un aviso claro, sus datos queden intactos y no se descargue ningún archivo a medias. El plan MUST medir el volumen máximo verificado y dejarlo escrito. No se parte la copia en varios archivos: la promesa de «un único .zip» se mantiene.
- Q: Desde la versión 1.1 la aplicación entra por la pantalla de Inicio. ¿El botón de exportar debe estar también ahí, y no solo en la lista de presupuestos? → A: **En las dos pantallas.** En Inicio junto al resumen de actividad, y en la lista de presupuestos. Es el mismo botón y hace exactamente lo mismo desde ambos sitios: una copia de seguridad que no se encuentra no protege a nadie.
- Q: SC-009 afirmaba sin condiciones que con 200 presupuestos la exportación termina, mientras FR-020a admite que puede no hacerlo. ¿Cuál manda? → A: **Se acota SC-009 al escenario medible**: 200 presupuestos con un logo de hasta 100 kB. Por encima manda FR-020a. El motivo es que el logo se incrusta entero en cada PDF, así que el coste escala con el número de presupuestos **por** el tamaño del logo, y un criterio sin esa condición podía resultar insatisfacible.

## Contexto

PresupuestosPro guarda todo dentro del navegador del freelancer y no envía nada a ningún servidor ([spec 001](../001-presupuestos-freelancer/spec.md)). Esa decisión es lo que hace que el producto sea simple, gratuito y privado, y también su mayor riesgo: **hoy no existe ninguna forma de sacar los datos de ahí**. Un ordenador formateado, un navegador cambiado o una limpieza de historial se lo llevan todo.

Esta funcionalidad cierra ese agujero con un solo botón: una copia de seguridad bajo demanda, en un archivo que el freelancer entiende y sabe guardar.

Dos reglas mandan sobre todo lo que sigue:

1. **No se inventa un PDF nuevo.** Los documentos del zip son exactamente los que ya genera la aplicación presupuesto a presupuesto; si difieren en un céntimo o en una línea, la funcionalidad está mal.
2. **Exportar es solo leer.** Al terminar, los datos del freelancer están exactamente igual que antes de pulsar el botón.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Llevarme mis presupuestos en un archivo (Priority: P1)

Como freelancer, quiero pulsar un botón en la lista de presupuestos y descargar un único archivo .zip con un PDF de cada presupuesto, para tener mis documentos guardados fuera del navegador y poder archivarlos donde yo quiera.

**Why this priority**: es el seguro de vida del producto y la razón de ser de la funcionalidad. Por sí sola ya entrega todo el valor: el freelancer deja de depender de un navegador que puede vaciarse.

**Independent Test**: crear tres presupuestos, pulsar el botón, descomprimir el archivo descargado con doble clic y comprobar que contiene los tres PDF con el nombre esperado.

**Acceptance Scenarios**:

1. **Given** un freelancer con tres presupuestos completos, **When** pulsa «Exportar todo (.zip)» en la lista de presupuestos, **Then** se descarga **un único** archivo llamado `presupuestospro-copia-AAAA-MM-DD.zip` con la fecha del día de hoy.
2. **Given** ese archivo descargado, **When** el freelancer lo descomprime con doble clic, **Then** encuentra un PDF por cada presupuesto completo, nombrado «número - cliente» (por ejemplo `2026-001 - Estudio García.pdf`).
3. **Given** un presupuesto cualquiera del zip, **When** el freelancer lo abre y lo compara con el PDF que descarga desde la propia aplicación para ese mismo presupuesto, **Then** ambos documentos son idénticos: mismo número, mismas líneas, mismo desglose y el mismo total al céntimo.
4. **Given** una exportación recién terminada, **When** el freelancer vuelve a la aplicación, **Then** todo sigue exactamente igual: los mismos presupuestos, los mismos números, los mismos clientes y el mismo catálogo. Nada se ha marcado, movido ni borrado.
5. **Given** un freelancer que exporta dos veces el mismo día sin cambiar nada, **When** compara ambas descargas, **Then** contienen los mismos documentos y el mismo archivo de datos.
6. **Given** un freelancer que acaba de abrir la aplicación, **When** mira la pantalla de Inicio, **Then** encuentra ahí el botón de exportar, sin tener que entrar en ninguna sección, y al pulsarlo obtiene exactamente la misma copia que desde la lista.

---

### User Story 2 - Guardar también lo que no sale en el PDF (Priority: P2)

Como freelancer, quiero que dentro del zip venga además un archivo con toda mi información —mis datos y mi logo, mis clientes, mi catálogo de servicios y mis presupuestos—, para que el día de mañana se pueda devolver la aplicación al estado en que la dejé.

**Why this priority**: los PDF salvan los documentos, pero no la herramienta. Sin este archivo, recuperar el trabajo significaría volver a teclear el perfil, el logo, la agenda de clientes y el catálogo a mano. Va después de P1 porque su valor se cobra en una spec futura (la restauración), no hoy.

**Independent Test**: exportar, descomprimir y comprobar que junto a los PDF hay un archivo de datos, y que dentro aparecen el perfil, el logo, los clientes, los servicios y todos los presupuestos, incluidos los borradores.

**Acceptance Scenarios**:

1. **Given** un freelancer con perfil, logo, clientes, servicios y presupuestos guardados, **When** descomprime la copia, **Then** encuentra **un único** archivo de datos junto a los PDF.
2. **Given** ese archivo de datos, **When** se inspecciona su contenido, **Then** incluye el perfil del freelancer con su logo, la ficha de clientes, el catálogo de servicios y **todos** los presupuestos, también los que están en Borrador.
3. **Given** un freelancer que no sabe qué es un «archivo de datos», **When** ve el contenido del zip, **Then** el nombre del archivo y el aviso de la aplicación le dejan claro que es la copia para restaurar y que no necesita abrirlo.
4. **Given** un freelancer sin logo cargado, **When** exporta, **Then** la copia se genera igual y sin errores.

---

### User Story 3 - Saber qué está pasando y cuándo no hay nada que hacer (Priority: P3)

Como freelancer, quiero que la aplicación me diga que está trabajando cuando la exportación tarda, y que me avise en lugar de descargarme un archivo vacío cuando no hay nada que exportar, para no quedarme mirando una pantalla sin saber si he pulsado bien.

**Why this priority**: no añade contenido a la copia, pero sin ello la funcionalidad parece rota justo en los dos casos en que más se duda: cuando tarda y cuando no hay datos.

**Independent Test**: exportar con más de 50 presupuestos y comprobar que se ve el progreso; vaciar la aplicación y comprobar que el botón avisa en vez de descargar.

**Acceptance Scenarios**:

1. **Given** un freelancer con más de 50 presupuestos, **When** pulsa el botón, **Then** ve de inmediato que la exportación está en marcha y cuánto lleva avanzado, hasta que la descarga comienza.
2. **Given** una exportación en marcha, **When** el freelancer vuelve a pulsar el botón, **Then** no se lanza una segunda exportación ni se descargan dos archivos.
3. **Given** una aplicación completamente vacía (sin perfil, sin clientes, sin servicios y sin presupuestos), **When** el freelancer pulsa el botón, **Then** la aplicación le avisa de que no hay nada que exportar y **no** se descarga ningún archivo.
4. **Given** un freelancer con perfil, clientes y catálogo pero sin ningún presupuesto, **When** pulsa el botón, **Then** la copia se descarga igualmente con el archivo de datos y sin PDF, y se le avisa de que no había presupuestos que documentar.
5. **Given** un freelancer con presupuestos en Borrador, **When** termina la exportación, **Then** se le informa de cuántos presupuestos no han generado PDF por estar incompletos y de que sus datos sí están guardados en la copia.
6. **Given** una exportación que falla a mitad, **When** se interrumpe, **Then** el freelancer ve un aviso comprensible, no se descarga un archivo a medias y sus datos siguen intactos.

---

### Edge Cases

- **Cliente con caracteres que rompen un nombre de archivo** («Diseño/Web S.L.», comillas, dos puntos, barras): el nombre del PDF se limpia para que el archivo se pueda descomprimir en cualquier ordenador, conservando el número y un nombre de cliente reconocible.
- **Nombre de cliente muy largo**: el nombre del archivo se recorta a una longitud manejable sin perder el número, que es lo que identifica el documento.
- **Dos PDF que acabarían llamándose igual** tras la limpieza o el recorte: la aplicación garantiza que no se pisan y que en el zip hay exactamente tantos PDF como presupuestos completos.
- **Presupuesto sin número o sin cliente** (Borrador): no genera PDF; sus datos viajan en el archivo de datos.
- **Cliente eliminado de la agenda** pero cuyo presupuesto conserva sus datos: el PDF sale igual, con los datos que el propio presupuesto guarda.
- **Volumen grande (200 presupuestos)**: la exportación termina y produce un único archivo; no se pide al freelancer que exporte por partes.
- **Volumen por encima de lo que el dispositivo aguanta**: la copia no se entrega a medias. El freelancer ve un aviso que explica que no se ha podido generar, y sus datos siguen intactos (FR-020a).
- **Logo pesado**: el archivo de datos lo incluye igualmente; la copia no se queda sin logo.
- **Dos exportaciones el mismo día**: ambas se llaman igual; es el sistema operativo el que decide si renombra la segunda descarga. La aplicación no numera versiones.

## Requirements *(mandatory)*

### Functional Requirements

**El botón y su sitio**

- **FR-001**: Tanto la pantalla de Inicio —junto al resumen de actividad— como la lista de presupuestos MUST ofrecer un botón visible y rotulado «Exportar todo (.zip)», alcanzable sin recorrer la pantalla entera y utilizable también desde el móvil. Es el mismo botón: hace exactamente lo mismo desde ambos sitios y produce la misma copia.
- **FR-002**: La exportación MUST ocurrir únicamente cuando el freelancer pulsa ese botón. No hay copias automáticas, programadas ni al cerrar la aplicación.
- **FR-003**: Mientras una exportación está en marcha, el botón MUST quedar inutilizable en las dos pantallas, para evitar exportaciones simultáneas.

**Lo que se descarga**

- **FR-004**: Al completarse, el sistema MUST descargar **un único** archivo comprimido, abrible con las herramientas estándar de Windows, macOS y Linux sin instalar nada.
- **FR-005**: El archivo MUST llamarse `presupuestospro-copia-AAAA-MM-DD.zip`, donde la fecha es el día en que se realiza la exportación (ejemplo: exportar el 15/03/2026 produce `presupuestospro-copia-2026-03-15.zip`).
- **FR-006**: El archivo MUST contener un documento PDF por cada presupuesto completo y **un único** archivo de datos.

**Los PDF**

- **FR-007**: Cada PDF del archivo MUST ser idéntico, hasta el céntimo y hasta la última línea, al que la aplicación genera para ese mismo presupuesto descargándolo uno a uno. El contenido, el desglose y el aspecto del documento no cambian con esta funcionalidad.
- **FR-008**: El sistema MUST generar PDF únicamente de los presupuestos **completos**, entendiendo por tales los que ya tienen número asignado y nombre de cliente —es decir, los que la aplicación muestra como Vigentes o Caducados—.
- **FR-009**: El sistema NO MUST generar PDF de los presupuestos en Borrador, cuyos datos se conservan íntegros en el archivo de datos.
- **FR-010**: Cada PDF MUST nombrarse con el número del presupuesto seguido del nombre del cliente, en la forma `<número> - <cliente>.pdf` (ejemplo: `2026-001 - Estudio García.pdf`).
- **FR-011**: El sistema MUST depurar de esos nombres cualquier carácter que impida descomprimir o guardar el archivo en un ordenador corriente, conservando el número intacto y un nombre de cliente legible, y MUST recortar los nombres excesivamente largos.
- **FR-012**: El sistema MUST garantizar que no haya dos documentos con el mismo nombre dentro del archivo, de modo que el número de PDF descomprimidos coincida siempre con el número de presupuestos completos.

**El archivo de datos**

- **FR-013**: El archivo MUST incluir un archivo de datos único que recoja **toda** la información guardada: perfil del freelancer con su logo, ficha de clientes, catálogo de servicios y todos los presupuestos, incluidos los que están en Borrador.
- **FR-014**: El archivo de datos MUST guardar la información de forma que una versión futura de la aplicación pueda restaurarla, dejando la herramienta tal como estaba en el momento de exportar.
- **FR-014a**: El archivo de datos MUST llevar dentro una marca de identidad que permita reconocerlo sin necesidad de interpretarlo a mano: que procede de PresupuestosPro, qué versión del formato de datos contiene y la fecha y hora en que se generó la copia. La forma concreta de escribir esa marca se decide en el plan.
- **FR-015**: El archivo de datos MUST llamarse e identificarse de modo que el freelancer entienda para qué sirve sin necesidad de abrirlo ni de saber qué contiene.

**Avisos y casos sin datos**

- **FR-016**: Cuando no haya absolutamente nada guardado (sin perfil, sin clientes, sin servicios y sin presupuestos), el sistema MUST avisar de que no hay nada que exportar y NO MUST descargar ningún archivo.
- **FR-017**: Cuando haya datos guardados pero ningún presupuesto, el sistema MUST completar la exportación con el archivo de datos y sin PDF, informando de que no había presupuestos que documentar.
- **FR-018**: Al terminar, cuando se haya omitido algún presupuesto por estar incompleto, el sistema MUST indicar cuántos han sido y que sus datos sí están incluidos en la copia.
- **FR-018a**: Al terminar una exportación, el sistema MUST advertir al freelancer, en una frase comprensible, de que el archivo descargado contiene datos personales suyos y de sus clientes y de que conviene guardarlo en un lugar seguro. El aviso es informativo: NO MUST bloquear la exportación ni exigir confirmación previa.
- **FR-019**: Mientras la exportación se prepara, el sistema MUST mostrar que está trabajando y cuánto lleva avanzado, de forma continua hasta que arranca la descarga.
- **FR-020**: Si la exportación no puede completarse, el sistema MUST mostrar un aviso comprensible en español de España y NO MUST entregar un archivo incompleto.
- **FR-020a**: Cuando la copia no pueda completarse porque el dispositivo no da abasto con el volumen de datos, el sistema MUST decírselo al freelancer en esos términos, dejar sus datos intactos y no descargar ningún archivo. El sistema NO MUST repartir la copia en varios archivos: el resultado de una exportación es siempre un único archivo o ninguno.

**Lo que no se toca**

- **FR-021**: La exportación MUST ser una operación de solo lectura: no altera, marca, reordena ni elimina ningún dato guardado, y no cambia la numeración de los presupuestos.
- **FR-022**: El archivo generado MUST quedarse en el dispositivo del freelancer. El sistema NO MUST enviarlo, subirlo ni compartirlo con ningún servicio externo.
- **FR-023**: Todos los textos nuevos (botón, progreso y avisos) MUST estar en español de España.

### Key Entities

- **Copia de seguridad**: el archivo comprimido que se descarga. Se identifica por la fecha en que se hizo y agrupa los documentos entregables y la copia íntegra de los datos. No se guarda en la aplicación: nace con la descarga y vive fuera de ella.
- **Documento del presupuesto**: el PDF de un presupuesto completo, el mismo que la aplicación ya entrega hoy. Dentro de la copia se identifica por número y cliente.
- **Archivo de datos**: la copia íntegra de lo guardado —perfil con logo, clientes, servicios y presupuestos—, destinada a una restauración futura y no a ser leída por una persona. Se identifica por su marca de origen, la versión del formato que contiene y el momento en que se generó.
- **Presupuesto completo / Presupuesto en Borrador**: la distinción que decide quién tiene PDF. Es la misma que la aplicación ya muestra en la lista (spec 002); esta funcionalidad no la redefine ni añade ninguna situación nueva.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con tres presupuestos completos, el freelancer pulsa un solo botón y obtiene un único archivo que, al descomprimirlo con doble clic, muestra tres PDF nombrados «número - cliente» y un archivo de datos.
- **SC-002**: El total de cualquier PDF del archivo coincide al céntimo con el del PDF descargado individualmente para ese mismo presupuesto. Con el ejemplo de referencia de la [spec 001](../001-presupuestos-freelancer/spec.md) —base imponible de 2.000,00 € con retención del 15 %— ambos documentos muestran **2.120,00 €**.
- **SC-003**: Comparando página a página, el PDF del archivo y el descargado individualmente son indistinguibles: mismo número, mismas líneas, mismo desglose y mismo pie.
- **SC-004**: Tras exportar, el recuento de presupuestos, clientes y servicios de la pantalla de inicio es idéntico al de antes de exportar, y el siguiente presupuesto creado recibe el número que le habría tocado igualmente.
- **SC-005**: Con la aplicación completamente vacía, pulsar el botón produce un aviso y **cero** archivos descargados.
- **SC-006**: Con datos guardados pero sin presupuestos, la exportación termina correctamente y el archivo contiene el archivo de datos y ningún PDF.
- **SC-007**: Con un cliente llamado «Diseño/Web S.L.», el archivo se descomprime sin errores en Windows y en macOS, y el PDF correspondiente sigue identificándose por su número y por el nombre del cliente.
- **SC-008**: Con 50 presupuestos, el freelancer ve una señal de progreso antes de que pasen **2 segundos** desde que pulsa, y la señal se mantiene hasta que comienza la descarga.
- **SC-009**: Con 200 presupuestos y un logo de tamaño corriente (hasta 100 kB), la exportación termina entregando un único archivo, sin pedir al freelancer que la divida ni obligarle a repetirla. Por encima de ese escenario manda FR-020a: si el dispositivo no llega, se avisa y no se entrega nada a medias.
- **SC-010**: El número de PDF que aparecen al descomprimir coincide exactamente con el número de presupuestos que la lista muestra como Vigentes o Caducados.
- **SC-011**: Una persona no técnica completa la exportación y localiza el archivo descargado sin ayuda y sin leer instrucciones técnicas.
- **SC-012**: Toda exportación completada muestra, junto al mensaje de copia lista, la advertencia de que el archivo contiene datos personales y debe guardarse en lugar seguro.
- **SC-013**: Un freelancer que abre la aplicación llega al botón de exportar en **un solo toque** desde la pantalla de entrada, sin visitar ninguna sección.

## Assumptions

- **El PDF no cambia.** Esta funcionalidad reutiliza el documento que la aplicación ya produce (specs [001](../001-presupuestos-freelancer/contracts/pdf-documento.md) y [002](../002-inicio-y-rediseno/contracts/pdf-presentacion.md)). Cualquier diferencia entre el PDF del archivo y el individual es un defecto de esta funcionalidad, no un rediseño.
- **La distinción Borrador / Vigente / Caducado es la de la spec 002** y se deduce de los datos guardados. Esta spec la usa como criterio para decidir qué presupuestos generan PDF; no la modifica ni guarda ninguna situación nueva.
- **Sin cambios en el modelo de datos.** No se añade ni un campo ni una marca: exportar no deja rastro en lo guardado (FR-021).
- **Nombre del archivo de datos**: se asume un único archivo con un nombre estable y descriptivo en la raíz del archivo comprimido; el nombre exacto se fija en el plan.
- **Fecha de la exportación**: se toma la fecha del dispositivo del freelancer, la misma que la aplicación usa ya para las fechas de emisión y validez.
- **Dependencia nueva autorizada**: producir un archivo comprimido requiere una capacidad que el producto no tiene hoy. La constitución (Principio I, lista cerrada de dependencias) queda expresamente excepcionada para esta funcionalidad; el plan MUST justificar la elección y optar por la alternativa más pequeña que resuelva el requisito, como ya se hizo con la generación de PDF en la spec 001.
- **Descarga del navegador**: el archivo llega a la carpeta de descargas habitual del freelancer. La aplicación no elige la carpeta ni gestiona el almacenamiento del dispositivo.
- **Un dispositivo, un usuario**: se mantiene el supuesto de la spec 001; no hay copias por usuario ni sincronización entre dispositivos.
- **Límite de volumen sin cifrar**: toda la copia se prepara en el propio dispositivo, así que existe un volumen a partir del cual no puede completarse. Esta spec no fija ese tope porque no está medido; el plan MUST verificar hasta qué volumen funciona y dejarlo documentado.

## Fuera de alcance

Queda explícitamente fuera de esta spec, conforme al Principio III (Cero alcance fantasma):

- **Importar o restaurar la copia.** El archivo de datos se diseña para hacerlo posible, pero la funcionalidad de restauración es otra spec.
- **Exportar a Excel, CSV o cualquier formato contable.**
- **Copias automáticas, programadas o periódicas**, y cualquier aviso del tipo «hace mucho que no haces copia».
- **Enviar el archivo por email o subirlo a una nube.** El archivo no sale del dispositivo (FR-022).
- **Elegir qué presupuestos exportar** (por fechas, por cliente o por situación): se exporta todo.
- **Cambiar el aspecto o el contenido del PDF**, la numeración o cualquier cálculo.
- **Proteger el archivo con contraseña o cifrarlo.**
