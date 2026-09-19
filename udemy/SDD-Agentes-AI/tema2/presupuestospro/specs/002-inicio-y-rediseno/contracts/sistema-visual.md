# Contrato: el sistema visual

**Tipo de contrato**: lenguaje visual compartido por toda la aplicación y por el PDF (FR-008 … FR-014, FR-016)
**Dónde vive**: un único bloque de variables al principio de la hoja de estilos global
**Quién lo consume**: las seis pantallas, directamente; el generador del PDF, leyendo esas mismas variables

## Por qué existe este contrato

Es la respuesta a "paleta de colores limitada definida en un único lugar". Mientras estos nombres se respeten, se puede cambiar la cara entera del producto tocando un bloque, y nadie puede colar un color suelto "solo para esta pantalla" sin que se note. **Ningún archivo de la aplicación escribe un color, un tamaño de letra o un espaciado a mano: todos usan un token de esta lista.**

## Tokens de color

Un tono neutro en cuatro intensidades y tres tonos con significado. Nada más (SC-006).

| Token | Papel | Dónde manda |
|---|---|---|
| `--color-tinta` | Texto principal | Títulos, datos, importes |
| `--color-tinta-suave` | Texto secundario | Ayudas, etiquetas de apoyo, datos menores |
| `--color-linea` | Separaciones | Bordes de campos y tarjetas, filas de tabla |
| `--color-fondo` | Fondo de la página | El lienzo sobre el que flotan las tarjetas |
| `--color-papel` | Fondo de las superficies | Tarjetas, campos, cabecera |
| `--color-acento` | Lo importante y lo pulsable | Botón principal, sección activa, cabecera de la tabla del PDF, situación *Vigente* |
| `--color-atencion` | Avisos que no son fallos | Avisos informativos, situación *Caducado* |
| `--color-error` | Algo que corregir | Mensajes de error, acciones destructivas |

**Reglas**:

- El color **nunca es el único portador de información** (FR-016): si algo se distingue por color, se distingue también por texto, forma o grosor.
- Texto y fondo mantienen un contraste suficiente para leerse cómodamente, también en los tonos con significado.
- No hay tonos decorativos: si un color no cae en esta tabla, no se usa.

## Tokens de tipografía

| Token | Papel |
|---|---|
| `--tipo-familia` | **Una sola familia** para todo, de métricas Helvetica/Arial, para que la pantalla y el PDF se parezcan (ver Decisión 2 de [research.md](../research.md)) |
| `--tipo-titulo` | Título de pantalla |
| `--tipo-seccion` | Título de bloque dentro de una pantalla |
| `--tipo-base` | Texto normal y campos de formulario |
| `--tipo-apoyo` | Ayudas y datos secundarios |
| `--tipo-total` | El total a pagar, que manda sobre todo lo demás (FR-011) |

**Reglas**:

- El texto base y los campos **nunca bajan de 16 px reales**: por debajo, el móvil hace zoom solo al enfocar un campo (FR-012).
- La jerarquía se construye con tamaño y grosor, no con colores distintos.
- Sin fuentes externas: ni descargas, ni dependencias, ni direcciones del freelancer viajando a un tercero.

## Tokens de espaciado

| Token | Uso orientativo |
|---|---|
| `--espacio-1` | Separación mínima: etiqueta y su campo |
| `--espacio-2` | Entre campos de un formulario |
| `--espacio-3` | Relleno interior de tarjetas y botones |
| `--espacio-4` | Entre bloques de una pantalla |
| `--espacio-5` | Entre secciones grandes |

**Regla**: toda separación sale de la escala. No hay valores sueltos decididos pantalla a pantalla (FR-009).

## Tokens de interacción

| Token | Papel |
|---|---|
| `--toque` | Altura mínima de cualquier cosa pulsable: **44 px** (FR-012) |
| `--radio` | Redondeo de tarjetas, campos y botones |
| `--sombra` | Elevación discreta de las superficies |

## Jerarquía visual exigida (FR-010, FR-011)

De más a menos peso, en toda la aplicación:

1. **Total a pagar** de un presupuesto — el dato que más se busca.
2. **Título de pantalla**.
3. **Títulos de sección** y cabeceras de tabla.
4. **Datos y campos** de formulario.
5. **Etiquetas de campo**.
6. **Textos de ayuda y datos secundarios**.

Reglas que se comprueban mirando:

- En una pantalla con formulario se distinguen sin esfuerzo el título, las etiquetas, las ayudas y los errores.
- El total a pagar destaca sobre el resto de importes y **sigue visible mientras se editan las líneas**, también en móvil.
- Los mensajes de error se distinguen de las ayudas por algo más que el color.

## Etiqueta de situación (FR-015, FR-016)

La marca visual de Borrador, Vigente y Caducado.

| Situación | Texto | Tono | Segunda señal, no de color |
|---|---|---|---|
| Borrador | «Borrador» | Neutro | Contorno discontinuo |
| Vigente | «Vigente» | Acento | Contorno continuo y relleno suave |
| Caducado | «Caducado» | Atención | Contorno continuo y relleno suave |

**Reglas**:

- Siempre lleva **su palabra escrita**: el color acompaña, no sustituye.
- Tiene que seguir distinguiéndose **impresa en blanco y negro** (SC-008).
- Es informativa: **no se puede pulsar ni cambiar**. Si aparece un control para modificarla, el contrato está roto (FR-017b).

## Mobile-first: lo que no se puede perder (FR-012)

Esto ya funcionaba antes del rediseño y tiene que seguir funcionando después:

- Todo se lee **sin hacer zoom**.
- Formularios de **una sola columna** en móvil; el escritorio amplía, no al revés.
- Zonas pulsables de **44 px**, acertables con el pulgar.
- Los campos de cantidad e importe abren el **teclado numérico**.
- La tabla de líneas se convierte en **tarjetas apiladas** en pantalla estrecha.
- El **total permanece a la vista** mientras se editan las líneas.

## Lo que este contrato prohíbe

- Colores, tamaños de letra o espaciados escritos a mano fuera del bloque de tokens.
- Modo oscuro, temas alternativos o personalización de la paleta por parte del freelancer.
- Iconografía decorativa, imágenes de adorno, degradados y animaciones.
- Cualquier dependencia nueva para conseguir todo lo anterior.
