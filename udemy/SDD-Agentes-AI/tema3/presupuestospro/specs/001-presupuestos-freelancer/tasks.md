---

description: "Task list for Presupuestos para Freelancers (PresupuestosPro v0)"
---

# Tasks: Presupuestos para Freelancers (PresupuestosPro v0)

**Input**: Design documents from `/specs/001-presupuestos-freelancer/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: se incluyen pruebas automáticas **solo** para la lógica pura de dominio (cálculo, redondeo, numeración, formato), según la Decisión 9 de [research.md](./research.md). No hay pruebas de interfaz ni end-to-end: esa verificación la cubre el guion manual de [quickstart.md](./quickstart.md), como exige el Principio IV de la constitución.

**Organization**: las tareas se agrupan por historia de usuario para poder implementarlas y validarlas de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de usuario a la que pertenece (US1…US5)
- Cada tarea indica la ruta exacta del archivo

## Path Conventions

Proyecto único de frontend en la raíz del repositorio (sin `backend/` ni `api/`, porque no hay servidor). Rutas según la estructura de [plan.md](./plan.md): `src/dominio/`, `src/almacen/`, `src/pdf/`, `src/paginas/`, `src/componentes/`, `src/estilos/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: dejar el proyecto arrancando y publicable desde el primer día

- [X] T001 Inicializar proyecto Vite + React 19 + TypeScript 5.9 en la raíz (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`), con scripts `dev`, `build`, `preview` y `test`
- [X] T002 [P] Instalar las cuatro dependencias de producción aprobadas en `package.json`: `react`, `react-dom`, `react-router-dom`, `jspdf`, `jspdf-autotable` (lista cerrada: cualquier añadido debe justificarse contra el Principio I)
- [X] T003 [P] Configurar Vitest en `vite.config.ts` con el script `npm test`, limitado a los archivos `src/dominio/*.test.ts`
- [X] T004 [P] Crear la estructura de carpetas vacías `src/dominio/`, `src/almacen/`, `src/pdf/`, `src/paginas/`, `src/componentes/`, `src/estilos/`
- [X] T005 [P] Configurar `index.html` con `lang="es"`, `<meta name="viewport" content="width=device-width, initial-scale=1">` y título "PresupuestosPro"

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: tipos, almacenamiento, navegación y estilos base que toda historia necesita

**⚠️ CRITICAL**: ninguna historia de usuario puede empezar hasta terminar esta fase

- [X] T006 Definir los tipos del dominio en `src/dominio/tipos.ts` según [data-model.md](./data-model.md): `Perfil`, `Cliente` (`tipo: "empresa" | "particular"`), `Servicio`, `Presupuesto` (`tipoRetencion: 15 | 7`, `retencionActivada: boolean`, copia `cliente`) y `LineaPresupuesto` (`origen: "catalogo" | "manual"`, sin campo de importe almacenado)
- [X] T007 [P] Implementar el formato español en `src/dominio/formato.ts`: `formatearEuros` con `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`, `formatearFecha` a `dd/mm/aaaa` con `Intl.DateTimeFormat('es-ES')` y lectura de números escritos con coma decimal
- [X] T008 [P] Escribir pruebas de formato en `src/dominio/formato.test.ts`: `1500` → `1.500,00 €`, `-300` → `-300,00 €`, fecha `2026-09-18` → `18/09/2026`
- [X] T009 Implementar el almacén en `src/almacen/almacen.ts` según [contracts/almacen-schema.md](./contracts/almacen-schema.md): documento JSON único en `localStorage` bajo la clave `presupuestospro.datos` con `version: 1`, lectura con vuelta a datos vacíos si falta o es ilegible, y escritura que informa del fallo en lugar de callarlo (depende de T006)
- [X] T010 Implementar el acceso a datos desde la interfaz en `src/almacen/useDatos.ts`: estado en React, persistencia tras cada cambio confirmado y señal de error cuando el navegador impide guardar (depende de T009)
- [X] T011 Crear `src/App.tsx` con `HashRouter` y las seis rutas de [plan.md](./plan.md) (`#/`, `#/presupuestos/nuevo`, `#/presupuestos/:id`, `#/clientes`, `#/catalogo`, `#/perfil`), más `src/main.tsx` como punto de entrada
- [X] T012 [P] Escribir los estilos base mobile-first en `src/estilos/global.css`: variables de color y tipografía, botones y campos de al menos 44 px de alto, formularios de una sola columna en móvil y ampliación a escritorio por media query
- [X] T013 [P] Crear los componentes base en `src/componentes/`: `CampoTexto.tsx`, `CampoNumero.tsx` (con `inputMode="decimal"` para que el móvil abra el teclado numérico), `Boton.tsx` y `Aviso.tsx` para mensajes en español

**Checkpoint**: la aplicación arranca, navega entre pantallas vacías y guarda/lee datos del navegador

---

## Phase 3: User Story 1 - Crear un presupuesto con cálculo automático de impuestos (Priority: P1) 🎯 MVP

**Goal**: el freelancer crea un presupuesto, añade líneas a mano y ve base imponible, IVA, retención y total calculados y recalculados solos.

**Independent Test**: crear un presupuesto nuevo, indicar un cliente (empresa o particular), añadir dos líneas manuales y comprobar que los cuatro importes se calculan solos y se actualizan al editar o borrar cualquier línea. Equivale a los apartados C y D del guion de [quickstart.md](./quickstart.md).

### Tests for User Story 1

> Escribir estas pruebas ANTES de la implementación y comprobar que fallan

- [X] T014 [P] [US1] Pruebas de cálculo en `src/dominio/calculo.test.ts`: ejemplo de referencia de la spec (base 2.000,00 €, IVA 420,00 €, retención −300,00 €, total **2.120,00 €**), el mismo caso con retención al 7 % (**2.280,00 €**), cliente particular con la retención activada por error (retención 0, total **2.420,00 €**), presupuesto sin líneas (base 0) y redondeo *half-up* donde `1,005` debe dar `1,01`
- [X] T015 [P] [US1] Pruebas de numeración en `src/dominio/numeracion.test.ts`: primer presupuesto del año → `2026-001`, siguiente → `2026-002`, reinicio del contador al cambiar de año, y salto sin tope a `2026-1000` cuando ya existen 999

### Implementation for User Story 1

- [X] T016 [US1] Implementar `src/dominio/calculo.ts`: `redondearCentimos()` con redondeo *half-up* a 2 decimales y `calcularPresupuesto()` en el orden exacto de [data-model.md](./data-model.md) — base = suma de (cantidad × precio unitario) sin redondear, IVA = base × 0,21, `aplicaRetencion` = retención activada **Y** `cliente.tipo === "empresa"`, total = base + IVA − retención; el redondeo se aplica solo a los cuatro importes presentados
- [X] T017 [US1] Implementar `src/dominio/numeracion.ts`: `siguienteNumero()` derivando el número del máximo ya usado en el año en curso (no de un contador guardado), con relleno a 3 dígitos como mínimo y sin límite superior
- [X] T018 [P] [US1] Crear la pantalla de inicio en `src/paginas/Presupuestos.tsx`: lista de presupuestos con número, cliente, fecha y total, botón destacado "Nuevo presupuesto" y accesos a Perfil, Catálogo y Clientes
- [X] T019 [US1] Crear `src/paginas/EditorPresupuesto.tsx`: asignar `numero` con T017, `fechaEmision` de hoy y `fechaValidez` a 30 días **en el momento de añadir la primera línea**, no al abrir la pantalla; un presupuesto abandonado sin líneas no se guarda ni consume número (FR-018); permitir añadir, editar y eliminar líneas tanto antes como después de generar el PDF (FR-011), sin estado bloqueado
- [X] T020 [US1] Crear `src/componentes/TablaLineas.tsx`: tabla en escritorio y tarjetas apiladas en móvil, con descripción, cantidad y precio unitario editables e importe calculado al vuelo (nunca almacenado)
- [X] T021 [US1] Crear `src/componentes/ResumenTotales.tsx`: base imponible, `IVA (21 %)`, `Retención de IRPF (−15 %)` solo cuando se aplica, y **Total a pagar** destacado y siempre visible en móvil mientras se editan las líneas
- [X] T022 [US1] Añadir el control de retención en `src/paginas/EditorPresupuesto.tsx`: casilla para activarla y elección entre 15 % y 7 % por presupuesto (FR-007); con cliente particular el control queda desactivado con una explicación en español y la retención no se aplica aunque estuviera marcada (FR-008)
- [X] T023 [US1] Añadir el alta de cliente al vuelo en `src/paginas/EditorPresupuesto.tsx`: formulario con nombre (obligatorio), NIF, contacto y tipo, mostrado siempre con las etiquetas visibles **«Empresa o autónomo»** y **«Particular»** (el valor interno es `"empresa" | "particular"`), porque un autónomo también lleva retención y confundirlo con un particular la haría desaparecer del presupuesto; guarda el cliente en el almacén y copia sus datos dentro del presupuesto como copia congelada (FR-004, FR-016)
- [X] T024 [US1] Añadir las validaciones de línea en `src/componentes/TablaLineas.tsx`: descripción no vacía, cantidad **mayor que 0 admitiendo decimales** (ej. 2,5 horas) y precio unitario **mayor o igual que 0**, con mensajes en español que indican el valor esperado

**Checkpoint**: MVP funcional — se pueden crear presupuestos con los impuestos calculados correctamente

---

## Phase 4: User Story 2 - Descargar el presupuesto como PDF con marca (Priority: P2)

**Goal**: convertir el presupuesto en un PDF profesional descargable, que es lo único que ve el cliente final.

**Independent Test**: generar el PDF de un presupuesto ya creado y comprobar a simple vista que incluye número, fechas, tabla de líneas y desglose completo. Equivale al apartado E del guion de [quickstart.md](./quickstart.md).

- [X] T025 [US2] Implementar `src/pdf/generarPdf.ts` con jsPDF + jspdf-autotable según [contracts/pdf-documento.md](./contracts/pdf-documento.md): A4 vertical, márgenes de 15 mm, logo de máximo 40 mm de ancho respetando proporción, bloque de emisor, identificación (título, número, fecha de emisión y `Válido hasta el dd/mm/aaaa`), destinatario con los datos copiados del cliente, tabla de líneas y desglose final
- [X] T026 [US2] Añadir el botón "Descargar PDF" en `src/paginas/EditorPresupuesto.tsx`, que descarga el archivo con el nombre `Presupuesto-2026-001.pdf` usando el número del presupuesto y reutiliza los importes ya calculados en pantalla, sin recalcular nada distinto
- [X] T027 [US2] Impedir la generación del PDF cuando el presupuesto no tiene ninguna línea, mostrando un aviso en español que explica que hace falta al menos una línea, en `src/paginas/EditorPresupuesto.tsx` (FR-014)
- [X] T028 [US2] Avisar antes de generar cuando falten el nombre o el NIF del perfil, sin bloquear la descarga, en `src/paginas/EditorPresupuesto.tsx`
- [X] T029 [US2] Gestionar presupuestos largos en `src/pdf/generarPdf.ts`: la tabla continúa en la página siguiente repitiendo su cabecera y el bloque de totales nunca se parte entre páginas

**Checkpoint**: el producto ya entrega su valor completo — presupuesto calculado y PDF en la mano

---

## Phase 5: User Story 3 - Configurar mi perfil de freelancer (Priority: P3)

**Goal**: que la marca del freelancer se configure una vez y aparezca sola en todos los PDFs.

**Independent Test**: rellenar el perfil, crear un presupuesto después y comprobar que sus datos y su logo salen en el PDF sin volver a escribirlos. Equivale al apartado A del guion de [quickstart.md](./quickstart.md).

- [X] T030 [US3] Crear `src/paginas/Perfil.tsx` con nombre, NIF y contacto multilínea (dirección, email, teléfono), guardando en el almacén; el NIF se guarda tal cual lo escribe el freelancer, sin validar el formato oficial
- [X] T031 [US3] Añadir la subida de logo en `src/paginas/Perfil.tsx`: acepta PNG o JPG de **máximo 1 MB**, guarda la imagen en base64 junto con su ancho y alto originales, y rechaza los archivos mayores con un mensaje que sugiere una imagen más ligera
- [X] T032 [US3] Mostrar en `src/paginas/Perfil.tsx` la vista previa del logo guardado y permitir eliminarlo, teniendo en cuenta que el PDF se genera igualmente sin logo

**Checkpoint**: los PDFs salen con la marca del freelancer

---

## Phase 6: User Story 4 - Mantener un catálogo de servicios reutilizables (Priority: P4)

**Goal**: dejar de reescribir los mismos conceptos en cada presupuesto.

**Independent Test**: crear un servicio, usarlo como línea en un presupuesto nuevo y comprobar que descripción y precio se rellenan solos y pueden ajustarse solo para ese presupuesto. Equivale al apartado B del guion de [quickstart.md](./quickstart.md).

- [X] T033 [US4] Crear `src/paginas/Catalogo.tsx` con alta, edición y eliminación de servicios, cada uno con nombre no vacío y `precioPorDefecto` **mayor o igual que 0** (FR-002)
- [X] T034 [US4] Añadir el selector de servicio del catálogo en `src/paginas/EditorPresupuesto.tsx`, que **copia** descripción y precio a la nueva línea marcándola con `origen: "catalogo"` y `servicioId` como referencia informativa
- [X] T035 [US4] Comprobar en `src/paginas/Catalogo.tsx` y `src/componentes/TablaLineas.tsx` que cambiar o eliminar un servicio no altera ningún presupuesto ya creado, porque la línea guarda una copia y no una referencia (FR-015)

**Checkpoint**: crear presupuestos repetitivos es mucho más rápido

---

## Phase 7: User Story 5 - Mantener una ficha de clientes reutilizable (Priority: P5)

**Goal**: elegir clientes habituales de una lista en vez de reescribir sus datos.

**Independent Test**: dar de alta un cliente por separado, seleccionarlo al crear un presupuesto y comprobar que su tipo determina si la retención puede aplicarse. Equivale al apartado B del guion de [quickstart.md](./quickstart.md).

- [X] T036 [US5] Crear `src/paginas/Clientes.tsx` con alta, edición y eliminación de clientes: nombre (obligatorio), NIF, contacto y tipo, con las mismas etiquetas visibles que T023 — **«Empresa o autónomo»** y **«Particular»** (valor interno `"empresa" | "particular"`) (FR-003)
- [X] T037 [US5] Añadir en `src/paginas/EditorPresupuesto.tsx` el selector de cliente ya guardado, junto a la opción de alta al vuelo creada en T023, copiando sus datos al presupuesto
- [X] T038 [US5] Comprobar en `src/paginas/Clientes.tsx` que editar o eliminar un cliente no altera los presupuestos ya creados con él, que conservan la copia congelada de sus datos (FR-016)

**Checkpoint**: las cinco historias funcionan de forma independiente

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: rematar la experiencia móvil, publicar y validar contra la spec

- [X] T039 [P] Revisar la experiencia móvil completa en `src/estilos/global.css`: todo legible sin zoom, zonas pulsables de 44 px, teclado numérico en importes y cantidades, y total siempre visible al editar líneas
- [X] T040 [P] Revisar que todos los mensajes de error y estados vacíos de `src/paginas/` y `src/componentes/` están en español de España y explican qué hacer, no qué ha fallado por dentro
- [X] T041 [P] Añadir en `src/paginas/Presupuestos.tsx` un aviso visible de que los datos se guardan solo en este navegador y se perderían si se borran los datos del sitio
- [ ] T042 Generar el build de producción (`npm run build`) y publicar la carpeta `dist/` en un alojamiento estático, comprobando que la navegación con `#` funciona sin configurar reglas de servidor
  - *Hecho a medias*: `npm run build` genera `dist/` con rutas de recursos relativas, y servida con `npm run preview` la navegación con `#` responde sin ninguna regla de servidor. Falta **publicarla**, que exige la cuenta de alojamiento del freelancer.
- [ ] T043 Ejecutar el guion de verificación manual completo (apartados A a J) de [quickstart.md](./quickstart.md), incluyendo el cronómetro de 5 minutos y la prueba desde un móvil real
  - *Pendiente de una persona*: por definición lo ejecuta alguien usando la aplicación (Principio IV). Los importes de los apartados C y E se han comprobado aparte sobre el PDF y las pruebas de dominio.
- [X] T044 [P] Verificar la trazabilidad final contra [spec.md](./spec.md) y la constitución: cada FR-001…FR-017 tiene código que lo cumple, y no se ha instalado ninguna dependencia fuera de las cuatro aprobadas en T002

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: sin dependencias, empieza de inmediato
- **Foundational (Fase 2)**: depende de la Fase 1 — **bloquea todas las historias**
- **US1 (Fase 3)**: depende de la Fase 2. Es el MVP
- **US2 (Fase 4)**: depende de US1, porque genera el PDF de un presupuesto ya calculado
- **US3, US4, US5 (Fases 5-7)**: dependen de la Fase 2 y pueden hacerse en cualquier orden o en paralelo entre sí
- **Polish (Fase 8)**: depende de las historias que se quieran publicar

### User Story Dependencies

- **US1 (P1)**: independiente. Incluye el alta de cliente al vuelo y líneas manuales, de modo que no necesita US4 ni US5
- **US2 (P2)**: necesita un presupuesto que imprimir (US1). Funciona aunque el perfil esté vacío: el PDF sale sin logo y avisa
- **US3 (P3)**: independiente. Mejora el PDF de US2 pero no lo condiciona
- **US4 (P4)**: independiente. Añade el selector de catálogo al editor de US1
- **US5 (P5)**: independiente. Amplía el alta de cliente de US1 con una pantalla de gestión

### Parallel Opportunities

- Fase 1: T002, T003, T004 y T005 en paralelo tras T001
- Fase 2: T007+T008 (formato), T012 (estilos) y T013 (componentes base) en paralelo; T009 → T010 van en cadena tras T006
- Fase 3: T014 y T015 (las dos pruebas) en paralelo; T018 en paralelo con T016/T017
- Fases 5, 6 y 7 completas en paralelo si hay varias personas, una por historia
- Fase 8: T039, T040, T041 y T044 en paralelo

---

## Parallel Example: User Story 1

```bash
# Primero, las dos pruebas de dominio a la vez (deben fallar):
Task: "Pruebas de cálculo en src/dominio/calculo.test.ts"
Task: "Pruebas de numeración en src/dominio/numeracion.test.ts"

# Después, la pantalla de lista en paralelo con la lógica de dominio:
Task: "Pantalla de inicio en src/paginas/Presupuestos.tsx"
Task: "Implementar src/dominio/calculo.ts"
Task: "Implementar src/dominio/numeracion.ts"
```

---

## Implementation Strategy

### MVP primero (US1 + US2)

El MVP real de este producto son **dos** historias, no una: el objetivo de negocio es "emitir un presupuesto correcto y con buena imagen en menos de 5 minutos", y sin el PDF el presupuesto no llega al cliente.

1. Fase 1: Setup
2. Fase 2: Foundational (bloquea todo)
3. Fase 3: US1 → **parar y validar** los apartados C y D del quickstart
4. Fase 4: US2 → **parar y validar** el apartado E
5. Publicar: ya es una herramienta útil, aunque el PDF salga sin logo

### Entrega incremental

1. Setup + Foundational → base lista
2. + US1 → los números salen bien (validar y publicar)
3. + US2 → el PDF se descarga (validar y publicar: MVP de negocio)
4. + US3 → los PDFs salen con la marca
5. + US4 → crear presupuestos repetitivos es más rápido
6. + US5 → los clientes habituales se eligen de una lista

Cada paso aporta valor por sí mismo y no rompe el anterior.

---

## Notes

- Las tareas marcadas [P] tocan archivos distintos y no dependen entre sí
- La etiqueta [Story] permite rastrear cada tarea hasta su historia de la spec
- Las únicas pruebas automáticas son las de `src/dominio/`: ahí está el dinero, y es el único error que llega al cliente
- Conviene confirmar los cambios en Git al terminar cada tarea o grupo lógico
- Regla de la constitución que aplica a todo: si aparece una idea nueva durante la implementación, se propone como spec, no se construye
