# Contrato: entrada, secciones y navegación común

**Tipo de contrato**: recorrido de la aplicación (FR-001 … FR-007)
**Afecta a**: la pantalla que recibe al freelancer y la barra que aparece en todas las demás

## Por qué existe este contrato

Define lo único que cambia de sitio en esta versión: **por dónde se entra**. Todo lo demás sigue donde estaba, y este documento lo deja por escrito para que nadie tenga que adivinar si una pantalla se movió o desapareció.

## La entrada

| Antes | Ahora |
|---|---|
| Abrir la aplicación llevaba directamente a la **lista de presupuestos** | Abrir la aplicación lleva a **Inicio** (FR-001) |

La lista de presupuestos **no desaparece ni pierde nada**: pasa a ser una sección más, con su propia dirección (FR-007).

## Las secciones

Cinco destinos, siempre los mismos y siempre accesibles:

| Sección | Qué es |
|---|---|
| **Inicio** | Resumen de actividad y accesos. Nueva |
| **Presupuestos** | La lista de siempre, ahora con la etiqueta de situación en cada fila |
| **Clientes** | Sin cambios de función |
| **Catálogo** | Sin cambios de función |
| **Perfil** | Sin cambios de función |

Las pantallas de crear y editar un presupuesto no son secciones: se llega a ellas desde Inicio o desde la lista, y siguen exactamente igual.

## La navegación común (FR-005, FR-006)

**Reglas**:

- Aparece en **todas** las pantallas, incluida la de editar un presupuesto.
- Lleva a cualquier sección **en un solo toque**, sin usar el botón "atrás" del dispositivo.
- Los cinco accesos están **visibles**: no se esconden detrás de un menú ni de un desplazamiento lateral. En una pantalla estrecha pasan a la línea siguiente.
- **Señala en qué sección se está** en cada momento, y con algo más que el color.
- Cada acceso cumple la zona pulsable de 44 px.

## Qué tiene que ofrecer Inicio (FR-002, FR-003, FR-004)

| Bloque | Contenido | Si no hay datos |
|---|---|---|
| Accesos | Las cuatro secciones: Presupuestos, Clientes, Catálogo y Perfil | Siempre presentes |
| Resumen | Presupuestos en Borrador, Vigente y Caducado; nº de clientes; nº de servicios | Todo a cero, más una indicación de por dónde empezar |
| Acción principal | **Crear un presupuesto nuevo**, sin pasar por la lista | Siempre presente |

**Regla de coherencia (FR-018)**: los recuentos del resumen tienen que coincidir exactamente con lo que muestra la lista de presupuestos. Las tres situaciones son excluyentes, así que suman el total de presupuestos guardados.

## Las direcciones

Se mantiene el esquema con `#` de la 001, que es lo que permite publicar en cualquier alojamiento estático y hace que el botón "atrás" del móvil funcione.

| Dirección | Pantalla | Cambio |
|---|---|---|
| `#/` | Inicio | **Nueva entrada** |
| `#/presupuestos` | Lista de presupuestos | **Se mueve aquí** (antes estaba en `#/`) |
| `#/presupuestos/nuevo` | Crear presupuesto | Sin cambios |
| `#/presupuestos/:id` | Ver y editar un presupuesto | Sin cambios |
| `#/clientes` | Clientes | Sin cambios |
| `#/catalogo` | Catálogo | Sin cambios |
| `#/perfil` | Perfil | Sin cambios |

**Consecuencia asumida**: quien tuviera guardada la dirección de la aplicación aterriza ahora en Inicio en vez de en la lista. Es la intención del cambio.

## Lo que este contrato prohíbe

- Esconder secciones detrás de un menú desplegable o de un desplazamiento lateral.
- Quitar, renombrar o fusionar cualquiera de las secciones existentes.
- Añadir a la lista de presupuestos capacidades nuevas aprovechando que se toca (buscar, filtrar, ordenar, duplicar, eliminar): eso es funcionalidad nueva y necesita su propia spec.
- Que cualquier acción disponible hoy en una pantalla desaparezca, quede oculta o cueste más pasos que antes (FR-014).
