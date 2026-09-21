---

description: "Task list template for feature implementation"
---

# Tasks: Exportar todos mis presupuestos en un .zip (PresupuestosPro v1.2)

**Input**: Design documents from `/specs/003-exportar-copia-zip/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: se incluyen tareas de prueba **solo para los dos módulos de `src/dominio/`**, porque es la regla del proyecto desde la spec 001: lo que es lógica pura y puede romperse en silencio lleva pruebas automáticas. El empaquetado, la descarga, el progreso y los avisos se verifican con el guion de [quickstart.md](./quickstart.md), como exige el Principio IV. **No se añaden pruebas de interfaz ni de PDF.**

**Organization**: las tareas se agrupan por historia de usuario para poder implementarlas y verificarlas por separado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: a qué historia pertenece (US1, US2, US3)
- Cada tarea lleva su ruta de archivo exacta

## Path Conventions

Proyecto único de frontend, según [plan.md](./plan.md): todo el código vive bajo `src/` en la raíz del repositorio. Las pruebas van **junto al módulo** que prueban (`src/dominio/*.test.ts`), no en una carpeta `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: dejar el proyecto listo para construir archivos comprimidos

- [X] T001 Añadir la dependencia `fflate` (MIT, sin dependencias transitivas) ejecutando `npm install fflate` y comprobar que queda en `dependencies` de `package.json`, no en `devDependencies`
- [X] T002 Verificar que `vite.config.ts` recoge las pruebas nuevas: el patrón `include: ['src/dominio/*.test.ts']` ya cubre `nombresCopia.test.ts` y `sobreCopia.test.ts`. **No debe hacer falta ningún cambio**; si lo hiciera, es señal de que un módulo se ha colocado fuera de `src/dominio/`
- [X] T003 [P] Crear la carpeta `src/exportacion/` (vacía por ahora), la única pieza nueva de la estructura según la *Structure Decision* de `plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: el esqueleto que necesitan por igual la copia de PDF (US1) y el archivo de datos (US2): saber cómo se llama el archivo, saber construirlo y saber entregarlo

**⚠️ CRITICAL**: ninguna historia puede empezar hasta que esta fase esté completa

- [X] T004 Crear `src/dominio/nombresCopia.ts` con `nombreZip(hoy: string): string`, que devuelve `presupuestospro-copia-AAAA-MM-DD.zip` usando la fecha del día en el mismo orden `AAAA-MM-DD` que ya usan las fechas guardadas. El módulo NO importa nada de React ni del navegador: la fecha entra como parámetro
- [X] T005 Crear `src/dominio/nombresCopia.test.ts` con las pruebas de `nombreZip`: una fecha corriente (`2026-03-15` → `presupuestospro-copia-2026-03-15.zip`) y un cambio de año (`2027-01-01`)
- [X] T006 [P] Crear `src/exportacion/descargar.ts` con una función que reciba los bytes y un nombre, construya un `Blob`, dispare la descarga con un enlace temporal y libere la URL después. Es el único punto del código que toca la descarga del navegador
- [X] T007 Crear `src/exportacion/exportarCopia.ts` con el esqueleto de la exportación: leer los datos guardados **en modo solo lectura** (sin escribir nunca en el almacén, FR-021), montar el archivo con el `Zip` en streaming de `fflate` —cada archivo entra y se suelta antes de preparar el siguiente, según la Decisión 3 de `research.md`—, cerrarlo y entregarlo a `descargar.ts` con el nombre de T004. Todavía sin PDF y sin archivo de datos

**Checkpoint**: pulsando desde una consola se obtiene un `.zip` vacío pero válido, con el nombre correcto. A partir de aquí las historias pueden avanzar en paralelo

---

## Phase 3: User Story 1 - Llevarme mis presupuestos en un archivo (Priority: P1) 🎯 MVP

**Goal**: que el freelancer pulse un botón y descargue un `.zip` con un PDF de cada presupuesto completo, idéntico al que ya descarga uno a uno.

**Independent Test**: crear tres presupuestos completos, pulsar el botón, descomprimir con doble clic y comprobar que hay tres PDF con el nombre «número - cliente»; abrir uno y compararlo con el que descarga la aplicación para ese mismo presupuesto (apartados A1, A2 y A3 de `quickstart.md`).

### Tests for User Story 1

- [X] T008 [US1] Ampliar `src/dominio/nombresCopia.test.ts` con las pruebas de `nombrePdf`, una por regla del contrato: caracteres prohibidos sustituidos (`Diseño/Web S.L.` → `Diseño-Web S.L.`), **acentos y eñe conservados**, espacios repetidos colapsados y recortados en los extremos, **punto final conservado** —`Diseño/Web S.L.` produce `2026-002 - Diseño-Web S.L..pdf`, con dos puntos seguidos, y eso es lo correcto—, nombre de cliente recortado a **60 caracteres** sin tocar el número, nombre vacío tras la limpieza → `Cliente`, y dos nombres coincidentes desduplicados con ` (2)`, ` (3)`

### Implementation for User Story 1

- [X] T009 [US1] Añadir a `src/dominio/nombresCopia.ts` la función `nombrePdf(numero, cliente)` que devuelve `<número> - <cliente>.pdf` aplicando, **en este orden exacto** ([contracts/estructura-copia.md](./contracts/estructura-copia.md)): 1) sustituir por un guion `/ \ : * ? " < > |` y los caracteres de control; 2) conservar acentos y eñe; 3) colapsar espacios repetidos y recortar los sobrantes de los extremos; 4) **conservar los puntos, también el final** —`S.L.` sigue siendo `S.L.`, y el archivo acaba en `S.L..pdf`, que es correcto: lo que Windows prohíbe es un nombre que *termine* en punto, y detrás siempre va `.pdf`—; 5) recortar el nombre del cliente a **60 caracteres** y volver a quitar los espacios que queden al final del recorte —el número **nunca** se recorta—; 6) si queda vacío, usar `Cliente`, red de seguridad que FR-008 debería hacer inalcanzable. El número entra tal cual, sin transformar
- [X] T010 [US1] Añadir a `src/dominio/nombresCopia.ts` la desduplicación: dada la lista de nombres ya usados, añadir ` (2)`, ` (3)`… **antes de la extensión** al segundo y siguientes que coincidan, de modo que el número de PDF del zip coincida siempre con el de presupuestos completos (FR-012)
- [X] T011 [US1] En `src/exportacion/exportarCopia.ts`, seleccionar qué presupuestos generan PDF usando la función que ya existe `situacionDe` de `src/dominio/situacion.ts`: entran los que dan `Vigente` o `Caducado`, quedan fuera los `Borrador` (FR-008, FR-009). **No se escribe ninguna condición nueva**: la situación es la de la spec 002 y no se redefine
- [X] T012 [US1] En `src/exportacion/exportarCopia.ts`, generar cada PDF llamando a `construirDocumento(presupuesto, perfil)` de `src/pdf/generarPdf.ts` y pidiéndole los bytes, y añadirlo al zip con el nombre de T009/T010. **`src/pdf/generarPdf.ts` no se modifica**: reutilizar esa función es lo que garantiza FR-007, porque deja un único camino hacia el documento
- [X] T013 [US1] Crear `src/componentes/BotonExportar.tsx` con el botón rotulado **«Exportar todo (.zip)»** que llama a la exportación. Versión mínima: sin progreso y sin avisos, que llegan en US3. Textos en español de España
- [X] T014 [US1] [P] Añadir `BotonExportar` a `src/paginas/Inicio.tsx`, junto al resumen de actividad, alcanzable sin recorrer la pantalla (FR-001, SC-013)
- [X] T015 [US1] [P] Añadir el mismo `BotonExportar` a la cabecera de la lista en `src/paginas/Presupuestos.tsx`. Es el mismo componente: hace lo mismo y produce la misma copia desde los dos sitios (FR-001)

**Checkpoint**: la copia con los PDF ya funciona de punta a punta y es demostrable. Es el MVP: a partir de aquí el freelancer ya no depende de un navegador que puede vaciarse

---

## Phase 4: User Story 2 - Guardar también lo que no sale en el PDF (Priority: P2)

**Goal**: que dentro del zip viaje además toda la información guardada, en un formato que una versión futura pueda restaurar.

**Independent Test**: exportar, descomprimir y comprobar que junto a los PDF hay un `datos-presupuestospro.json` en el que se reconocen el perfil con su logo, los clientes del catálogo, los servicios y **todos** los presupuestos, borradores incluidos (apartado A4 de `quickstart.md`).

### Tests for User Story 2

- [X] T016 [US2] Crear `src/dominio/sobreCopia.test.ts` con la prueba que de verdad importa: que el campo `datos` del sobre es **idéntico** al documento que entró —ni un campo añadido, ni uno quitado, ni un orden distinto—, más las comprobaciones de que `aplicacion` vale `"PresupuestosPro"`, `formatoCopia` vale `1` y `exportadoEl` refleja el momento recibido

### Implementation for User Story 2

- [X] T017 [US2] Crear `src/dominio/sobreCopia.ts` con la función que envuelve los datos según [contracts/archivo-datos.md](./contracts/archivo-datos.md): `{ aplicacion: "PresupuestosPro", formatoCopia: 1, exportadoEl: <fecha y hora con zona horaria>, datos: <el documento tal cual> }`. El momento entra como parámetro para que el módulo siga sin depender del navegador. **`datos` se copia sin modificar**: es lo que hará posible restaurar sin traducir nada
- [X] T018 [US2] En `src/exportacion/exportarCopia.ts`, añadir al zip el archivo `datos-presupuestospro.json` en la raíz, con el sobre de T017 serializado. Incluye el documento completo: perfil con logo, **la agenda de clientes entera** (no solo los clientes que aparecen en presupuestos), el catálogo de servicios y todos los presupuestos, **borradores incluidos** (FR-013)

**Checkpoint**: la copia ya es completa. Los PDF salvan los documentos y el archivo de datos salva la herramienta

---

## Phase 5: User Story 3 - Saber qué está pasando y cuándo no hay nada que hacer (Priority: P3)

**Goal**: que la aplicación diga que está trabajando cuando tarda, y avise en vez de descargar un archivo vacío cuando no hay nada que exportar.

**Independent Test**: exportar con más de 50 presupuestos y comprobar que el progreso avanza y que el botón no admite una segunda pulsación; vaciar la aplicación y comprobar que avisa sin descargar nada (apartados A5, A7 y A8 de `quickstart.md`).

### Implementation for User Story 3

- [X] T019 [US3] En `src/exportacion/exportarCopia.ts`, ceder el control al navegador **después de cada documento** y comunicar el avance (cuántos llevan de cuántos). Sin esto el progreso se calcula pero no llega a dibujarse nunca, porque generar un PDF ocupa el mismo hilo que pinta la pantalla (Decisión 4 de `research.md`)
- [X] T020 [US3] En `src/exportacion/exportarCopia.ts`, aplicar la regla de cuándo no hay nada que hacer: si **no hay absolutamente nada guardado** (sin perfil relleno, sin clientes, sin servicios y sin presupuestos) no se construye ni se descarga nada (FR-016); si hay datos pero ningún presupuesto, la copia **sí** se genera con el archivo de datos y sin PDF (FR-017). Ver la tabla de `data-model.md`
- [X] T021 [US3] En `src/exportacion/exportarCopia.ts`, gestionar el fallo: si la copia no puede completarse, no entregar ningún archivo, dejar los datos intactos y devolver el motivo, distinguiendo el caso de **volumen que el dispositivo no puede manejar** (FR-020, FR-020a). Nunca se reparte la copia en varios archivos
- [X] T022 [US3] En `src/componentes/BotonExportar.tsx`, mostrar el progreso mientras dura la exportación —visible antes de **2 segundos** desde la pulsación (SC-008) y avanzando durante la espera— y dejar el botón inutilizable en las dos pantallas mientras tanto, para que no se lancen dos exportaciones (FR-003)
- [X] T023 [US3] En `src/componentes/BotonExportar.tsx`, añadir los **cinco** avisos finales, todos en español de España: qué es `datos-presupuestospro.json` —la copia que servirá para restaurar, y que no hace falta abrir— de modo que el freelancer lo entienda sin saber qué contiene (FR-015, escenario 3 de US2); cuántos presupuestos se han omitido por estar incompletos y que sus datos sí están en la copia (FR-018); que **el archivo contiene datos personales suyos y de sus clientes y conviene guardarlo en lugar seguro** (FR-018a, informativo, sin bloquear ni pedir confirmación previa); que no había presupuestos que documentar (FR-017); y que no hay nada que exportar (FR-016)
- [X] T024 [US3] [P] Añadir a `src/estilos/global.css` los estilos del progreso y del botón inutilizado, **usando los tokens que ya existen** en el bloque `:root`. Ni un color, tamaño o espaciado nuevo fuera de ahí

**Checkpoint**: las tres historias funcionan por separado. La funcionalidad está completa

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T025 Ejecutar `npm test` y comprobar que pasan las pruebas nuevas de `src/dominio/nombresCopia.test.ts` y `src/dominio/sobreCopia.test.ts` **y todas las que ya había**: los cálculos, la numeración, el formato y la situación no se han tocado
- [X] T026 [P] Ejecutar `npm run build` y confirmar que `tsc --noEmit` pasa con la configuración estricta del proyecto y que `dist/` se genera
- [ ] T027 Ejecutar la **Parte A** completa de [quickstart.md](./quickstart.md) (A1 a A8) con un escenario real: tres presupuestos completos, uno de ellos con el cliente `Diseño/Web S.L.`, un cuarto en Borrador, perfil con logo y un par de clientes y servicios en el catálogo
- [ ] T028 Ejecutar el apartado **B2** de [quickstart.md](./quickstart.md) —medir el límite de volumen con logo ligero (~50 kB) y logo pesado (~1 MB) en los escalones de 50, 100 y 200 presupuestos, y en un móvil— y **rellenar la tabla de resultados del propio quickstart** anotando el equipo y el navegador. Es el deber que la spec dejó pendiente al no fijar un tope inventado (FR-020a)
- [ ] T029 [P] Ejecutar el apartado **B3** de [quickstart.md](./quickstart.md): descomprimir el mismo zip en **Windows** y en **macOS** con el descompresor del sistema y comprobar que el nombre del PDF conserva la eñe y los acentos (SC-007)
- [X] T030 **Paso final de mantenimiento**: actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, **una línea por decisión y con la referencia `[003]`** delante. Pasar cada candidata por el filtro de la sección *Paso final de mantenimiento* de [plan.md](./plan.md) —¿sigue siendo cierta cuando esta feature ya no se toque?, ¿habría evitado un error a alguien que nunca lea esta spec?, ¿contradice algo que ya está escrito?— y **no añadir entradas por añadir**. `CLAUDE.md` tiene que seguir cabiendo en una pantalla, así que añadir puede significar reescribir otra línea. Lo local de la feature (el patrón del nombre del zip, el recorte a 60 caracteres, las dos pantallas del botón) **no entra**: ya vive en `contracts/estructura-copia.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias, se puede empezar ya
- **Foundational (Phase 2)**: depende del Setup. **Bloquea las tres historias**
- **User Stories (Phase 3 a 5)**: todas dependen de la Fase 2. Después pueden ir en paralelo o en orden de prioridad (P1 → P2 → P3)
- **Polish (Phase 6)**: depende de que las historias que se quieran entregar estén completas

### User Story Dependencies

- **US1 (P1)**: arranca en cuanto termina la Fase 2. No depende de ninguna otra historia
- **US2 (P2)**: arranca en cuanto termina la Fase 2. **Independiente de US1**: añade un archivo distinto al mismo zip y no toca nada de la generación de PDF
- **US3 (P3)**: arranca en cuanto termina la Fase 2, pero su valor se ve con US1 ya hecha (el progreso solo se nota cuando hay PDF que generar). Si se implementan en paralelo, T019–T021 y T012 tocan el mismo archivo: coordinar

### Within Each User Story

- Las pruebas de dominio (T008, T016) se escriben **antes** que el módulo que prueban y deben fallar primero
- Dominio antes que exportación; exportación antes que interfaz
- Historia terminada y verificada antes de pasar a la siguiente prioridad

### Same-File Constraints (no marcar [P] entre sí)

- `src/dominio/nombresCopia.ts`: T004 → T009 → T010
- `src/dominio/nombresCopia.test.ts`: T005 → T008
- `src/exportacion/exportarCopia.ts`: T007 → T011 → T012 → T018 → T019 → T020 → T021
- `src/componentes/BotonExportar.tsx`: T013 → T022 → T023

### Parallel Opportunities

- **Fase 1**: T003 en paralelo con T001/T002
- **Fase 2**: T006 (`descargar.ts`) en paralelo con T004/T005 (`nombresCopia.ts`)
- **Fase 3**: T014 y T015 en paralelo entre sí, en cuanto exista `BotonExportar` (T013): son dos páginas distintas
- **Fase 4**: US2 entera puede ir en paralelo con US1, en otro par de manos
- **Fase 5**: T024 (`global.css`) en paralelo con el resto de US3
- **Fase 6**: T026 y T029 en paralelo con el resto

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Dos frentes que no se pisan: los nombres son lógica pura, la descarga es navegador
Task: "Crear src/dominio/nombresCopia.ts con nombreZip()"
Task: "Crear src/exportacion/descargar.ts con la descarga por Blob"
```

## Parallel Example: User Story 1

```bash
# Una vez existe BotonExportar (T013), las dos páginas se tocan a la vez
Task: "Añadir BotonExportar a src/paginas/Inicio.tsx junto al resumen"
Task: "Añadir BotonExportar a la cabecera de la lista en src/paginas/Presupuestos.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Fase 1: Setup (T001–T003)
2. Fase 2: Foundational (T004–T007) — **crítica, bloquea todo**
3. Fase 3: US1 (T008–T015)
4. **PARAR Y VALIDAR**: apartados A1, A2 y A3 de `quickstart.md`. Lo que hay que mirar es que el PDF del zip y el descargado individualmente dicen lo mismo, con **2.120,00 €** en el ejemplo de referencia
5. En ese punto la funcionalidad ya protege al freelancer: sus documentos están fuera del navegador

### Incremental Delivery

1. Setup + Foundational → hay un zip que se descarga
2. + US1 → los PDF ya viajan dentro (**MVP**)
3. + US2 → la copia sirve además para restaurar el día de mañana
4. + US3 → la espera se explica y los casos vacíos avisan en lugar de descargar la nada
5. Fase 6 → pruebas, medición del límite y `CLAUDE.md`

### Parallel Team Strategy

Con dos personas, en cuanto termine la Fase 2:

- Persona A: US1 (los PDF, el componente y las dos páginas)
- Persona B: US2 (el sobre y el archivo de datos), que no toca la generación de PDF

US3 se hace después, cuando US1 esté en pie: coordinar porque comparte `exportarCopia.ts` y `BotonExportar.tsx`.

---

## Notes

- `src/pdf/generarPdf.ts` y `src/almacen/` **no se modifican**. Si una tarea obliga a tocarlos, algo se ha desviado del plan: el PDF se reutiliza y el almacén solo se lee
- «Idéntico» al comparar PDF significa **mismo contenido**, no mismos bytes: el documento lleva dentro su fecha de creación. Se comparan mirando, no con una herramienta binaria
- Las pruebas automáticas se limitan a `src/dominio/`. Todo lo demás se verifica con el quickstart, como exige el Principio IV
- T028 no es opcional: es el único sitio donde queda escrito el límite real de volumen, y la spec lo dejó pendiente a propósito
