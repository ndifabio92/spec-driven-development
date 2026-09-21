# Implementation Plan: Exportar todos mis presupuestos en un .zip (PresupuestosPro v1.2)

**Branch**: `003-exportar-copia-zip` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-exportar-copia-zip/spec.md`

## Summary

Esta versión da al freelancer la primera salida de datos del producto: un botón que empaqueta **todo** lo que tiene en un único `.zip` y se lo descarga.

La decisión que sostiene la funcionalidad es que **no se escribe ni un PDF nuevo**: el zip se llena llamando a `construirDocumento()`, la misma función que ya produce el documento cuando el freelancer lo descarga uno a uno. Esa reutilización no es un ahorro de trabajo, es el mecanismo que garantiza FR-007: si el PDF del zip pudiera diferir del individual, sería porque existen dos caminos, y aquí solo hay uno.

Las otras tres decisiones del plan resuelven los tres deberes que dejó la clarificación:

1. **La dependencia**: `fflate`, elegida por ser la única candidata sin dependencias transitivas **y** con compresión real. Justificada en la tabla de *Complexity Tracking*.
2. **El límite de volumen**: no lo marca el número de presupuestos, sino **el tamaño del logo multiplicado por ese número**, porque el logo se incrusta entero en cada PDF. El plan empaqueta en streaming para que el techo lo ponga el archivo final y no la suma de todos los PDF a la vez, y deja el procedimiento de medida escrito en [quickstart.md](./quickstart.md).
3. **La marca de identidad**: un sobre alrededor del documento de datos —aplicación, versión del formato de copia y momento de la exportación—, con los datos dentro **sin tocar**, para que la futura restauración solo tenga que validar el sobre y devolver el contenido a su sitio.

El razonamiento completo, en lenguaje de negocio, está en [research.md](./research.md).

## Technical Context

El stack, la estructura y las convenciones son los de la [spec 001](../001-presupuestos-freelancer/plan.md). Solo se registra lo que esta funcionalidad añade o matiza:

**Language/Version**: sin cambios (TypeScript 5.9 sobre el mismo proyecto)

**Primary Dependencies**: **una nueva**: `fflate` (MIT, sin dependencias transitivas, ~8 kB comprimido en el paquete publicado) para construir el `.zip`. Es la primera dependencia añadida desde la 001 y la spec la autoriza expresamente. jsPDF y jspdf-autotable se reutilizan tal cual, sin cambiar su versión ni su uso.

**Storage**: **sin cambios y sin escrituras**. La exportación abre el documento JSON de [almacen-schema.md](../001-presupuestos-freelancer/contracts/almacen-schema.md) en modo lectura y no escribe nunca (FR-021). Ni una clave nueva, ni un campo nuevo, ni migración

**Testing**: Vitest, y se mantiene la regla de la 001 —solo lógica pura de dominio—. Esta funcionalidad añade un módulo de dominio (los nombres de los archivos de la copia) y sus pruebas. El empaquetado, la descarga y el progreso se verifican con el guion de [quickstart.md](./quickstart.md), como exige el Principio IV

**Target Platform**: sin cambios. Navegadores modernos de móvil y escritorio. La descarga usa un enlace con `Blob`, disponible en todos ellos

**Project Type**: sin cambios. Aplicación de una sola página publicada como sitio estático, sin servidor

**Performance Goals**: la señal de progreso aparece antes de **2 s** desde la pulsación (SC-008) y se refresca al terminar cada PDF. Con 200 presupuestos la exportación termina en una sola pasada (SC-009). El hilo de la interfaz cede el control entre presupuesto y presupuesto para que la barra se pinte de verdad y la pantalla no se congele

**Constraints**: el contenido de los PDF no puede variar (FR-007); nada se escribe en el almacenamiento (FR-021); nada sale del dispositivo (FR-022); todo en español de España. El pico de memoria es el factor limitante y está dominado por el logo incrustado en cada documento

**Scale/Scope**: 1 módulo de dominio nuevo con sus pruebas, 1 módulo de exportación nuevo, 1 componente nuevo reutilizado en 2 pantallas (Inicio y Presupuestos). Ninguna pantalla nueva. Volumen de referencia: hasta 200 presupuestos completos

## Constitution Check

*GATE: verificado antes de la Fase 0 y de nuevo tras el diseño de la Fase 1.*

| Principio | Cómo lo cumple este plan | Estado |
|---|---|---|
| **I. Simplicidad ante todo** | Se añade **una** dependencia, autorizada por la spec y justificada abajo en *Complexity Tracking*. Fuera de eso, el plan no introduce ninguna capa: no hay servicio de exportación, ni cola, ni abstracción sobre el sistema de archivos. La lógica nueva son dos módulos pequeños y un componente. El PDF se reutiliza en lugar de duplicarse | ⚠️ con excepción documentada |
| **II. Idioma y mercado** | Botón, progreso y los cuatro avisos, en español de España. Los nombres de archivo conservan los acentos del cliente y la fecha del zip va en el orden `AAAA-MM-DD` que ya usa el almacén | ✅ |
| **III. Cero alcance fantasma** | No se construye nada de la restauración: solo la marca de identidad que la spec exige (FR-014a). Sin contraseña, sin cifrado, sin selección de qué exportar, sin copias programadas, sin trocear el archivo. Cada módulo nuevo se traza a un FR en [data-model.md](./data-model.md) | ✅ |
| **IV. Verificable por una persona no técnica** | [quickstart.md](./quickstart.md) se ejecuta descargando el archivo, descomprimiéndolo con doble clic y comparando dos PDF a ojo. La única comprobación técnica —la medida del límite de volumen— es un deber del equipo, no un criterio de aceptación del freelancer | ✅ |
| **V. Datos del usuario con respeto** | El archivo no sale del dispositivo (FR-022) y no se pide ni un dato más. Esta funcionalidad es la primera que saca datos personales del navegador, y por eso incorpora el aviso explícito de FR-018a. Sin telemetría y sin peticiones de red: `fflate` se empaqueta con la aplicación, no se carga de un CDN | ✅ |

**Resultado**: pasa con **una** violación, expresamente autorizada por la spec y justificada en *Complexity Tracking*. Verificado de nuevo tras el diseño de la Fase 1: el diseño no añade ninguna violación más.

## Project Structure

### Documentation (this feature)

```text
specs/003-exportar-copia-zip/
├── plan.md                      # Este archivo
├── spec.md                      # Especificación funcional
├── research.md                  # Decisiones técnicas en lenguaje de negocio
├── data-model.md                # Qué se lee, qué se deriva y qué NO se guarda
├── quickstart.md                # Guion de verificación + medida del límite de volumen
├── contracts/
│   ├── estructura-copia.md      # Qué hay dentro del zip y cómo se llama cada cosa
│   └── archivo-datos.md         # El sobre de la copia: marca de identidad y contenido
├── checklists/
│   └── requirements.md          # Checklist de calidad de la spec
└── tasks.md                     # Lo genera /speckit-tasks (no este comando)
```

### Source Code (repository root)

Se respeta la estructura de la 001. Marcado solo lo que esta funcionalidad toca:

```text
src/
├── dominio/
│   ├── nombresCopia.ts            # NUEVO: nombre del zip, nombre de cada PDF, saneado y desduplicación
│   ├── nombresCopia.test.ts       # NUEVO: caracteres conflictivos, recortes y colisiones
│   ├── sobreCopia.ts              # NUEVO: construye el sobre con la marca de identidad
│   ├── sobreCopia.test.ts         # NUEVO: la copia envuelve los datos sin alterarlos
│   └── (calculo, numeracion, formato, situacion, tipos)   # INTACTOS
├── exportacion/
│   └── exportarCopia.ts           # NUEVO: recorre, construye PDF, empaqueta, informa y descarga
├── pdf/
│   └── generarPdf.ts              # INTACTO: se reutiliza construirDocumento() tal cual
├── almacen/                       # INTACTO: solo se lee
├── componentes/
│   └── BotonExportar.tsx          # NUEVO: botón, progreso y avisos. El mismo en las dos pantallas
├── paginas/
│   ├── Inicio.tsx                 # MODIFICADO: el botón junto al resumen de actividad
│   └── Presupuestos.tsx           # MODIFICADO: el botón en la cabecera de la lista
└── estilos/
    └── global.css                 # MODIFICADO: estilos del progreso, con los tokens existentes
```

**Structure Decision**: se mantiene el proyecto único y la separación clave de la 001 —`dominio/` no sabe nada de React ni del navegador—.

Lo nuevo aquí es la carpeta `exportacion/`, y existe por una razón concreta: empaquetar una copia cruza tres fronteras que hasta ahora no se tocaban entre sí (el almacén, el generador de PDF y la descarga del navegador). Meter esa orquestación dentro de una pantalla la ataría a la lista de presupuestos, y el botón vive en dos sitios (FR-001). Meterla en `dominio/` rompería su regla: `exportarCopia.ts` depende del navegador de arriba abajo.

Lo que **sí** baja a `dominio/` son las dos reglas deterministas, porque son las que pueden estropear una copia en silencio:

- **`nombresCopia.ts`**: un nombre mal saneado produce un zip que no se descomprime, o dos archivos que se pisan y un presupuesto que desaparece de la copia sin que nadie se entere. Es exactamente el tipo de riesgo que en este proyecto lleva pruebas automáticas.
- **`sobreCopia.ts`**: es el contrato con una funcionalidad que todavía no existe. Su prueba fija lo único que de verdad importa: que el contenido de `datos` sale **idéntico** a lo que había guardado.

## Complexity Tracking

> Una única violación, autorizada por la spec en su sección *Clarifications* y en *Assumptions*.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| **Añadir `fflate`**, rompiendo la lista cerrada de dependencias del Principio I | La spec exige **un único archivo `.zip`** que el freelancer abra con doble clic (FR-004, FR-005). El navegador no sabe construir un `.zip`: ofrece compresión en bruto (`CompressionStream`), pero no el formato de archivo, que es lo que hace falta | **`jszip`**: arrastra 4 dependencias transitivas; añadir 5 paquetes donde bastaba 1 es lo contrario del Principio I. **`client-zip`**: es más pequeño (6,5 kB) y también sin dependencias, pero por diseño **no comprime**: una copia de seguridad que no reduce nada no es lo que el freelancer espera de un zip. **Escribirlo a mano** sobre `CompressionStream`: ~150 líneas de cabeceras, CRC32 y directorio central, con banderas de codificación que hay que acertar para que los acentos se descompriman bien en Windows. Es más código propio, más frágil y más difícil de verificar que la dependencia que evita. Detalle en la [Decisión 1 de research.md](./research.md) |

## Paso final de mantenimiento

> **Último paso de la fase final**, una vez la funcionalidad esté implementada y verificada.

**Actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, una línea por decisión, con referencia a la spec (p. ej. «[003] …»). No incluyas entradas por incluir: asegúrate siempre de que es información transversal y relevante para el proyecto que puedan aprovechar futuras features.**

### El filtro

Una línea entra en `CLAUDE.md` solo si **cambia lo que haría alguien que trabaje en la siguiente funcionalidad**, sea cual sea. Si solo describe cómo funciona la exportación, su sitio es la spec o el contrato, no la memoria técnica del proyecto.

Tres preguntas antes de añadir cada línea:

1. ¿Sigue siendo cierta cuando esta funcionalidad ya no se toque?
2. ¿Habría evitado un error a alguien que nunca lea esta spec?
3. ¿Contradice o matiza algo que `CLAUDE.md` ya dice?

Si las tres respuestas son «no», la línea sobra. `CLAUDE.md` tiene que seguir cabiendo en una pantalla: **añadir una línea puede significar reescribir otra, no solo acumular**.

### Candidatas de esta feature

Revisarlas contra el filtro al terminar, no darlas por buenas de antemano:

- **`fflate` entra en el stack**, y con ella la primera excepción a la lista cerrada de dependencias. La regla no desaparece: se registra que hubo una excepción, por qué, y que la siguiente también tendrá que justificarse.
- **Un solo camino hacia el PDF**: todo lo que produzca un documento pasa por `construirDocumento()`. Nunca se escribe un segundo generador, ni siquiera «optimizado para lotes».
- **Los nombres de archivo que salen del producto se calculan en `dominio/` y llevan pruebas**, por el mismo motivo que los importes: un nombre mal formado rompe en silencio.
- **Todo lo que el producto exporte va dentro de un sobre** con aplicación, versión de formato y momento de generación, y con los datos **sin tocar**. Es lo que hace posible volver a leerlos años después.
- **El logo se incrusta entero en cada PDF**: el coste de cualquier operación en lote escala con el número de documentos **por** el tamaño del logo, no con el número de documentos. Es contraintuitivo y es lo primero que hay que mirar ante un problema de memoria o de lentitud.

### Lo que NO entra

El patrón del nombre del zip, el recorte a 60 caracteres, las dos pantallas donde vive el botón o la lista de caracteres que se sustituyen. Todo eso ya vive en [contracts/estructura-copia.md](./contracts/estructura-copia.md), que es donde hay que ir a buscarlo, y meterlo en `CLAUDE.md` solo lo haría envejecer en dos sitios a la vez.
