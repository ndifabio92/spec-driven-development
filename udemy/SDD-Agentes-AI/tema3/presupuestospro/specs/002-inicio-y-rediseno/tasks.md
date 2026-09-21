---

description: "Task list for PresupuestosPro v1.3 — dirección visual «Mediterráneo»"
---

# Tasks: Pantalla de inicio e imagen «Mediterráneo» (PresupuestosPro v1.1 → v1.3)

**Input**: Design documents from `/specs/002-inicio-y-rediseno/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: **No hay tareas de prueba automática, y es intencionado.** La spec no añade ninguna regla de dominio: la situación, el cálculo, la numeración y el formato no se tocan. Las pruebas que ya existen son la red que demuestra que siguen intactos, y su tarea es comprobar que **siguen en verde sin haber cambiado** (T058). La verificación de esta revisión la ejecuta una persona con [quickstart.md](./quickstart.md), conforme al Principio IV de la constitución.

**Organization**: Tareas agrupadas por historia de usuario. Dos historias —US1 y US4— **ya están entregadas** desde la v1.1 y solo reciben un ajuste cada una; tienen su propia fase al final, no al principio.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivo distinto, sin depender de nada incompleto)
- **[Story]**: a qué historia pertenece (US1 … US6)
- Cada tarea lleva su ruta de archivo exacta

## Path Conventions

Proyecto único, rutas desde la raíz del repositorio: `src/`, `index.html`, `CLAUDE.md`. No hay carpeta `tests/`: las pruebas viven junto al módulo de dominio que cubren (`src/dominio/*.test.ts`) y **esta revisión no las toca**.

## Nota sobre el orden: prioridad de la spec y bloques del plan

El plan fija dos prerrequisitos **duros**: renombrar el espaciado antes de cambiar valores, y tener el bloque de tokens antes de que nada lo consuma. Eso es exactamente lo que hacen las fases 1 y 2. A partir de ahí el orden de las historias sigue **la prioridad de la spec** (US2 → US3 → US5 → US6), no el orden narrativo de los cuatro bloques del plan: el PDF va en segundo lugar porque es lo único que ve el cliente, y solo depende de la fase 2.

**El archivo `src/estilos/global.css` es el cuello de botella de esta revisión**: casi todas las fases lo tocan, así que dentro de una misma fase hay muy pocas tareas paralelizables. Las marcadas con `[P]` son las que van a otro archivo.

---

## Phase 1: Setup (activos de tipografía)

**Purpose**: meter en el producto los dos archivos de tipografía y su licencia, y declararlos. Sin esto, la fase 3 no tiene familias que aplicar.

- [X] T001 [P] Colocar el archivo variable de la familia de lectura (Figtree, ejes de grosor 400–700, subconjunto latino, formato `woff2`) en `src/estilos/fuentes/figtree-variable-latin.woff2`
- [X] T002 [P] Colocar el archivo de la familia de titulares (Bricolage Grotesque, **solo grosor 700**, subconjunto latino, formato `woff2`) en `src/estilos/fuentes/bricolage-grotesque-700-latin.woff2`
- [X] T003 [P] Añadir el texto de la licencia SIL Open Font License de las dos familias en `src/estilos/fuentes/OFL.txt` — **requisito legal para distribuir `dist/`**, no un extra
- [X] T004 Declarar las dos familias con `@font-face` al principio de `src/estilos/global.css`, apuntando a los archivos de T001 y T002, con `font-display: swap`; la familia de lectura declara el rango `font-weight: 400 700` para que un solo archivo sirva los tres grosores
- [X] T005 Añadir en `index.html` la precarga de la familia de lectura (`<link rel="preload" as="font" type="font/woff2" crossorigin>`), para que la ventana en la que se ve la letra del sistema sea de milisegundos

**Checkpoint**: los dos archivos viajan en el producto y no se pide nada a ningún tercero. Todavía no se usan.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: dejar el bloque único de tokens con los valores de la dirección nueva, **en el orden que impide que un error de renombrado quede escondido**.

**⚠️ CRÍTICO**: ninguna historia puede empezar hasta que esta fase esté completa. Y dentro de ella, **T006 → T008 van antes que T009**, sin excepción.

### Paso 1 — Renombrar sin cambiar nada de lo que se ve (FR-041)

- [X] T006 Renombrar los peldaños de espaciado en `src/estilos/global.css` **conservando su valor exacto**: `--espacio-2` (0.75rem) → `--espacio-3`, `--espacio-3` (1rem) → `--espacio-4`, `--espacio-4` (1.5rem) → `--espacio-5`, `--espacio-5` (2.5rem) → `--espacio-6`; `--espacio-1` (0.25rem) se queda igual. Actualizar los más de cien usos del archivo
- [X] T007 Declarar en el bloque `:root` de `src/estilos/global.css` los dos peldaños nuevos, **todavía sin usar en ninguna regla**: `--espacio-2: 0.5rem` y `--espacio-7: 3rem`
- [X] T008 **Verificar la Parte 0 de [quickstart.md](./quickstart.md)**: comparar la pantalla de inicio y un presupuesto abierto con las capturas de referencia. **No debe apreciarse ninguna diferencia.** Si algo se movió, es un error de renombrado y hay que corregirlo antes de seguir

### Paso 2 — Sustituir los valores y añadir los tokens que faltan

- [X] T009 Sustituir los tokens de color del bloque `:root` de `src/estilos/global.css` por los catorce de [contracts/sistema-visual.md](./contracts/sistema-visual.md): `--color-fondo: #FFF8F3`, `--color-papel: #FFFFFF`, `--color-tinta: #241A15`, `--color-tinta-suave: #7A6A62`, `--color-tinta-tenue: #8D7D74`, `--color-linea: #F0E2D8`, `--color-linea-fuerte: #E0CBBD`, `--color-borde-control: #A08A7C`, `--color-acento: #B34A25`, `--color-acento-pulsado: #8F3A1C`, `--color-acento-suave: #FBEBE3`, `--color-oliva: #4E5F33`, `--color-atencion: #8A5A0E`, `--color-error: #A32A22`
- [X] T010 Sustituir los tokens de tipografía del bloque `:root` de `src/estilos/global.css`: `--tipo-familia-titular` y `--tipo-familia` (con respaldo `system-ui`), `--tipo-apoyo: 0.875rem`, `--tipo-base: 1rem`, `--tipo-seccion: 1.25rem`, `--tipo-titulo: 1.75rem`, `--tipo-titulo-amplio: 2.25rem`, `--tipo-total: 2rem`, `--peso-normal: 400`, `--peso-medio: 500`, `--peso-fuerte: 700`, `--letra-titular: -0.02em`, `--letra-cifra: -0.01em`, `--linea-apretada: 1.15`, `--linea-normal: 1.55`. **Todos valores planos**: ninguno puede ser una expresión calculada
- [X] T011 Ajustar el último valor de la escala de espaciado en `src/estilos/global.css`: `--espacio-6` pasa de 2.5rem a `2rem`, y el aire entre secciones y al pie de página pasa a usar `--espacio-7`
- [X] T012 Añadir en el bloque `:root` de `src/estilos/global.css` los tokens de forma, elevación, movimiento y anchura: `--radio-1: 8px`, `--radio-2: 14px`, `--radio-3: 20px`, `--radio-pastilla: 999px`, `--sombra-1`, `--sombra-2`, `--sombra-3`, `--transicion-rapida: 120ms`, `--transicion: 200ms`, `--ancho-contenido: 68rem`, `--ancho-texto: 42rem`; conservar `--toque: 44px` intacto
- [X] T013 Añadir al final de `src/estilos/global.css` la regla global de `prefers-reduced-motion: reduce` que anula todas las transiciones y animaciones (FR-046)
- [X] T014 Sustituir en `src/estilos/global.css` las mezclas `color-mix()` **que el PDF necesita leer** por los tokens planos equivalentes: el relleno del bloque destacado pasa a `--color-acento-suave` y la línea que estructura pasa a `--color-linea-fuerte`. Las mezclas que solo pintan pantalla (relleno de las etiquetas de situación) pueden quedarse
- [X] T015 Revisar el bloque `:root` de `src/estilos/global.css` y confirmar que **ningún token es una expresión calculada**, conforme a la regla que manda sobre todas en [contracts/sistema-visual.md](./contracts/sistema-visual.md). Un token con una fórmula haría que el PDF cayera a su valor de respaldo sin avisar

**Checkpoint**: el sistema visual está en su sitio. La aplicación se ve a medio camino —colores nuevos sobre maquetación antigua— y eso es lo esperado. Las historias pueden empezar.

---

## Phase 3: User Story 2 - Que la herramienta tenga carácter propio (Priority: P1) 🎯 MVP

**Goal**: las seis pantallas comparten identidad —dos familias con un trabajo cada una, tres pesos, tres tonos de línea, jerarquía con el dinero arriba— y ninguna acción existente desaparece.

**Independent Test**: recorrer las seis pantallas en móvil y en escritorio con la tabla de paleta impresa al lado y comprobar que comparten familias, colores, ritmo y jerarquía, y que todo lo que se podía hacer antes se sigue pudiendo hacer. Es la Parte E de [quickstart.md](./quickstart.md).

### Implementation for User Story 2

- [X] T016 [US2] Aplicar las dos familias en `src/estilos/global.css`: `--tipo-familia-titular` **solo** en `h1` y `.marca`; `--tipo-familia` en `body` y por herencia en todo lo demás (FR-031)
- [X] T017 [US2] Componer la fluidez del título en la regla de `h1` de `src/estilos/global.css` con `clamp()` entre `var(--tipo-titulo)` y `var(--tipo-titulo-amplio)`, y **eliminar el `font-size: 1.75rem` escrito a mano** del bloque `@media (min-width: 40rem)`
- [X] T018 [US2] Ajustar la escala de encabezados en `src/estilos/global.css`: `h2` a `--tipo-seccion` (20 px, ya no 2 px por encima del párrafo), `h3` por encima del texto normal, `.subtitulo` y `.campo-ayuda` a `--tipo-apoyo`, aplicando `--letra-titular` y `--linea-apretada` a los titulares y `--linea-normal` al cuerpo (FR-032)
- [X] T019 [US2] Repartir los tres pesos en `src/estilos/global.css` y **eliminar todos los `font-weight: 600`**: `--peso-medio` en `.campo-etiqueta`, `.navegacion a`, `legend`, `.tabla-lineas th`, `.tabla-lineas td::before` y `.etiqueta`; `--peso-fuerte` en `h1`, `h2`, `.marca`, `.importe-linea`, `.dato-cifra` y `.resumen-total`; `--peso-normal` en el resto (FR-033)
- [X] T020 [US2] Subir el total en `src/estilos/global.css`: `.resumen-total` y `.dato-cifra` a `--tipo-total` con `--linea-apretada` y `--letra-cifra`, de modo que el total sea el elemento tipográficamente mayor de su pantalla (FR-011)
- [X] T021 [US2] Poner `font-variant-numeric: tabular-nums` y alineación a la derecha en **todo** importe de `src/estilos/global.css`: `.importe-linea`, `.dato-cifra`, `.resumen-fila span:last-child`, `.resumen-total` y la columna de importe de la tabla (FR-034)
- [X] T022 [US2] Separar los tres tonos de línea en `src/estilos/global.css`: `--color-borde-control` en `input`, `select`, `textarea`, `.boton` y `fieldset`; `--color-linea-fuerte` en `.tabla-lineas th` y en la regla superior de `.resumen-total`; `--color-linea` **solo** entre filas de lista y en el borde de las tarjetas. El contorno de un campo nunca usa `--color-linea`
- [X] T023 [US2] Aplicar los tres radios y las tres elevaciones en `src/estilos/global.css`: `--radio-1` en campos y etiquetas, `--radio-2` en `.boton` y `.tarjeta`, `--radio-3` en `.resumen` y la tarjeta destacada, `--radio-pastilla` en `.etiqueta` y `.origen-linea`; `--sombra-1` en reposo, `--sombra-2` en superficie elevada y `--sombra-3` en `.resumen-fijo`, **eliminando la sombra escrita a mano** de esa regla
- [X] T024 [US2] Separar superficie y lienzo en `src/estilos/global.css`: `.tarjeta`, `.dato`, `.acceso` y `.resumen` en `--color-papel` sobre el `--color-fondo` cálido, de forma que se distingan por temperatura y no solo por un borde de 1 px (FR-038)
- [X] T025 [US2] Revisar los ocho componentes para que no escriban ningún valor visual propio y usen las clases nuevas: `src/componentes/Boton.tsx`, `Aviso.tsx`, `CampoTexto.tsx`, `CampoNumero.tsx`, `TablaLineas.tsx`, `ResumenTotales.tsx`, `EtiquetaSituacion.tsx` y `BotonExportar.tsx`
- [X] T026 [US2] Recorrer las seis páginas comprobando que ninguna acción desaparece, se esconde ni cuesta más pasos (FR-014): `src/paginas/Inicio.tsx`, `Presupuestos.tsx`, `EditorPresupuesto.tsx`, `Clientes.tsx`, `Catalogo.tsx` y `Perfil.tsx`
- [ ] T027 [US2] **Verificar las Partes D y E de [quickstart.md](./quickstart.md)** y anotar Sí/No en SC-006, SC-010, SC-011, SC-012, SC-013, SC-024 y SC-027

**Checkpoint**: la aplicación ya tiene la cara nueva en pantalla y es entregable por sí sola. El PDF sigue con la cara antigua.

---

## Phase 4: User Story 3 - Que el PDF transmita lo mismo (Priority: P2)

**Goal**: el documento que recibe el cliente adopta la paleta, el aire y la jerarquía nuevos, con el total como elemento mayor, sin cambiar una sola palabra ni un céntimo.

**Independent Test**: descargar el PDF del presupuesto de referencia, ponerlo junto al anterior y comprobar que dice exactamente lo mismo con otra cara. Son las Partes H, I y J de [quickstart.md](./quickstart.md).

### Implementation for User Story 3

- [X] T028 [US3] Ampliar `src/estilos/tokens.ts` con un lector de tamaños que convierta el valor en `rem` de un token de tipografía o de espaciado a puntos con la conversión declarada **1 rem = 9 pt**, con el mismo valor de respaldo que ya tiene el lector de color (un PDF que no sale es peor que un PDF con un tamaño distinto)
- [X] T029 [US3] Sustituir en `src/pdf/generarPdf.ts` **los catorce tamaños escritos a mano** (8, 9, 9.5, 10, 12, 14, 24…) por llamadas al lector de T028, de modo que todos salgan de la escala del sistema visual (FR-051)
- [X] T030 [US3] Rehacer la banda de cabecera de `src/pdf/generarPdf.ts` en `--color-acento`, recomponiéndose sin hueco cuando el freelancer no tiene logo (FR-023)
- [X] T031 [US3] Rehacer el bloque de desglose de `src/pdf/generarPdf.ts`: fondo `--color-acento-suave`, **Total a pagar a `--tipo-total` (18 pt) como elemento mayor del documento**, y número del presupuesto a `--tipo-titulo` (15,75 pt, antes 24)
- [X] T032 [US3] Rehacer la tabla de líneas de `src/pdf/generarPdf.ts`: cabecera en `--color-tinta-suave` con `--peso-medio`, filas separadas por `--color-linea-fuerte`, importes alineados a la derecha con cifras de ancho fijo
- [X] T033 [US3] Sustituir en `src/pdf/generarPdf.ts` las separaciones entre bloques por los tokens de espaciado leídos del sistema, en lugar de milímetros decididos bloque a bloque
- [ ] T034 [US3] Comprobar, sobre el PDF que genera `src/pdf/generarPdf.ts` con un presupuesto de unas 40 líneas, que la tabla sigue repitiendo su cabecera al cambiar de página y que **el bloque de totales no se parte** ahora que el total ocupa 18 pt en lugar de 14 (FR-022). Es el requisito con más riesgo de esta revisión
- [ ] T035 [US3] **Verificar las Partes H, I y J de [quickstart.md](./quickstart.md)** y anotar Sí/No en SC-005, SC-025 y SC-026: mismos importes y 2.120,00 €, mismo número de páginas, peso no más de un 20 % por encima, sin logo y con logo de colores fríos

**Checkpoint**: aplicación y documento se reconocen como el mismo producto por color, aire y jerarquía.

---

## Phase 5: User Story 5 - Que la aplicación acuse cada toque (Priority: P3)

**Goal**: los seis estados existen y se notan, resueltos una sola vez sobre las clases base.

**Independent Test**: recorrer una pantalla con formulario con el ratón, luego solo con el tabulador y luego con «reducir movimiento» activado. Es la Parte F de [quickstart.md](./quickstart.md).

### Implementation for User Story 5

- [X] T036 [US5] Escribir el estado **encima** en `src/estilos/global.css` sobre `.boton`, `.navegacion a` y `.acceso`: cambio perceptible de fondo y borde en `--transicion-rapida`, y `--color-acento-pulsado` en el botón principal. Si hay que comparar dos capturas para verlo, no cumple (SC-019)
- [X] T037 [US5] Escribir el estado **pulsado** (`:active`) en `src/estilos/global.css` para todo lo pulsable: fondo `--color-acento-pulsado` y hundimiento de 1 px (FR-043)
- [X] T038 [US5] Rehacer el estado **inactivo** en `src/estilos/global.css`: fondo y borde propios y texto en `--color-tinta-tenue`, **eliminando `opacity: 0.55` de `.boton:disabled` y `opacity: 0.6` de `fieldset[disabled]`** — los dos valores distintos para lo mismo que traía la v1.1 (FR-044)
- [X] T039 [US5] Unificar el anillo de **foco de teclado** en `src/estilos/global.css`: 3 px en `--color-acento` con separación de 2 px, idéntico en enlaces, botones y campos (FR-045)
- [X] T040 [US5] Extraer el tratamiento de **ocupado** que hoy solo usa la exportación de la copia a una clase reutilizable en `src/estilos/global.css`, y aplicarlo desde `src/componentes/BotonExportar.tsx` (FR-043)
- [X] T041 [US5] Revisar `src/estilos/global.css` y confirmar que **toda** transición sale de `--transicion-rapida` o `--transicion`, sin duraciones escritas a mano
- [ ] T042 [US5] **Verificar la Parte F de [quickstart.md](./quickstart.md)** y anotar Sí/No en SC-019, SC-020, SC-021, SC-022 y SC-023

**Checkpoint**: la aplicación responde. Se nota que es una aplicación y no una maqueta.

---

## Phase 6: User Story 6 - Que se vea bien del móvil al monitor grande (Priority: P4)

**Goal**: el contenido está colocado a propósito en móvil, escritorio y escritorio ancho, sin filas huérfanas ni columnas estrechas entre franjas vacías.

**Independent Test**: abrir la misma pantalla en móvil, escritorio estrecho, tablet en horizontal y monitor de 1440 px o más. Es la Parte G de [quickstart.md](./quickstart.md).

### Implementation for User Story 6

- [X] T043 [US6] Sustituir el ancho máximo de `src/estilos/global.css` por `--ancho-contenido` en `.cabecera-fila` y `.contenido`, y limitar los párrafos largos a `--ancho-texto` (FR-048)
- [X] T044 [US6] Añadir en `src/estilos/global.css` el **segundo punto de ruptura** `@media (min-width: 64rem)` con más relleno interior, manteniendo el de 40rem que ya existe (FR-047)
- [X] T045 [US6] Sustituir en `src/estilos/global.css` la rejilla `auto-fit` de `.resumen-actividad` por un **número de columnas declarado por anchura**, de modo que las cinco cifras nunca dejen una fila huérfana con una sola cifra (FR-049)
- [X] T046 [US6] Repartir en dos columnas a partir de 64rem, en `src/estilos/global.css` y con los ajustes de marcado que hagan falta en `src/paginas/Inicio.tsx` y `src/paginas/EditorPresupuesto.tsx`: resumen junto a accesos en el inicio, desglose junto a la tabla en el editor. No aparece ningún elemento nuevo, solo se recolocan los que ya hay
- [X] T047 [US6] Comprobar en `src/estilos/global.css` que no hay desplazamiento horizontal en ninguna anchura entre móvil y monitor ancho, y que en móvil se conservan una columna, tarjetas apiladas y total anclado abajo (FR-012)
- [ ] T048 [US6] **Verificar la Parte G de [quickstart.md](./quickstart.md)** y anotar Sí/No en SC-007 y SC-016

**Checkpoint**: la aplicación aprovecha la pantalla que tiene delante.

---

## Phase 7: Ajustes a las historias ya entregadas (US1 y US4)

**Purpose**: las dos historias que la v1.1 ya entregó reciben un cambio cada una. Van al final porque son pequeñas y porque el anclaje de la barra hay que probarlo **con la maquetación de móvil ya terminada** (fase 6).

**Independent Test**: Partes A, B y C de [quickstart.md](./quickstart.md).

- [X] T049 [US1] Anclar `.cabecera` arriba en `src/estilos/global.css` (`position: sticky; top: 0`) con el fondo opaco, de forma que siga visible al desplazarse por una lista larga (FR-050)
- [X] T050 [US1] Ajustar en `src/estilos/global.css` el relleno lateral y el hueco de `.navegacion` con `--espacio-2` para que **los cinco accesos quepan en una sola línea en móvil** y la barra se quede en unos 56 px de alto, sin bajar de los 44 px de zona pulsable
- [ ] T051 [US1] Comprobar en un móvil real que la barra anclada arriba y el total anclado abajo dejan sitio suficiente para editar líneas. Si no lo dejan, **dejar de anclar la barra solo en móvil**, como prevé [contracts/navegacion.md](./contracts/navegacion.md); esconder accesos detrás de un menú no es una salida válida. El ajuste, si toca, va en la regla `.cabecera` de `src/estilos/global.css`
- [X] T052 [P] [US4] Cambiar `.etiqueta-vigente` en `src/estilos/global.css` de `--color-acento` a `--color-oliva`, para que el acento signifique solo «acción» (FR-036)
- [X] T053 [P] [US4] Dar aire vertical a `.etiqueta` en `src/estilos/global.css` con `--espacio-2` (hoy su relleno vertical es cero y parece aplastada) y mantener su contorno propio por situación (FR-015, FR-016)
- [ ] T054 [US1] **Verificar las Partes A y B de [quickstart.md](./quickstart.md)** y anotar Sí/No en SC-001, SC-002, SC-003, SC-014, SC-017 y SC-018
- [ ] T055 [US4] **Verificar la Parte C de [quickstart.md](./quickstart.md)** y anotar Sí/No en SC-008 y SC-015, incluida la impresión en blanco y negro

**Checkpoint**: las seis historias cumplen lo que dice la spec reescrita.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: cerrar las fugas del sistema, actualizar lo que documenta el producto y pasar la verificación completa.

- [X] T056 Auditar `src/estilos/global.css` y `src/pdf/generarPdf.ts` buscando **valores visuales sueltos** y sustituirlos por tokens o justificarlos por escrito (FR-051). Los conocidos hoy son `1.75rem` del título en escritorio, `200px` y `90px` de la vista previa del logo, `6rem` del área de texto, `24rem` del resumen en escritorio, `1.25rem` de las casillas, `7rem`/`9rem`/`8rem` de las columnas de la tabla y los tamaños en puntos del PDF
- [X] T057 Comprobar con un medidor de contraste los ocho valores de texto de la tabla de [contracts/sistema-visual.md](./contracts/sistema-visual.md) sobre su fondo real, confirmando 4,5:1 en texto normal, 3:1 en elementos de interfaz y que el texto inactivo no baja de 3:1 (FR-037)
- [X] T058 Ejecutar `npm test` y confirmar que **está en verde sin haber cambiado ninguna prueba**. Si falla algo, se ha tocado `src/dominio/` o `src/almacen/`, que debían quedar intactos (FR-024 … FR-028)
- [X] T059 Ejecutar `npm run build` y `npm run preview`, y confirmar que `dist/` incluye los dos archivos de tipografía y el archivo de licencia
- [X] T060 [P] Actualizar `CLAUDE.md`: las dos familias tipográficas y su trabajo, dónde viven los archivos de fuente y su licencia, la escala de espaciado de siete peldaños, los tres tonos de línea y la conversión 1 rem = 9 pt del PDF
- [X] T061 [P] Actualizar la fila 002 de `specs/README.md` a la v1.3, describiendo qué aporta la dirección «Mediterráneo» y en qué punto queda — **solo al terminar, no antes**, como manda ese propio archivo
- [ ] T062 Ejecutar **[quickstart.md](./quickstart.md) completo, de la Parte 0 a la Parte L**, anotando Sí/No en los 28 criterios de éxito. Ningún criterio se da por bueno «a la vista del código»

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sin dependencias, puede empezar ya
- **Phase 2 (Foundational)**: necesita la Phase 1 para T010 (las familias tienen que existir para declararlas). **Bloquea todas las historias**
- **Phases 3 a 7 (historias)**: todas dependen de la Phase 2 completa, incluida T008
- **Phase 8 (Polish)**: depende de todas las historias que se quieran entregar

### El orden duro dentro de la Phase 2

```text
T006 (renombrar)  →  T007 (peldaños nuevos)  →  T008 (VERIFICAR que no se ve nada)  →  T009 … T015 (valores)
```

**T008 es una puerta, no un trámite.** Si se salta y hay un error de renombrado, la diferencia queda escondida detrás del cambio de diseño y aparecerá en producción.

### User Story Dependencies

- **US2 (P1)**: solo depende de la Phase 2. Es el MVP
- **US3 (P2)**: solo depende de la Phase 2. **No depende de US2**: el PDF no lee la hoja de estilos, lee los tokens
- **US5 (P3)**: solo depende de la Phase 2, pero en la práctica conviene después de US2 porque toca las mismas reglas de `global.css`
- **US6 (P4)**: solo depende de la Phase 2; conviene después de US2 por el mismo motivo
- **US1 (ajuste)**: va después de US6 **a propósito**, porque el anclaje de la barra hay que probarlo con la maquetación de móvil ya terminada
- **US4 (ajuste)**: solo depende de T009 (necesita `--color-oliva`). Se puede hacer en cualquier momento después de la Phase 2

### Parallel Opportunities

- **Phase 1**: T001, T002 y T003 en paralelo (tres archivos distintos). T004 y T005 después, en archivos distintos entre sí
- **Phase 2**: nada en paralelo. Todo es el mismo archivo y el orden es el diseño
- **Phase 3 (US2)**: T025 y T026 pueden repartirse por archivo entre varias personas una vez T016…T024 están hechas
- **Phase 4 (US3)**: **toda la fase puede ir en paralelo a las fases 3, 5 y 6**, porque vive en `src/pdf/generarPdf.ts` y `src/estilos/tokens.ts`, que nadie más toca. Es la única paralelización grande de esta revisión
- **Phase 7**: T052 y T053 en paralelo con T049…T051 solo si se coordinan sobre `global.css`; en una sola persona, secuencial
- **Phase 8**: T060 y T061 en paralelo (archivos distintos)

---

## Parallel Example: el PDF mientras se hacen las pantallas

```bash
# Con la Phase 2 terminada, dos personas sin pisarse:
Persona A → Phase 3 (US2), Phase 5 (US5) y Phase 6 (US6)   # src/estilos/global.css, src/paginas/, src/componentes/
Persona B → Phase 4 (US3)                                   # src/pdf/generarPdf.ts, src/estilos/tokens.ts
```

Y dentro de la Phase 1:

```bash
Task: "Colocar figtree-variable-latin.woff2 en src/estilos/fuentes/"
Task: "Colocar bricolage-grotesque-700-latin.woff2 en src/estilos/fuentes/"
Task: "Añadir OFL.txt en src/estilos/fuentes/"
```

---

## Implementation Strategy

### MVP primero (solo US2)

1. Phase 1: Setup — los dos archivos de tipografía en el producto
2. Phase 2: Foundational — **crítico**, y con T008 como puerta
3. Phase 3: US2 — la identidad en las seis pantallas
4. **PARAR Y VALIDAR**: Partes D y E del quickstart
5. Ya es entregable: la aplicación tiene cara nueva y el PDF sigue funcionando con la antigua

### Entrega incremental

1. Setup + Foundational → sistema visual listo
2. US2 → validar → entregable (MVP)
3. US3 → validar → el documento del cliente también tiene la cara nueva
4. US5 → validar → la aplicación acusa cada toque
5. US6 → validar → aprovecha el monitor grande
6. Ajustes de US1 y US4 → validar
7. Polish → auditoría de fugas, documentación y quickstart completo

Cada paso añade valor sin romper el anterior. El punto natural para parar y publicar es después de US3: es el que cambia lo que ve el cliente.

---

## Notes

- `[P]` = archivos distintos, sin dependencias. En esta revisión hay poca paralelización dentro de una fase porque casi todo vive en `src/estilos/global.css`
- La etiqueta `[Story]` traza cada tarea a su historia de la spec
- **No hay tareas de prueba automática y es intencionado**: esta revisión no añade ninguna regla de dominio. T058 comprueba que las que existen siguen en verde **sin haber cambiado**
- `src/dominio/` y `src/almacen/` no se tocan en ninguna tarea. Si alguna los toca, se ha salido del alcance de la spec
- Conviene un commit por tarea o por grupo lógico, y **uno propio para T006 + T008**: es el único cambio del que hay que poder demostrar que no cambió nada
- Se puede parar en cualquier checkpoint y validar la historia por separado
