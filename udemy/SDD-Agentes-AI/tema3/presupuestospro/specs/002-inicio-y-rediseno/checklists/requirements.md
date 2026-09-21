# Specification Quality Checklist: Pantalla de inicio e imagen «Mediterráneo» (PresupuestosPro v1.1 → v1.3)

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-09-19
**Revisada**: 2026-09-19 — validación de la reescritura completa de la capa visual
**Feature**: [spec.md](../spec.md)
**Documento base de la revisión**: [direccion-visual-mediterranea.md](../../propuestas/direccion-visual-mediterranea.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

### Sobre la revisión

- **Esta spec se ha reescrito, no sustituido.** Conserva número, rama y carpeta. Las historias 1 y 4 están entregadas en la v1.1 y se marcan como tal; las historias 2 y 3 se rehacen y las 5 y 6 son nuevas. La tabla «Estado de la revisión» dice qué cambia y qué no.
- **La numeración no se reordena**: FR-001 … FR-026 conservan su significado porque el código ya los cita en sus comentarios (`global.css` cita FR-005, FR-006, FR-008, FR-011 y FR-016; `EtiquetaSituacion.tsx` cita FR-016 y FR-017b; `generarPdf.ts` cita FR-022 y FR-023). Se comprobó uno a uno que todos siguen existiendo con el mismo significado. Lo que aporta la revisión entra a partir de FR-027.
- **Las seis decisiones abiertas de la pre-especificación (D1 … D6) se cierran en Clarifications**, cada una según la recomendación de ese documento, y se declaran reversibles vía `/speckit-clarify`. Por eso no queda ningún marcador [NEEDS CLARIFICATION].

### Sobre «No implementation details»

- La spec incluye valores concretos de color, tamaño y espaciado. **No son detalle de construcción**: el color de la banda del PDF es lo que ve el cliente del freelancer, y los criterios de éxito se comprueban comparando la pantalla con la tabla de paleta impresa (SC-006). El nombre técnico de cada valor y las reglas a nivel de hoja de estilos se han dejado fuera a propósito: viven en [`contracts/sistema-visual.md`](../contracts/sistema-visual.md), que enmienda `/speckit-plan`.
- Por el mismo motivo se han retirado de la spec las expresiones técnicas que sí traía la pre-especificación (la función de tamaño fluido del título, las sombras con canal alfa, la curva de aceleración): se describen por su efecto —«28 px creciendo con fluidez hasta 36», «tres niveles de elevación», «120 ms»— y su forma exacta es trabajo del contrato.

### Sobre la verificabilidad (Principio IV)

- Los 28 criterios de éxito se comprueban usando la aplicación y mirando el PDF. Cada uno está trazado al criterio equivalente de la pre-especificación (CA-001 … CA-026), y los dos que esa propuesta no cubría —alineación de cifras (SC-027) y continuidad de tabla larga (SC-025)— se han añadido.
- Los criterios que exigen material de apoyo lo dicen: la tabla de paleta impresa (SC-006), una impresión en blanco y negro (SC-008), el explorador de archivos para comparar pesos (SC-026) y el modo sin conexión (SC-028).

### Sobre lo que no cambia

- FR-024 … FR-030 fijan la frontera: cálculos, numeración, datos guardados, nombres de archivo, contenido del PDF, el desglose de referencia de 2.120,00 € y que nada salga del navegador. SC-004, SC-005, SC-025 y SC-026 lo comprueban comparando presupuestos, PDFs y pesos de antes y después.

### Pendiente antes de `/speckit-plan`

- No es un defecto de la spec, sino trabajo que la spec deja declarado: `plan.md` y `tasks.md` de la v1.1 quedan **obsoletos**, y `contracts/sistema-visual.md`, `contracts/pdf-presentacion.md`, `contracts/navegacion.md`, `quickstart.md` y `checklists/ux.md` deben enmendarse al replanificar. Está recogido en la sección «Dependencias y documentos afectados».
- Items marked incomplete require spec updates before `/speckit-clarify` or `/speckit-plan`.
