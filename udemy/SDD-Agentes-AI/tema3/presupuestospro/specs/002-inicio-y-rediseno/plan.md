# Implementation Plan: Pantalla de inicio e imagen «Mediterráneo» (PresupuestosPro v1.1 → v1.3)

**Branch**: `002-inicio-y-rediseno` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-inicio-y-rediseno/spec.md`

## Summary

Esta revisión **no toca el motor del producto**: ni un cálculo, ni un número de presupuesto, ni un campo guardado, ni lo que dice el PDF. Sustituye la dirección visual que entregó la v1.1 —correcta pero genérica— por la dirección «Mediterráneo»: neutros cálidos, terracota para lo pulsable, oliva para lo vigente, dos tipografías con un trabajo cada una, una escala de espaciado completa, tres grados de esquina y de elevación, y estados que se notan.

Cuatro bloques de trabajo, en este orden obligado:

1. **Renombrar la escala de espaciado sin cambiar nada visible** (FR-041). Es el único paso cuyo éxito se mide en que *no pase nada*, y tiene que ir primero.
2. **Sustituir el sistema visual** en el único bloque donde vive, añadiendo los tokens que faltan: estados, esquinas, elevaciones, movimiento, anchuras y los tres tipos de línea.
3. **Aplicarlo a las seis pantallas y a los componentes**, resolviendo los seis estados una sola vez y añadiendo el segundo punto de ruptura.
4. **Rehacer la cara del PDF** con la paleta y la escala nuevas, derivando por fin sus tamaños del sistema en lugar de escribirlos a mano.

Las dos decisiones técnicas que sostienen el encargo son:

- **Los tokens siguen viviendo en el CSS y el generador del PDF los lee de ahí** (Decisión 1 de la v1.1, ampliada: ahora también lee tamaños). De ahí se deriva una regla nueva y estricta: **todo token que el PDF necesite leer es un valor plano**, nunca una expresión calculada, porque el lector recibe el texto del token sin resolver y caería a su respaldo sin avisar ([research.md](./research.md), Decisión 5).
- **Las tipografías viajan dentro del producto** —dos archivos, sin paquete nuevo de npm y sin pedir nada a un tercero— y **el PDF no las incrusta**: su parecido con la aplicación se consigue con color, aire y jerarquía (Decisiones 1, 2 y 3).

El razonamiento de cada decisión, en lenguaje de negocio, está en [research.md](./research.md).

## Technical Context

El stack, las convenciones y la estructura son **los de la spec 001** y no se tocan. Solo se registra lo que esta revisión añade o matiza:

**Language/Version**: sin cambios (TypeScript 5.9 y React 19 sobre Vite 8, el mismo proyecto)

**Primary Dependencies**: **ninguna nueva**. La lista cerrada sigue cerrada: sin framework de CSS, sin librería de componentes, sin librería de estado, sin iconos. *Lo que sí entra son dos activos binarios* —dos archivos de tipografía en `woff2`, de licencia abierta, servidos desde el propio alojamiento— que **no son un paquete** y por tanto no amplían la lista de dependencias. Su justificación contra el Principio I está en *Complexity Tracking*

**Storage**: sin cambios. Ni una clave nueva, ni un campo nuevo, ni migración. El documento JSON de [contracts/almacen-schema.md](../001-presupuestos-freelancer/contracts/almacen-schema.md) se lee y se escribe exactamente igual

**Testing**: Vitest, con la regla de la 001 —solo lógica pura de dominio—. Esta revisión **no añade ni una prueba automática**, porque no añade ni una regla de dominio: la situación, el cálculo, la numeración y el formato no se tocan. Las pruebas existentes son la red que demuestra que siguen intactos

**Target Platform**: sin cambios. Mobile-first, navegadores modernos de móvil y escritorio, publicado como sitio estático

**Project Type**: sin cambios. Aplicación de una sola página

**Performance Goals**: la primera pantalla no puede esperar a una descarga externa, porque no hay ninguna: los dos archivos de tipografía salen del mismo alojamiento y el de lectura se precarga. El resumen del inicio se sigue calculando al vuelo sobre decenas de presupuestos: instantáneo

**Constraints**: el contenido del PDF no puede variar ni un carácter (FR-020, FR-021); el desglose de referencia tiene que seguir dando 2.120,00 € (FR-028); un PDF no puede pesar más de un 20 % por encima del actual (FR-053); todo sigue en español de España y sin que ningún dato salga del navegador (FR-030)

**Scale/Scope**: 6 pantallas, 8 componentes, 1 hoja de estilos reescrita (unas 750 líneas hoy), 1 módulo puente de tokens ampliado, 1 plantilla de PDF remaquetada, 2 archivos de tipografía nuevos. **Cero módulos de dominio tocados**

## Constitution Check

*GATE: verificado antes de la Fase 0 y de nuevo tras el diseño de la Fase 1.*

| Principio | Cómo lo cumple este plan | Estado |
|---|---|---|
| **I. Simplicidad ante todo** | Cero dependencias nuevas. El sistema visual sigue siendo variables en el archivo que ya existe, no una capa de temas. Los estados se escriben una vez sobre las clases que ya hay, en lugar de envolver los controles en componentes nuevos. Los dos archivos de tipografía son el único activo añadido, con su justificación escrita | ✅ con una excepción justificada |
| **II. Idioma y mercado** | No se añade ni se cambia un solo texto de interfaz. Los importes siguen saliendo del formateador que ya existe, en euros y en español de España | ✅ |
| **III. Cero alcance fantasma** | Sin modo oscuro, sin temas, sin iconografía, sin animaciones de entrada, sin gráficas en el resumen. Cada cambio se traza a un FR de la spec; las seis decisiones que estaban abiertas se cerraron en las Clarifications antes de planificar | ✅ |
| **IV. Verificable por una persona no técnica** | [quickstart.md](./quickstart.md) es un guion de «antes y después» que se ejecuta mirando la pantalla y el PDF, con los 28 criterios de éxito anotados Sí/No. Incluye el paso 1 del renombrado, cuyo resultado esperado es *que no se vea ninguna diferencia* | ✅ |
| **V. Datos del usuario con respeto** | No se pide ni un dato más. **Ninguna petición a terceros**: las tipografías viajan dentro del producto, así que la dirección del freelancer no llega a ningún servidor de fuentes. Sin telemetría y sin secretos en el código | ✅ |

**Resultado**: pasa. La única desviación —añadir dos activos binarios al producto— está justificada en *Complexity Tracking* y no amplía la lista de dependencias.

## Project Structure

### Documentation (this feature)

```text
specs/002-inicio-y-rediseno/
├── plan.md                      # Este archivo
├── spec.md                      # Especificación funcional (reescrita para la v1.3)
├── research.md                  # Las once decisiones de esta revisión, en lenguaje de negocio
├── data-model.md                # Situación y resumen: qué se deduce y qué NO se guarda (sin cambios)
├── quickstart.md                # Guion de verificación «antes y después», ampliado
├── contracts/
│   ├── sistema-visual.md        # REESCRITO: los tokens de la dirección «Mediterráneo»
│   ├── navegacion.md            # AMPLIADO: la barra se queda visible al desplazarse
│   └── pdf-presentacion.md      # REESCRITO: paleta, aire, jerarquía y la conversión 1 rem = 9 pt
├── checklists/
│   └── requirements.md          # Checklist de calidad de la spec
└── tasks.md                     # Lo genera /speckit-tasks (no este comando)
```

### Source Code (repository root)

Se respeta la estructura de la 001. Marcado solo lo que esta revisión toca:

```text
src/
├── App.tsx                        # MODIFICADO: la barra de secciones se ancla arriba (FR-050)
├── dominio/                       # INTACTO. Ni un archivo, ni una prueba. Es la garantía de FR-024…FR-028
├── almacen/                       # INTACTO: ni un cambio en el formato ni en el acceso
├── paginas/
│   ├── Inicio.tsx                 # MODIFICADO: resumen en rejilla declarada (FR-049) y dos columnas en ancho
│   ├── EditorPresupuesto.tsx      # MODIFICADO: dos columnas en ancho; el total sigue anclado en móvil
│   └── (Presupuestos, Clientes, Catalogo, Perfil)   # MODIFICADOS solo en apariencia
├── componentes/
│   ├── Boton.tsx                  # MODIFICADO: variantes y estado inactivo sin transparencia
│   └── (Aviso, CampoTexto, CampoNumero, TablaLineas, ResumenTotales, EtiquetaSituacion, BotonExportar)
│                                  # MODIFICADOS solo en apariencia; EtiquetaSituacion cambia Vigente a oliva
├── estilos/
│   ├── global.css                 # REESCRITO: aquí viven los tokens. Único lugar
│   ├── tokens.ts                  # AMPLIADO: además de color, lee tamaños y los convierte a puntos
│   └── (los archivos de tipografia viven en public/fuentes/, ver abajo)
└── pdf/
    └── generarPdf.ts              # MODIFICADO: solo maquetación y tamaños derivados del sistema
```

Y fuera de `src/`:

```text
index.html                         # MODIFICADO: precarga de la familia de lectura (Decisión 2)
CLAUDE.md                          # MODIFICADO al implementar: familias, fuentes y escala nueva
```

**Structure Decision**: se mantiene el proyecto único de la 001 y su separación clave — `dominio/` no sabe nada de React ni del navegador, y en esta revisión **no se toca en absoluto**. Los archivos de tipografía viven en **`public/fuentes/`** y no bajo `src/`. El plan los situaba en `src/estilos/fuentes/` para que el empaquetador les pusiera huella en el nombre, pero esa huella cambia en cada compilación y **haría imposible la precarga estática** de `index.html` (T005), que es lo que evita el salto de maquetación cuando la letra tarda en llegar. Desde `public/` la ruta es la misma en desarrollo y en producción. La invalidación de caché sigue cubierta porque el nombre del archivo ya identifica familia, grosor y subconjunto: cambiar de tipografía cambia el nombre. **Corregido durante `/speckit-implement`.** `estilos/tokens.ts` sigue siendo la única pieza que cruza fronteras y crece en un solo sentido: hoy traduce colores para el PDF, ahora traduce también tamaños.

**Rutas**: sin ningún cambio respecto a la v1.1. Siguen en modo hash, la entrada sigue siendo `#/` → Inicio y la lista sigue en `#/presupuestos` ([contracts/navegacion.md](./contracts/navegacion.md)).

### Orden de ejecución obligado

No es una sugerencia de reparto: el orden es parte del diseño.

| # | Bloque | Por qué va aquí | Cómo se comprueba |
|---|---|---|---|
| 1 | Renombrar la escala de espaciado | Si va después, cualquier error de renombrado queda escondido detrás de un cambio de diseño | **No se ve ninguna diferencia** respecto a antes |
| 2 | Tokens nuevos en el bloque único | Todo lo demás los consume | La aplicación sigue funcionando, aún con la cara antigua allí donde no se han aplicado |
| 3 | Pantallas, componentes y estados | Es el cuerpo del trabajo | Historias 2, 5 y 6 del guion |
| 4 | La cara del PDF | Hereda la paleta y la escala del bloque 2 | Historia 3 del guion, con el desglose de referencia al lado |

## Complexity Tracking

> Una sola desviación que justificar.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| **Dos activos binarios nuevos en el producto** (dos archivos de tipografía `woff2`, más su archivo de licencia) | La dirección visual elegida es una decisión de producto tomada y escrita (FR-031): sin sus dos familias, el encargo no se puede cumplir. Se limitan a **dos** archivos frente al tope de cuatro que fijó la spec, usando una fuente variable que da los tres grosores en un solo archivo | **Seguir con la tipografía del sistema** no cumple FR-031 ni FR-027, y es justo el diagnóstico que originó la revisión. **Pedirla a un servicio externo** filtra la dirección del freelancer a un tercero (Principio V) y rompe SC-028. **Instalar un paquete de npm** sí ampliaría la lista cerrada de dependencias, y solo para copiar dos archivos |

**Lo que esta desviación NO abre**: no es precedente para añadir paquetes. La regla sigue en pie: `fflate` fue la primera excepción concedida, esta es la segunda y también está justificada por escrito. La siguiente tendrá que justificarse igual.
