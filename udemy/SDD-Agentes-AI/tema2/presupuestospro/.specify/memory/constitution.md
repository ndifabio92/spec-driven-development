<!--
Sync Impact Report
- Version change: TEMPLATE (unratified) → 1.0.0
- Modified principles: n/a (initial ratification)
- Added principles:
  - I. Simplicidad ante todo
  - II. Idioma y mercado
  - III. Cero alcance fantasma
  - IV. Verificable por una persona no técnica
  - V. Datos del usuario con respeto
- Added sections: Alcance de la Versión 1, Calidad y Revisión, Governance
- Removed sections: none
- Templates requiring updates: none checked automatically by this command (dependent
  templates read the constitution at runtime; not modified here per scope guard)
- Follow-up TODOs: none
-->

# PresupuestosPro Constitution

## Core Principles

### I. Simplicidad ante todo
Ante dos soluciones posibles, se elige siempre la más simple. PresupuestosPro está en su
versión 1: NO se debe anticipar complejidad ni construir infraestructura, capas de
abstracción o configuraciones para necesidades hipotéticas futuras. Toda decisión de
diseño MUST justificarse por una necesidad presente en la spec activa, nunca por
"podríamos necesitarlo más adelante".

### II. Idioma y mercado
Todo el producto (interfaz, textos, mensajes de error, documentos generados) MUST estar
en español de España. La moneda MUST ser el euro (€) en todo cálculo, formato y
presentación de importes. No se soportan otros idiomas ni monedas en esta versión.

### III. Cero alcance fantasma
NO se MUST implementar ninguna funcionalidad que no esté escrita explícitamente en la
spec activa. Si durante el desarrollo surge una idea nueva o una mejora, se propone como
sugerencia (por ejemplo, a través del flujo de specs) pero NUNCA se construye sin pasar
antes por ese proceso. Esto aplica tanto a nuevas funciones visibles para el usuario como
a mejoras técnicas no solicitadas.

### IV. Verificable por una persona no técnica
Cada criterio de éxito o de aceptación definido en una spec MUST poder comprobarse
usando la aplicación directamente (haciendo clic, rellenando formularios, viendo el PDF
generado), sin necesidad de leer código ni ejecutar comandos técnicos. Si un criterio no
se puede verificar así, MUST reescribirse hasta que lo sea.

### V. Datos del usuario con respeto
Solo se MUST pedir al usuario la información imprescindible para generar el presupuesto
en PDF; no se solicitan datos adicionales "por si acaso". El código NUNCA debe contener
claves, contraseñas ni secretos embebidos: cualquier credencial MUST gestionarse fuera
del código fuente (variables de entorno o mecanismo equivalente).

## Alcance de la Versión 1

La versión 1 de PresupuestosPro se limita a permitir que un freelancer cree presupuestos
y los genere en PDF, en español de España y con importes en euros. Cualquier
funcionalidad que no esté descrita en la spec activa (integraciones, facturación,
multi-idioma, multi-moneda, cuentas de equipo, etc.) queda fuera de alcance hasta que se
proponga y se incorpore formalmente a una spec, conforme al Principio III (Cero alcance
fantasma).

## Calidad y Revisión

Toda revisión de spec, plan o código MUST confirmar el cumplimiento de los cinco
principios anteriores antes de aprobar un cambio. En particular, cada criterio de
aceptación de una spec MUST redactarse de forma verificable por una persona no técnica
(Principio IV), y cualquier funcionalidad añadida MUST poder rastrearse hasta una línea
explícita de la spec activa (Principio III).

## Governance

Esta constitución prevalece sobre cualquier otra práctica, plantilla o convención del
proyecto en caso de conflicto. Las enmiendas MUST documentarse (qué cambia y por qué) y
MUST actualizar la versión siguiendo versionado semántico:

- MAJOR: eliminación o redefinición incompatible de un principio existente.
- MINOR: adición de un nuevo principio o ampliación material de una guía existente.
- PATCH: aclaraciones, correcciones de redacción o ajustes no semánticos.

El cumplimiento de esta constitución se revisa en cada ciclo de spec, plan y tareas
mediante los comandos de Spec Kit (`/speckit-specify`, `/speckit-plan`,
`/speckit-tasks`, `/speckit-implement`); cualquier desviación MUST justificarse
explícitamente o corregirse antes de avanzar.

**Version**: 1.0.0 | **Ratified**: 2026-09-18 | **Last Amended**: 2026-09-18
