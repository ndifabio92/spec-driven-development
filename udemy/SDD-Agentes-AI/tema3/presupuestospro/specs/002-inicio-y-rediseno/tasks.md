---

description: "Task list for Pantalla de inicio e imagen profesional (PresupuestosPro v1.1)"
---

# Tasks: Pantalla de inicio e imagen profesional (PresupuestosPro v1.1)

**Input**: Design documents from `/specs/002-inicio-y-rediseno/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: se añaden pruebas automáticas **solo** para el módulo de dominio nuevo —la situación de un presupuesto—, porque tiene dos bordes que no se ven mirando la pantalla (Decisión 4 de [research.md](./research.md)). Se mantiene la regla de la 001: ni pruebas de interfaz, ni de PDF. Esa verificación la cubre el guion manual de [quickstart.md](./quickstart.md).

**Organization**: las tareas se agrupan por historia de usuario. Las historias 2, 3 y 4 son independientes entre sí: pueden hacerse en cualquier orden, o en paralelo.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de usuario a la que pertenece (US1…US4)
- Cada tarea indica la ruta exacta del archivo

## Path Conventions

Proyecto único en la raíz, el de la spec 001. **Nada de `src/almacen/` ni de `src/dominio/calculo.ts`, `numeracion.ts` o `formato.ts` se toca en toda esta lista**: si una tarea te lleva a abrir esos archivos, algo se ha torcido.

---

## Phase 1: Setup y red de seguridad

**Purpose**: dejar resuelto lo que bloquea el diseño y guardar el "antes" contra el que se va a comparar

- [ ] T001 Resolver en `specs/002-inicio-y-rediseno/spec.md` las dos contradicciones que detectó [checklists/ux.md](./checklists/ux.md) y que cambian lo que hay que construir: **CHK019** (SC-006 pide contar «como mucho cinco colores» y el contrato define ocho fichas: o se reformula el criterio para contar *tonos*, con el neutro como una escala, o se recorta la paleta) y **CHK020** (FR-017 afirma que Borrador son «justo los casos en los que hoy no se puede generar el PDF», lo cual es falso: el PDF también se bloquea con líneas inválidas y eso **no** es Borrador — hay que corregir o eliminar ese paréntesis)
- [X] T002 [P] Guardar la referencia del "antes" según el apartado inicial de [quickstart.md](./quickstart.md): descargar el PDF de un presupuesto con dos líneas y cliente de tipo empresa, archivarlo fuera del proyecto y anotar su número y su total. Sin esto no se pueden comprobar SC-004 ni SC-005
- [X] T003 [P] Escribir el inventario de acciones disponibles hoy en cada una de las cinco pantallas existentes (crear/editar/eliminar líneas, elegir cliente, alta al vuelo, activar retención y elegir 15 % o 7 %, guardar y eliminar clientes y servicios, subir y quitar logo, descargar PDF, avisos). Es la lista contra la que se comprueba FR-014 al final

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: los tokens y la regla de situación, de los que dependen todas las historias

**⚠️ CRITICAL**: ninguna historia puede empezar hasta terminar esta fase

- [X] T004 Definir el bloque único de tokens en `:root` de `src/estilos/global.css` con los nombres exactos de [contracts/sistema-visual.md](./contracts/sistema-visual.md): color (`--color-tinta`, `--color-tinta-suave`, `--color-linea`, `--color-fondo`, `--color-papel`, `--color-acento`, `--color-atencion`, `--color-error`), tipografía (`--tipo-familia` con métricas Helvetica/Arial, `--tipo-titulo`, `--tipo-seccion`, `--tipo-base`, `--tipo-apoyo`, `--tipo-total`), espaciado (`--espacio-1` … `--espacio-5`) e interacción (`--toque`: **44 px**, `--radio`, `--sombra`). `--tipo-base` **nunca por debajo de 16 px reales**. Aplicar aquí la resolución de T001 sobre el número de tonos
- [X] T005 Crear `src/estilos/tokens.ts`: lee del CSS los tokens que necesita el PDF con `getComputedStyle` sobre el elemento raíz, convierte el color a los tres números que entiende jsPDF y **devuelve un valor de respaldo si un token no se puede leer**, porque un PDF que no sale es peor fallo que un PDF con un gris distinto (Decisión 1 de [research.md](./research.md))
- [X] T006 [P] Escribir las pruebas en `src/dominio/situacion.test.ts` **antes de implementar**, cubriendo los bordes de [data-model.md](./data-model.md): presupuesto con líneas y cliente y validez futura → `Vigente`; sin líneas → `Borrador`; con líneas pero sin nombre de cliente → `Borrador`; validez anterior a hoy → `Caducado`; **validez igual a hoy → `Vigente`** (el día de la validez cuenta entero); **sin líneas y con la validez pasada → `Borrador`** (Borrador manda sobre Caducado, FR-017a); línea con cantidad 0 o precio negativo → **no** es Borrador por eso; sin fecha de validez → `Borrador`
- [X] T007 Implementar `src/dominio/situacion.ts` con el orden exacto de decisión de [data-model.md](./data-model.md): `1) sin líneas O sin nombre de cliente → Borrador · 2) fechaValidez anterior a hoy → Caducado · 3) en cualquier otro caso → Vigente`. La comparación de fechas se hace **sobre el texto `AAAA-MM-DD`**, sin construir fechas ni tocar zonas horarias. Exportar también el recuento por situación que consumirá Inicio

**Checkpoint**: los tokens existen y `npm test` sigue en verde, ahora también con la situación cubierta

---

## Phase 3: User Story 1 - Entrar y saber dónde estoy (Priority: P1) 🎯 MVP

**Goal**: que la aplicación reciba al freelancer con una pantalla de inicio que le orienta, y que desde cualquier sitio pueda ir a cualquier sección sin usar el botón "atrás".

**Independent Test**: abrir la aplicación y comprobar que lo primero que aparece es Inicio, con el recuento y los accesos; entrar a editar un presupuesto y saltar a Perfil, a Catálogo y de vuelta a Inicio sin usar "atrás". Equivale a los apartados A y B de [quickstart.md](./quickstart.md).

- [X] T008 [US1] Crear `src/paginas/Inicio.tsx`: accesos visibles a Presupuestos, Clientes, Catálogo y Perfil (FR-002); resumen con los presupuestos en **Borrador, Vigente y Caducado** usando el recuento de T007, más el número de clientes y de servicios (FR-003); botón de crear presupuesto nuevo que no pasa por la lista (FR-004); **los tres recuentos se muestran siempre, aunque valgan cero**, y con la aplicación recién estrenada aparece una indicación de por dónde empezar en lugar de una pantalla vacía
- [X] T009 [US1] Cambiar las rutas en `src/App.tsx` según [contracts/navegacion.md](./contracts/navegacion.md): `#/` pasa a ser **Inicio** y la lista de presupuestos se mueve a `#/presupuestos`; `#/presupuestos/nuevo`, `#/presupuestos/:id`, `#/clientes`, `#/catalogo` y `#/perfil` se quedan como están
- [X] T010 [US1] Completar la navegación común en `src/App.tsx`: añadir Inicio a la barra, marcar la sección actual **con algo más que el color** (FR-006), mantener los cinco accesos visibles sin menú desplegable ni desplazamiento lateral —si no caben, pasan a la línea siguiente— y respetar los 44 px de zona pulsable en cada uno
- [X] T011 [P] [US1] Corregir los enlaces internos que apuntaban a la lista cuando vivía en `#/`: el botón "Volver a la lista" de `src/paginas/EditorPresupuesto.tsx` y los enlaces de vuelta de `src/App.tsx` (pantalla de dirección no encontrada) deben llevar ahora a `#/presupuestos`

**Checkpoint**: la aplicación tiene entrada propia y se recorre entera sin el botón "atrás"

---

## Phase 4: User Story 2 - Que la herramienta se vea seria (Priority: P2)

**Goal**: que las seis pantallas compartan tipografía, paleta, espaciado y jerarquía, sin perder ni una de las acciones que ya había.

**Independent Test**: recorrer las seis pantallas en móvil y en escritorio comprobando que comparten apariencia, y repasar el inventario de T003 para confirmar que no falta nada. Equivale a los apartados D y H de [quickstart.md](./quickstart.md).

- [X] T012 [US2] Reescribir el cuerpo de `src/estilos/global.css` para que **todo salga de los tokens de T004**: sin un solo color, tamaño de letra o espaciado escrito a mano. Cubre la jerarquía de [contracts/sistema-visual.md](./contracts/sistema-visual.md) —total, título de pantalla, título de sección, dato, etiqueta, ayuda—, las superficies (tarjetas, campos, cabecera), y conserva el enfoque mobile-first: una sola columna en móvil, 44 px de zona pulsable y la tabla de líneas convertida en tarjetas apiladas
- [X] T013 [P] [US2] Ajustar los componentes base `src/componentes/CampoTexto.tsx`, `src/componentes/CampoNumero.tsx`, `src/componentes/Boton.tsx` y `src/componentes/Aviso.tsx` a la jerarquía nueva, manteniendo `inputMode="decimal"` en los numéricos y diferenciando aviso, atención y error **por algo más que el color**
- [X] T014 [P] [US2] Ajustar `src/componentes/TablaLineas.tsx`: tabla ligera en escritorio y tarjetas apiladas en móvil, **cada dato conservando su rótulo** al apilarse, e importes alineados a la derecha
- [X] T015 [P] [US2] Ajustar `src/componentes/ResumenTotales.tsx`: el **Total a pagar** destaca sobre el resto de importes y sigue visible mientras se editan las líneas, también en móvil (FR-011)
- [X] T016 [P] [US2] Aplicar la apariencia nueva a `src/paginas/Presupuestos.tsx`, conservando su contenido y su orden actual de la lista
- [X] T017 [P] [US2] Aplicar la apariencia nueva a `src/paginas/Clientes.tsx` y `src/paginas/Catalogo.tsx`, conservando las etiquetas visibles **«Empresa o autónomo»** y **«Particular»**
- [X] T018 [P] [US2] Aplicar la apariencia nueva a `src/paginas/Perfil.tsx`, incluida la vista previa del logo y el mensaje de rechazo por encima de 1 MB
- [X] T019 [US2] Aplicar la apariencia nueva a `src/paginas/EditorPresupuesto.tsx`: es la pantalla con más controles (cliente, líneas, retención, PDF) y la que más fácil rompe FR-014; ninguna acción puede desaparecer, esconderse ni ganar pasos
- [X] T020 [US2] Repasar pantalla por pantalla el inventario de T003 y confirmar que las seis siguen ofreciendo exactamente lo mismo que antes (FR-014), y que todos los textos siguen en español de España explicando qué hacer (FR-013)

**Checkpoint**: la aplicación se ve como un producto acabado y no ha perdido nada por el camino

---

## Phase 5: User Story 3 - Que el PDF transmita lo mismo (Priority: P3)

**Goal**: que el documento que recibe el cliente comparta la imagen de la aplicación diciendo exactamente lo mismo, al céntimo.

**Independent Test**: descargar el PDF del presupuesto de referencia y abrirlo junto al que se guardó en T002. Equivale a los apartados E, F y G de [quickstart.md](./quickstart.md).

- [X] T021 [US3] Rediseñar la cabecera en `src/pdf/generarPdf.ts` tomando los colores de `src/estilos/tokens.ts`: banda superior con el color de acento, bloque de emisor y bloque de identificación (título, número, fecha de emisión y `Válido hasta el dd/mm/aaaa`) con la jerarquía del sistema visual, y **recomposición limpia cuando no hay logo**, sin dejar hueco (FR-023)
- [X] T022 [US3] Rediseñar en `src/pdf/generarPdf.ts` el destinatario, la tabla de líneas y el desglose: tabla más ligera con cabecera clara e importes a la derecha, y bloque de totales destacado con el **Total a pagar** por encima del resto. **Sin tocar ni un texto, ni un bloque, ni su orden, ni una cifra**: el contenido lo sigue fijando el [contrato de la 001](../001-presupuestos-freelancer/contracts/pdf-documento.md) y los importes se siguen pidiendo a `src/dominio/calculo.ts`
- [X] T023 [US3] Comprobar con un presupuesto de unas 40 líneas que la tabla continúa en las páginas siguientes **repitiendo su cabecera** y que el bloque de totales **no se parte** entre páginas (FR-022). Son las dos cosas que una maquetación nueva rompe con más facilidad
- [X] T024 [US3] Comparar el PDF nuevo con el archivado en T002: mismo número, mismas fechas, mismas líneas y mismo desglose al céntimo (SC-005); comprobar además que el texto se sigue seleccionando y que **no aparece por ninguna parte la situación del presupuesto**, que es información para el freelancer y no para su cliente

**Checkpoint**: el entregable que ve el cliente tiene la imagen nueva y el contenido intacto

---

## Phase 6: User Story 4 - Ver en qué punto está cada presupuesto (Priority: P4)

**Goal**: distinguir de un vistazo qué presupuestos siguen en pie, cuáles caducaron y cuáles ni siquiera están terminados.

**Independent Test**: tener a la vez un presupuesto normal, uno sin líneas y uno con la validez pasada, y comprobar que cada uno muestra su etiqueta sin haberla marcado nadie, y que el recuento de Inicio cuadra con la lista. Equivale al apartado C de [quickstart.md](./quickstart.md).

- [X] T025 [US4] Crear `src/componentes/EtiquetaSituacion.tsx` según [contracts/sistema-visual.md](./contracts/sistema-visual.md): textos **«Borrador»**, **«Vigente»** y **«Caducado»**; Borrador en tono neutro con contorno discontinuo, Vigente en acento y Caducado en atención, ambos con contorno continuo y relleno suave. La palabra va **siempre escrita**, para que se distinga en blanco y negro (FR-016). Es informativa: **no se puede pulsar ni cambiar** (FR-017b)
- [X] T026 [P] [US4] Mostrar la etiqueta en cada fila de `src/paginas/Presupuestos.tsx`, usando la situación que calcula `src/dominio/situacion.ts`
- [X] T027 [P] [US4] Mostrar la etiqueta al abrir un presupuesto en `src/paginas/EditorPresupuesto.tsx`, porque FR-015 la pide «tanto en la lista como al abrirlo», sin añadir ningún control para modificarla
- [X] T028 [US4] Comprobar que los tres recuentos de Inicio suman el total de presupuestos guardados y coinciden exactamente con lo que muestra la lista (FR-018)

**Checkpoint**: las cuatro historias funcionan y el resumen de Inicio tiene sentido

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: cerrar los huecos que sacó la checklist de UX, publicar y validar contra la spec

- [ ] T029 [P] Revisar la accesibilidad en `src/estilos/global.css`: foco visible en todo lo que se pueda enfocar con el teclado, y contraste suficiente entre texto y fondo también en los tonos de atención y error. Responde a los huecos CHK026, CHK027 y CHK028 de [checklists/ux.md](./checklists/ux.md)
  - *No ejecutada a propósito*: ningún FR pide foco visible ni contraste medido, así que construirlo violaría el Principio III (issue C1 de `/speckit-analyze`). El foco visible que **ya existía** desde la spec 001 se ha conservado, no se ha ampliado. Se desbloquea decidiendo C1: añadir FR-014a/FR-014b a la spec, o declarar la accesibilidad fuera de alcance y borrar esta tarea
- [X] T030 [P] Comprobar en escala de grises que las tres etiquetas de situación y la marca de sección activa se siguen distinguiendo (SC-008, CHK029)
- [X] T031 [P] Revisar la experiencia móvil completa: todo legible sin zoom, zonas pulsables de 44 px —incluidos los accesos de la barra—, teclado numérico en cantidades e importes, y total siempre visible al editar líneas (FR-012, SC-007)
- [X] T032 Generar el build de producción (`npm run build`) y comprobarlo con `npm run preview`: la navegación con `#` sigue funcionando sin reglas de servidor y la entrada es Inicio
- [ ] T033 Ejecutar el guion de verificación manual completo (apartados A a K) de [quickstart.md](./quickstart.md), incluida la prueba desde un móvil real y el cronómetro de los 5 minutos (SC-009)
  - *Pendiente de una persona*: los apartados D, E, F y G se comprobaron aparte (comparación del PDF antes/después, paginación y cuadre de importes). A, B, C, H, I, J y K requieren usar la aplicación en un navegador y un móvil reales
- [X] T034 [P] Verificar la trazabilidad final contra [spec.md](./spec.md): cada FR-001…FR-026 tiene su sitio en el código, **no se ha instalado ninguna dependencia nueva**, y ni `src/almacen/` ni los módulos de cálculo, numeración y formato han cambiado (FR-024, FR-025, FR-026)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: empieza de inmediato. T001 **bloquea T004**, porque decide cuántos tonos lleva la paleta
- **Foundational (Fase 2)**: depende de la Fase 1 — **bloquea todas las historias**
- **US1 (Fase 3)**: depende de la Fase 2 (necesita el recuento por situación de T007). Es el MVP
- **US2, US3, US4 (Fases 4-6)**: dependen de la Fase 2 y son **independientes entre sí**
- **Polish (Fase 7)**: depende de las historias que se quieran publicar

### User Story Dependencies

- **US1 (P1)**: independiente. Es lo único que aporta algo que hoy no existe
- **US2 (P2)**: independiente. Si se entrega sola, la aplicación se ve mejor aunque Inicio no exista
- **US3 (P3)**: independiente. Solo necesita los tokens de la Fase 2, no la Historia 2
- **US4 (P4)**: independiente. Las etiquetas funcionan aunque no haya rediseño

### Parallel Opportunities

- Fase 1: T002 y T003 en paralelo; T001 va aparte porque bloquea
- Fase 2: T006 en paralelo con T004 y T005; T007 va detrás de T006
- Fase 3: T011 en paralelo con T008; T009 → T010 van en cadena porque tocan el mismo archivo
- Fase 4: T013, T014, T015, T016, T017 y T018 en paralelo tras T012; T019 aparte por su tamaño
- Fase 5: en cadena, todo vive en el mismo archivo
- Fase 6: T026 y T027 en paralelo tras T025
- Fases 4, 5 y 6 completas en paralelo si hay varias personas, una por historia
- Fase 7: T029, T030, T031 y T034 en paralelo

---

## Parallel Example: User Story 2

```bash
# Primero el esqueleto de estilos (T012). Después, todo lo demás a la vez:
Task: "Componentes base en src/componentes/CampoTexto.tsx, CampoNumero.tsx, Boton.tsx, Aviso.tsx"
Task: "Tabla de líneas en src/componentes/TablaLineas.tsx"
Task: "Resumen de totales en src/componentes/ResumenTotales.tsx"
Task: "Lista en src/paginas/Presupuestos.tsx"
Task: "Fichas en src/paginas/Clientes.tsx y src/paginas/Catalogo.tsx"
Task: "Perfil en src/paginas/Perfil.tsx"
```

---

## Implementation Strategy

### MVP primero (US1)

A diferencia de la spec 001, aquí el MVP **es una sola historia**: Inicio y la navegación común son lo único que añade algo que hoy no existe. Todo lo demás mejora lo que ya funciona.

1. Fase 1: resolver las contradicciones y guardar el "antes"
2. Fase 2: tokens y situación (bloquea todo)
3. Fase 3: US1 → **parar y validar** los apartados A y B del quickstart
4. Publicar: la aplicación ya tiene entrada y orientación

### Entrega incremental

1. Setup + Foundational → base lista
2. + US1 → la aplicación orienta (validar y publicar)
3. + US2 → la aplicación se ve seria
4. + US3 → el PDF también
5. + US4 → cada presupuesto dice en qué punto está

Cada paso aporta valor por sí mismo y no rompe el anterior.

---

## Notes

- Las tareas marcadas [P] tocan archivos distintos y no dependen entre sí
- **La regla que manda sobre toda la lista**: si una tarea te lleva a modificar `src/almacen/`, `src/dominio/calculo.ts`, `numeracion.ts` o `formato.ts`, o a añadir una dependencia, has salido del alcance de esta spec
- Las únicas pruebas automáticas nuevas son las de `src/dominio/situacion.ts`: el resto se comprueba mirando la pantalla y el PDF, como exige el Principio IV de la constitución
- Los 41 ítems de [checklists/ux.md](./checklists/ux.md) son tuyos: T001 solo cierra los dos que cambian lo que hay que construir; los demás, o corrigen la spec o se declaran fuera de alcance por escrito
- Regla de la constitución que aplica a todo: si aparece una idea nueva durante la implementación (buscar en la lista, duplicar presupuestos, modo oscuro), se propone como spec, no se construye
