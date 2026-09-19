# Implementation Plan: Pantalla de inicio e imagen profesional (PresupuestosPro v1.1)

**Branch**: `002-inicio-y-rediseno` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-inicio-y-rediseno/spec.md`

## Summary

Esta versión **no toca el motor del producto**: no cambia un cálculo, ni un número de presupuesto, ni un campo guardado, ni lo que dice el PDF. Cambia por dónde se entra, cómo se recorre y cómo se ve.

Tres piezas nuevas, pequeñas y separadas:

1. Una **pantalla de inicio** que pasa a ser la entrada de la aplicación, con el recuento de lo que el freelancer tiene y accesos a las cuatro secciones; la lista de presupuestos queda como una sección más, intacta.
2. Un **sistema visual** —tipografía, paleta corta, escala de espaciado— definido en un único sitio, del que beben todas las pantallas **y también el PDF**.
3. Una **etiqueta de situación** (Borrador, Vigente, Caducado) que se deduce al vuelo de lo que ya hay guardado, sin añadir ni un campo.

La decisión técnica que sostiene el encargo es una sola: **los tokens visuales viven en el CSS y el generador del PDF los lee de ahí en el momento de construir el documento**. Así "definida en un único lugar" (FR-008) es literal y no una promesa; cambiar el color de acento en una línea lo cambia en las seis pantallas y en el documento que recibe el cliente.

El razonamiento de cada decisión, en lenguaje de negocio, está en [research.md](./research.md).

## Technical Context

El stack, las convenciones y la estructura son **los de la spec 001** ([plan.md](../001-presupuestos-freelancer/plan.md)) y no se tocan. Solo se registra aquí lo que esta funcionalidad añade o matiza:

**Language/Version**: sin cambios (TypeScript sobre el mismo proyecto)

**Primary Dependencies**: **ninguna nueva**. La lista cerrada de la 001 sigue cerrada: sin framework de CSS, sin librería de componentes, sin librería de iconos, sin fuentes externas. *(Nota de estado real: el PDF se construye con jsPDF 4 en lugar de la 3 que nombraba la 001; se subió durante la implementación por avisos críticos de seguridad. Es la misma librería en el mismo papel, y esta funcionalidad no lo cambia.)*

**Storage**: sin cambios. Ni una clave nueva, ni un campo nuevo, ni migración. El documento JSON de [contracts/almacen-schema.md](../001-presupuestos-freelancer/contracts/almacen-schema.md) se lee y se escribe exactamente igual

**Testing**: Vitest, y se mantiene la regla de la 001 —solo lógica pura de dominio—. Esta funcionalidad añade un módulo de dominio nuevo (la situación de un presupuesto) y por tanto sus pruebas; no añade pruebas de interfaz ni de PDF

**Target Platform**: sin cambios. Mobile-first, navegadores modernos de móvil y escritorio

**Project Type**: sin cambios. Aplicación de una sola página publicada como sitio estático

**Performance Goals**: el resumen del inicio se calcula en el momento sobre decenas de presupuestos: instantáneo. El rediseño no puede añadir descargas (ni fuentes web, ni imágenes, ni iconos) que retrasen la primera pantalla

**Constraints**: el contenido del PDF no puede variar ni un carácter (FR-020, FR-021); los importes y el número tienen que salir idénticos antes y después (SC-004, SC-005); todo sigue en español de España

**Scale/Scope**: 6 pantallas (5 existentes + Inicio), 1 módulo de dominio nuevo, 1 componente nuevo, 1 hoja de estilos reescrita y 1 plantilla de PDF rediseñada

## Constitution Check

*GATE: verificado antes de la Fase 0 y de nuevo tras el diseño de la Fase 1.*

| Principio | Cómo lo cumple este plan | Estado |
|---|---|---|
| **I. Simplicidad ante todo** | Cero dependencias nuevas. El sistema visual son variables CSS en el archivo que ya existe, no una capa de theming. El PDF lee esas variables con una función de diez líneas, en vez de duplicar la paleta o montar un paso de build | ✅ |
| **II. Idioma y mercado** | Todo el texto nuevo (Inicio, resumen, etiquetas de situación) en español de España; los importes siguen saliendo del formateador que ya existe | ✅ |
| **III. Cero alcance fantasma** | Solo las tres situaciones deducibles que se acordaron: no se diseñan ni se dejan preparados colores para Enviado, Aceptado o Rechazado. Sin modo oscuro, sin temas, sin iconografía decorativa. Cada módulo nuevo se traza a un FR en [data-model.md](./data-model.md) | ✅ |
| **IV. Verificable por una persona no técnica** | [quickstart.md](./quickstart.md) es una comparación de "antes y después" que se hace mirando la pantalla y el PDF, incluida la prueba en blanco y negro y la del móvil | ✅ |
| **V. Datos del usuario con respeto** | No se pide ni un dato más: la situación se deduce de lo que ya hay. Sin telemetría, sin fuentes externas (que además filtrarían la IP del freelancer a un tercero) | ✅ |

**Resultado**: pasa sin violaciones, antes y después del diseño. *Complexity Tracking* queda vacía intencionadamente.

## Project Structure

### Documentation (this feature)

```text
specs/002-inicio-y-rediseno/
├── plan.md                      # Este archivo
├── spec.md                      # Especificación funcional
├── research.md                  # Decisiones de presentación, en lenguaje de negocio
├── data-model.md                # Situación y resumen: qué se deduce y qué NO se guarda
├── quickstart.md                # Guion de verificación "antes y después"
├── contracts/
│   ├── sistema-visual.md        # Los tokens: único lugar donde viven color, tipografía y espaciado
│   ├── navegacion.md            # Entrada, secciones y navegación común
│   └── pdf-presentacion.md      # Capa visual del PDF (el contenido lo sigue fijando la 001)
├── checklists/
│   └── requirements.md          # Checklist de calidad de la spec
└── tasks.md                     # Lo genera /speckit-tasks (no este comando)
```

### Source Code (repository root)

Se respeta la estructura de la 001. Marcado solo lo que esta funcionalidad toca:

```text
src/
├── App.tsx                        # MODIFICADO: ruta de Inicio + navegación común con sección activa
├── dominio/
│   ├── situacion.ts               # NUEVO: deduce Borrador | Vigente | Caducado
│   ├── situacion.test.ts          # NUEVO: límites de fecha y precedencia
│   └── (calculo, numeracion, formato, tipos)   # INTACTOS
├── almacen/                       # INTACTO: ni un cambio en el formato ni en el acceso
├── paginas/
│   ├── Inicio.tsx                 # NUEVO: resumen de actividad y accesos
│   ├── Presupuestos.tsx           # MODIFICADO: etiqueta de situación en cada fila
│   └── (EditorPresupuesto, Clientes, Catalogo, Perfil)  # MODIFICADOS solo en apariencia
├── componentes/
│   ├── EtiquetaSituacion.tsx      # NUEVO: la marca visual de la situación
│   └── (CampoTexto, CampoNumero, Boton, Aviso, TablaLineas, ResumenTotales)  # apariencia
├── estilos/
│   ├── global.css                 # REESCRITO: aquí viven los tokens. Único lugar
│   └── tokens.ts                  # NUEVO: lee del CSS los tokens que necesita el PDF
└── pdf/
    └── generarPdf.ts              # MODIFICADO: solo maquetación; mismo contenido y mismos importes
```

**Structure Decision**: se mantiene el proyecto único de la 001 y su separación clave —`dominio/` no sabe nada de React ni del navegador—. La situación de un presupuesto entra en `dominio/` porque es una regla derivada de los datos, con límites que conviene blindar (el día de la validez cuenta como vigente; Borrador manda sobre Caducado), no una decisión de pintado. `estilos/tokens.ts` es la única pieza nueva que cruza fronteras: vive junto al CSS porque es quien lo lee, y es lo que permite que el PDF y la pantalla no puedan desincronizarse.

**Rutas** (siguen en modo hash; la única novedad es que la entrada ya no es la lista):

| Ruta | Pantalla | Cambio |
|---|---|---|
| `#/` | **Inicio** | Nueva entrada de la aplicación |
| `#/presupuestos` | Lista de presupuestos | Antes vivía en `#/` |
| `#/presupuestos/nuevo` | Crear presupuesto | Sin cambios |
| `#/presupuestos/:id` | Ver y editar un presupuesto | Sin cambios |
| `#/clientes` · `#/catalogo` · `#/perfil` | Secciones existentes | Sin cambios |

## Complexity Tracking

> Sin violaciones de la constitución que justificar. Tabla intencionadamente vacía.
