# Contrato: entrada, secciones y navegación común

**Tipo de contrato**: recorrido de la aplicación (FR-001 … FR-007, FR-050)
**Afecta a**: la pantalla que recibe al freelancer y la barra que aparece en todas las demás
**Estado**: entregado en la v1.1. La revisión «Mediterráneo» le añade **una sola regla**: la barra se queda visible al desplazarse (FR-050)

## Por qué existe este contrato

Define lo único que cambió de sitio en la v1.1: **por dónde se entra**. Todo lo demás sigue donde estaba, y este documento lo deja por escrito para que nadie tenga que adivinar si una pantalla se movió o desapareció.

## La entrada

| Antes de la v1.1 | Desde la v1.1 |
|---|---|
| Abrir la aplicación llevaba directamente a la **lista de presupuestos** | Abrir la aplicación lleva a **Inicio** (FR-001) |

La lista de presupuestos **no desaparece ni pierde nada**: es una sección más, con su propia dirección (FR-007).

## Las secciones

Cinco destinos, siempre los mismos y siempre accesibles:

| Sección | Qué es |
|---|---|
| **Inicio** | Resumen de actividad y accesos |
| **Presupuestos** | La lista, con la etiqueta de situación en cada fila |
| **Clientes** | Sin cambios de función |
| **Catálogo** | Sin cambios de función |
| **Perfil** | Sin cambios de función |

Las pantallas de crear y editar un presupuesto no son secciones: se llega a ellas desde Inicio o desde la lista.

## La navegación común (FR-005, FR-006, FR-050)

**Reglas**:

- Aparece en **todas** las pantallas, incluida la de editar un presupuesto.
- Lleva a cualquier sección **en un solo toque**, sin usar el botón "atrás" del dispositivo.
- Los cinco accesos están **visibles**: no se esconden detrás de un menú ni de un desplazamiento lateral.
- **Señala en qué sección se está** en cada momento, y con algo más que el color.
- Cada acceso cumple la zona pulsable de 44 px, y entre dos accesos hay un hueco visible: no se tocan (SC-014).
- **[Nuevo en la v1.3]** La barra **queda anclada arriba y sigue visible al desplazarse** por una pantalla larga (FR-050).

### La restricción que trae el anclaje, y su salida

En móvil, el total a pagar ya está anclado abajo mientras se editan las líneas. Con la barra anclada arriba, el alto útil se reduce por los dos lados. Por eso:

- En móvil la barra **tiene que caber en una línea** y quedarse en unos 56 px de alto.
- Si en la verificación manual no cupiera, la salida es **dejar de anclarla en móvil** y mantenerla anclada solo en escritorio.
- La salida **nunca** es esconder accesos detrás de un menú desplegable: FR-005 lo prohíbe.

## Qué tiene que ofrecer Inicio (FR-002, FR-003, FR-004)

| Bloque | Contenido | Si no hay datos |
|---|---|---|
| Accesos | Las cuatro secciones: Presupuestos, Clientes, Catálogo y Perfil | Siempre presentes |
| Resumen | Presupuestos en Borrador, Vigente y Caducado; nº de clientes; nº de servicios | Todo a cero, más una indicación de por dónde empezar |
| Acción principal | **Crear un presupuesto nuevo**, sin pasar por la lista | Siempre presente |

**Regla de coherencia (FR-018)**: los recuentos del resumen tienen que coincidir exactamente con lo que muestra la lista de presupuestos. Las tres situaciones son excluyentes, así que suman el total de presupuestos guardados.

**Regla de reparto (FR-049)**: el resumen son **cinco** cifras y se coloca en un número de columnas declarado por anchura, nunca «las que quepan». Así no queda una fila huérfana con una sola cifra.

## Las direcciones

Se mantiene el esquema con `#` de la 001, que es lo que permite publicar en cualquier alojamiento estático y hace que el botón "atrás" del móvil funcione. **Esta revisión no cambia ninguna.**

| Dirección | Pantalla |
|---|---|
| `#/` | Inicio |
| `#/presupuestos` | Lista de presupuestos |
| `#/presupuestos/nuevo` | Crear presupuesto |
| `#/presupuestos/:id` | Ver y editar un presupuesto |
| `#/clientes` | Clientes |
| `#/catalogo` | Catálogo |
| `#/perfil` | Perfil |

## Lo que este contrato prohíbe

- Esconder secciones detrás de un menú desplegable o de un desplazamiento lateral.
- Quitar, renombrar o fusionar cualquiera de las secciones existentes.
- Añadir a la lista de presupuestos capacidades nuevas aprovechando que se toca (buscar, filtrar, ordenar, duplicar, eliminar): eso es funcionalidad nueva y necesita su propia spec.
- Que cualquier acción disponible hoy en una pantalla desaparezca, quede oculta o cueste más pasos que antes (FR-014).
- Que el anclaje de la barra reste sitio al editor hasta hacerlo incómodo en un móvil pequeño: antes que eso, se deja de anclar en móvil.
