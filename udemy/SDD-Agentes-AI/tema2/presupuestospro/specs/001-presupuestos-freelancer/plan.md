# Implementation Plan: Presupuestos para Freelancers (PresupuestosPro v0)

**Branch**: `001-presupuestos-freelancer` | **Date**: 2026-09-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-presupuestos-freelancer/spec.md`

## Summary

PresupuestosPro v1 será **una página web que el freelancer abre desde el móvil o el portátil y en la que sus datos nunca salen de su propio navegador**. No hay servidor, ni base de datos, ni contraseñas: la aplicación se publica como un conjunto de archivos estáticos en una dirección web, y todo —el catálogo, los clientes, los presupuestos y la generación del PDF— ocurre dentro del dispositivo del freelancer.

Esa única decisión resuelve a la vez las tres exigencias del encargo: se puede **publicar online enseguida** (subir una carpeta), **funciona bien en móvil** (es una web pensada primero para pantalla pequeña) y **no añade infraestructura que la spec no pide** (sin cuentas, sin nube, sin costes recurrentes).

El corazón del producto —calcular base imponible, IVA, retención de IRPF y total sin equivocarse— se aísla en un módulo propio con pruebas automáticas, porque es el riesgo que de verdad importa: un presupuesto con un número mal puesto se descubre cuando el cliente ya lo tiene.

Las decisiones y sus alternativas descartadas están explicadas en lenguaje de negocio en [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.9 sobre Node.js 20+ (solo para desarrollo; lo publicado es HTML/CSS/JS estático)

**Primary Dependencies**: React 19, react-router-dom 7 (modo hash), jsPDF 3 + jspdf-autotable 5. Lista cerrada: cualquier añadido debe justificarse contra el Principio I.

**Storage**: `localStorage` del navegador, un único documento JSON versionado (ver [contracts/almacen-schema.md](./contracts/almacen-schema.md)). Sin servidor ni base de datos.

**Testing**: Vitest, limitado a la lógica pura de dominio (cálculo, redondeo, numeración, formato). La verificación funcional la hace una persona con el guion de [quickstart.md](./quickstart.md), como exige el Principio IV.

**Target Platform**: navegadores modernos de móvil y escritorio (Chrome, Safari, Firefox, Edge). Diseño mobile-first.

**Project Type**: aplicación web de una sola página, publicada como sitio estático, sin backend.

**Performance Goals**: los totales se actualizan de forma instantánea al editar cualquier línea; el PDF se genera en el dispositivo en menos de 2 segundos para un presupuesto típico (hasta 20 líneas).

**Constraints**: sin cuentas de usuario, sin nube, sin envío de emails, solo euros y español de España. Los datos deben sobrevivir al cierre del navegador. El logo se limita a 1 MB por la capacidad del almacenamiento local.

**Scale/Scope**: un único usuario por dispositivo; 6 pantallas (inicio/lista, presupuesto, perfil, catálogo, clientes, ficha de cliente/servicio); volumen esperado de decenas de presupuestos al año.

## Constitution Check

*GATE: verificado antes de la Fase 0 y de nuevo tras el diseño de la Fase 1.*

| Principio | Cómo lo cumple este plan | Estado |
|---|---|---|
| **I. Simplicidad ante todo** | Sin backend, sin base de datos, sin cuentas, sin PWA, sin librería de estado global, sin framework de CSS. Cuatro dependencias de producción, cada una atada a un requisito concreto de la spec | ✅ |
| **II. Idioma y mercado** | Interfaz, mensajes y PDF en español de España; importes con el formateador nativo `es-ES`/`EUR` (`1.500,00 €`); sin soporte multidivisa ni multi-idioma | ✅ |
| **III. Cero alcance fantasma** | Cada módulo del diseño se traza a un FR de la spec (tabla en [data-model.md](./data-model.md)). Descartes explícitos documentados: copias de seguridad, estados del presupuesto, funcionamiento sin conexión, analítica | ✅ |
| **IV. Verificable por una persona no técnica** | [quickstart.md](./quickstart.md) incluye un guion de 10 comprobaciones que se ejecutan usando la aplicación y mirando el PDF, sin leer código ni ejecutar comandos | ✅ |
| **V. Datos del usuario con respeto** | Solo se piden los datos que aparecen en el PDF; el NIF no se valida para no exigir de más. No hay credenciales, ni servidor, ni telemetría: los datos no salen del navegador | ✅ |

**Resultado**: pasa sin violaciones, antes y después del diseño. La sección *Complexity Tracking* queda vacía intencionadamente.

## Project Structure

### Documentation (this feature)

```text
specs/001-presupuestos-freelancer/
├── plan.md                    # Este archivo
├── spec.md                    # Especificación funcional
├── research.md                # Decisiones técnicas en lenguaje de negocio
├── data-model.md              # Entidades, reglas de cálculo y numeración
├── quickstart.md              # Arrancar, publicar y guion de verificación manual
├── contracts/
│   ├── almacen-schema.md      # Formato de los datos guardados en el navegador
│   └── pdf-documento.md       # Qué debe contener el PDF entregado al cliente
├── checklists/
│   └── requirements.md        # Checklist de calidad de la spec
└── tasks.md                   # Lo genera /speckit-tasks (no este comando)
```

### Source Code (repository root)

```text
index.html
package.json
vite.config.ts
tsconfig.json

src/
├── main.tsx                   # Punto de entrada
├── App.tsx                    # Rutas (#/) y estructura común
├── dominio/                   # Lógica pura, sin interfaz: el núcleo verificado
│   ├── tipos.ts               # Perfil, Cliente, Servicio, Presupuesto, Linea
│   ├── calculo.ts             # Base, IVA, retención, total y redondeo a céntimos
│   ├── calculo.test.ts
│   ├── numeracion.ts          # Número AAAA-NNN con reinicio anual
│   ├── numeracion.test.ts
│   ├── formato.ts             # Euros y fechas en formato español
│   └── formato.test.ts
├── almacen/
│   ├── almacen.ts             # Leer y escribir el documento JSON en localStorage
│   └── useDatos.ts            # Acceso a los datos desde la interfaz
├── pdf/
│   └── generarPdf.ts          # Construcción del PDF según contracts/pdf-documento.md
├── paginas/
│   ├── Presupuestos.tsx       # Inicio: lista y botón "Nuevo presupuesto"
│   ├── EditorPresupuesto.tsx  # Pantalla principal: líneas, retención, totales, PDF
│   ├── Perfil.tsx
│   ├── Catalogo.tsx
│   └── Clientes.tsx
├── componentes/               # Campos de formulario, tarjetas, avisos, barra de totales
└── estilos/
    └── global.css             # CSS mobile-first, sin framework
```

**Structure Decision**: proyecto único de frontend (sin carpetas `backend/` ni `api/`, porque no hay servidor). La separación que importa es `dominio/` frente al resto: todo lo que toca dinero vive en `dominio/`, sin depender de React ni del navegador, y es lo único que lleva pruebas automáticas. La interfaz consulta ese módulo, nunca recalcula por su cuenta, de modo que pantalla y PDF muestran siempre exactamente las mismas cifras.

**Rutas de la aplicación** (modo hash, para que el botón "atrás" del móvil funcione y no haga falta configurar el servidor):

| Ruta | Pantalla |
|---|---|
| `#/` | Lista de presupuestos + acceso a todo lo demás |
| `#/presupuestos/nuevo` | Crear presupuesto |
| `#/presupuestos/:id` | Ver y editar un presupuesto, descargar su PDF |
| `#/clientes` | Ficha de clientes |
| `#/catalogo` | Catálogo de servicios |
| `#/perfil` | Datos y logo del freelancer |

## Complexity Tracking

> Sin violaciones de la constitución que justificar. Tabla intencionadamente vacía.
