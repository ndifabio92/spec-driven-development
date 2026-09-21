# Contrato: el sistema visual «Mediterráneo»

**Tipo de contrato**: lenguaje visual compartido por toda la aplicación y por el PDF (FR-008 … FR-014, FR-031 … FR-051)
**Dónde vive**: un único bloque de variables al principio de la hoja de estilos global
**Quién lo consume**: las seis pantallas, directamente; el generador del PDF, leyendo esas mismas variables
**Sustituye a**: la versión de este contrato de la v1.1. Los nombres que desaparecen y los que cambian de valor están listados al final

## Por qué existe este contrato

Es la respuesta a «paleta y tipografía definidas en un único lugar» (FR-008). Mientras estos nombres se respeten, se puede cambiar la cara entera del producto tocando un bloque, y nadie puede colar un valor suelto «solo para esta pantalla» sin que se note. **Ningún archivo de la aplicación —ni el generador del PDF— escribe un color, un tamaño, una separación, una esquina, una sombra ni una duración a mano: todos usan un token de esta lista** (FR-051).

## La regla que manda sobre todas: los tokens que lee el PDF son valores planos

El generador del PDF pregunta al navegador por el valor de un token y recibe **el texto tal y como está escrito**, sin resolver. Por eso:

- **Todo token de esta lista es un valor plano**: un color, un número o una medida. Nunca una expresión calculada.
- Las expresiones calculadas —la fluidez del título, las mezclas para teñir— viven **en la regla que las usa**, compuestas a partir de tokens planos.
- Si un token se convirtiera en expresión, el PDF caería a su valor de respaldo **sin avisar**: un documento con tamaños o colores silenciosamente equivocados. Es el fallo más caro que puede introducir esta revisión.

## Tokens de color

Neutros cálidos, un acento de acción y tres tonos con significado. Nada más (FR-036).

| Token | Valor | Papel | ¿Lo lee el PDF? |
|---|---|---|---|
| `--color-fondo` | `#FFF8F3` | Lienzo cálido de la página | No |
| `--color-papel` | `#FFFFFF` | Superficies: tarjetas, campos, cabecera | Sí |
| `--color-tinta` | `#241A15` | Texto principal, títulos, importes | Sí |
| `--color-tinta-suave` | `#7A6A62` | Texto secundario, ayudas, rótulos menores | Sí |
| `--color-tinta-tenue` | `#8D7D74` | Texto de un elemento inactivo | No |
| `--color-linea` | `#F0E2D8` | Separación **decorativa**: entre filas de una lista, borde de una tarjeta | No |
| `--color-linea-fuerte` | `#E0CBBD` | Separación **que estructura**: cabecera de tabla, regla sobre el total | Sí |
| `--color-borde-control` | `#A08A7C` | Contorno de lo que se puede **escribir o pulsar**: campos, desplegables, botones secundarios | No |
| `--color-acento` | `#B34A25` | Terracota. Marca, botón principal, enlaces, sección actual, progreso, banda del PDF | Sí |
| `--color-acento-pulsado` | `#8F3A1C` | El acento al pasar por encima y al pulsar | No |
| `--color-acento-suave` | `#FBEBE3` | Relleno teñido: sección actual, bloque destacado, desglose del PDF | Sí |
| `--color-oliva` | `#4E5F33` | Lo que va bien: situación *Vigente* y confirmaciones | No |
| `--color-atencion` | `#8A5A0E` | Avisos que no son fallos, situación *Caducado* | No |
| `--color-error` | `#A32A22` | Algo que corregir, acciones destructivas | No |

### Reglas de color

- **Un color, un significado** (FR-036): terracota = acción y marca; oliva = vigente y confirmación; atención = caducado y aviso; error = fallo. Ningún tono se reutiliza para dos cosas. *Esto es lo que cambia respecto a la v1.1, donde el acento marcaba también la situación Vigente.*
- **Tres líneas, tres trabajos.** Confundirlas es lo que deja un formulario sin contraste: `--color-linea` separa, `--color-linea-fuerte` estructura y `--color-borde-control` dice «aquí se puede escribir». El contorno de un campo **nunca** usa `--color-linea`.
- **Contraste mínimo** (FR-037): 4,5:1 para texto normal y 3:1 para elementos de interfaz e indicadores de estado. Los valores de esta tabla están elegidos por eso:

  | Valor | Contraste sobre papel | Para qué llega |
  |---|---|---|
  | `--color-tinta` | 15,0:1 | Todo |
  | `--color-tinta-suave` | 5,2:1 | Texto normal |
  | `--color-oliva` | 6,9:1 | Texto normal |
  | `--color-atencion` | 5,9:1 | Texto normal |
  | `--color-error` | 6,4:1 | Texto normal |
  | `--color-acento` | 5,4:1 | Texto normal y relleno con texto en blanco |
  | `--color-borde-control` | 3,3:1 | Contorno de un control |
  | `--color-tinta-tenue` | 3,9:1 | Texto inactivo (excepción declarada: los controles desactivados no llegan a 4,5:1, pero **nunca bajan de 3:1**) |

- **El color nunca es el único portador de información** (FR-039): si algo se distingue por color, se distingue también por texto, forma o grosor.
- **Las superficies se distinguen del lienzo por temperatura** (FR-038): papel blanco puro sobre fondo cálido. El borde acompaña, no carga solo con el trabajo.
- **No hay tonos decorativos**: si un color no está en esta tabla, no se usa. Se permite **teñir** un token de esta tabla dentro de una regla que solo pinta pantalla (por ejemplo el relleno suave de las etiquetas de situación); no se permite para nada que el PDF tenga que leer.

## Tokens de tipografía

| Token | Valor | Papel | ¿Lo lee el PDF? |
|---|---|---|---|
| `--tipo-familia-titular` | Familia de titulares, con respaldo del sistema | **Solo pantalla.** Título de pantalla y marca, y nada más | No |
| `--tipo-familia` | Familia de lectura, con respaldo del sistema | Todo lo demás: cuerpo, campos, rótulos, importes | No |
| `--tipo-apoyo` | `0.875rem` | Ayudas, datos secundarios, cabeceras de tabla | Sí |
| `--tipo-base` | `1rem` | Texto normal y campos. **Suelo infranqueable** (FR-032) | Sí |
| `--tipo-seccion` | `1.25rem` | Título de bloque | Sí |
| `--tipo-titulo` | `1.75rem` | Título de pantalla: extremo **inferior** del rango fluido | Sí |
| `--tipo-titulo-amplio` | `2.25rem` | Título de pantalla: extremo **superior** del rango fluido | No |
| `--tipo-total` | `2rem` | El total a pagar (FR-011) | Sí |
| `--peso-normal` | `400` | Texto corrido | Sí |
| `--peso-medio` | `500` | Rótulos de campo, accesos de navegación, cabeceras de tabla | Sí |
| `--peso-fuerte` | `700` | Títulos, importes y total | Sí |
| `--letra-titular` | `-0.02em` | Apretado óptico de los titulares | No |
| `--letra-cifra` | `-0.01em` | Apretado óptico de las cifras grandes | No |
| `--linea-apretada` | `1.15` | Titulares y cifras | No |
| `--linea-normal` | `1.55` | Cuerpo | No |

### Reglas de tipografía

- **Dos familias, dos trabajos** (FR-031). La de titulares se usa en el título de pantalla y en la marca. En ningún otro sitio: ni en títulos de bloque, ni en botones, ni en importes.
- **La escala progresa** (FR-032): 14 · 16 · 20 · 28→36 · 32. Ningún nivel queda a menos de 4 px del siguiente, y el texto base no baja de 16 px reales porque por debajo el móvil hace zoom solo al enfocar un campo.
- **El título de pantalla es fluido, pero su fluidez está en la regla del título**, compuesta entre `--tipo-titulo` y `--tipo-titulo-amplio`. Los dos tokens siguen siendo valores planos (ver la regla que manda sobre todas).
- **Tres pesos, tres trabajos** (FR-033). Se acaba el grosor único aplicado a elementos de rango distinto: un rótulo de campo y un importe **no pueden** compartir peso.
- **Todo importe lleva cifras de ancho fijo y va alineado a la derecha** (FR-034), sin excepción: pantalla, tabla de líneas, resumen y PDF. Es lo que hace que una columna de importes se lea como una columna.
- **Cada cosa con su interlínea**: la del cuerpo no se aplica a las cifras grandes ni a los titulares.
- **Las tipografías se sirven desde la propia aplicación** (FR-035). Dos archivos `woff2` con el juego latino, más su archivo de licencia, dentro del producto. **Ninguna petición a un tercero**: la dirección del freelancer no viaja a ningún servidor de fuentes. Si un archivo no llega, la familia de respaldo del sistema mantiene todo legible.

## Tokens de espaciado

Escala de base 4, siete peldaños, sin huecos (FR-040):

| Token | Valor | Uso | ¿Lo lee el PDF? |
|---|---|---|---|
| `--espacio-1` | `0.25rem` (4 px) | Rótulo y su campo | Sí |
| `--espacio-2` | `0.5rem` (8 px) | Huecos pequeños: accesos de la barra, pares de botones, aire de las etiquetas | Sí |
| `--espacio-3` | `0.75rem` (12 px) | Entre campos de un formulario | Sí |
| `--espacio-4` | `1rem` (16 px) | Relleno interior en móvil | Sí |
| `--espacio-5` | `1.5rem` (24 px) | Relleno interior en escritorio, entre bloques | Sí |
| `--espacio-6` | `2rem` (32 px) | Entre bloques grandes | Sí |
| `--espacio-7` | `3rem` (48 px) | Entre secciones y al pie de la página | No |

**Regla**: toda separación sale de la escala. No hay valores sueltos decididos pantalla a pantalla (FR-009).

## Tokens de forma, elevación y movimiento

| Token | Valor | Papel |
|---|---|---|
| `--radio-1` | `8px` | Campos, etiquetas, pastillas pequeñas |
| `--radio-2` | `14px` | Botones y tarjetas |
| `--radio-3` | `20px` | Tarjeta destacada y bloque de totales |
| `--radio-pastilla` | `999px` | Etiqueta de situación y origen de línea |
| `--sombra-1` | Sombra mínima, casi al ras | Superficie en reposo |
| `--sombra-2` | Sombra en dos capas, corta y difusa | Superficie elevada o enfocada |
| `--sombra-3` | Sombra hacia arriba | El total anclado al borde inferior en móvil |
| `--transicion-rapida` | `120ms` con salida suave | Color, fondo y borde |
| `--transicion` | `200ms` con curva de entrada rápida y salida lenta | Tamaño, posición y progreso |
| `--toque` | `44px` | Altura mínima de cualquier cosa pulsable (heredado, intocable) |
| `--ancho-contenido` | `68rem` | Ancho máximo de la aplicación |
| `--ancho-texto` | `42rem` | Ancho máximo de un párrafo largo |

### Reglas de forma y movimiento

- **Tres esquinas, tres jerarquías** (FR-042). El campo y la tarjeta dejan de tener la misma esquina.
- **Tres elevaciones** (FR-042). Se acaba la sombra única, y la del total anclado deja de ser un valor escrito a mano.
- **Toda transición sale de los dos tokens de movimiento** (FR-046). Y **con «reducir movimiento» activado en el sistema no hay ninguna**: una sola regla global las anula todas. Los estados siguen siendo perceptibles porque se distinguen por color y posición, no por la animación.

## Los seis estados, resueltos una vez para todos los controles (FR-043 … FR-045)

Se escriben **una sola vez** sobre las clases base —botón, acceso de la barra, acceso del inicio, campo—, no control a control.

| Estado | Cómo se resuelve |
|---|---|
| **Reposo** | `--sombra-1`; contorno `--color-borde-control` en lo que se pulsa o se escribe |
| **Encima** | Cambio **perceptible** de fondo y borde en `--transicion-rapida`. El botón principal pasa a `--color-acento-pulsado` |
| **Pulsado** | El elemento acusa la pulsación: fondo `--color-acento-pulsado` y hundimiento de 1 px |
| **Enfocado por teclado** | Anillo de 3 px en `--color-acento` separado 2 px del borde, **idéntico** en enlaces, botones y campos |
| **Inactivo** | Fondo y borde propios y texto en `--color-tinta-tenue`. **Nunca se apaga con transparencia**, y se acaban los dos valores distintos de la v1.1 |
| **Ocupado** | Un solo tratamiento reutilizable para «esto está en marcha», el mismo que ya usa la exportación de la copia |

**Cómo se comprueba que el estado «encima» cumple**: si hay que comparar dos capturas para verlo, no cumple (SC-019). Ese es exactamente el defecto de la v1.1, donde el cambio era del 2 %.

## Jerarquía visual exigida (FR-010, FR-011)

De más a menos peso, en toda la aplicación:

1. **Total a pagar** de un presupuesto — el dato que más se busca. Es el elemento tipográficamente **mayor** de su pantalla.
2. **Título de pantalla**.
3. **Títulos de bloque** y cabeceras de tabla.
4. **Datos y campos** de formulario.
5. **Etiquetas de campo**.
6. **Textos de ayuda y datos secundarios**.

Reglas que se comprueban mirando:

- En una pantalla con formulario se distinguen sin esfuerzo el título, los títulos de bloque, las etiquetas, las ayudas y los errores. **Ningún título de bloque tiene el mismo tamaño que el párrafo que lo sigue** (SC-012).
- El total a pagar destaca sobre el resto de importes y **sigue visible mientras se editan las líneas**, también en móvil.
- En una fila de la lista, **el importe pesa más que la etiqueta de situación** que tiene al lado (SC-013).
- Los mensajes de error se distinguen de las ayudas por algo más que el color.

## Etiqueta de situación (FR-015, FR-016)

La marca visual de Borrador, Vigente y Caducado. **Las reglas de cuándo se aplica cada una no cambian**: están en [data-model.md](../data-model.md) y se deducen solas.

| Situación | Texto | Tono | Segunda señal, no de color |
|---|---|---|---|
| Borrador | «Borrador» | Neutro (`--color-tinta-suave`) | Contorno discontinuo |
| Vigente | «Vigente» | **Oliva** (`--color-oliva`) | Contorno continuo y relleno suave |
| Caducado | «Caducado» | Atención (`--color-atencion`) | Contorno continuo y relleno suave |

**Reglas**:

- Siempre lleva **su palabra escrita**: el color acompaña, no sustituye.
- Tiene que seguir distinguiéndose **impresa en blanco y negro** (SC-008).
- Lleva **aire por encima y por debajo de su texto**, del peldaño de 8 px: en la v1.1 no tenía ninguno y parecía aplastada (FR-015, SC-015).
- Es informativa: **no se puede pulsar ni cambiar**. Si aparece un control para modificarla, el contrato está roto (FR-017b).
- *Cambio respecto a la v1.1*: Vigente pasa del acento al oliva, porque el acento ya solo significa «acción».

## Anchuras y puntos de ruptura (FR-047 … FR-050)

Los puntos de ruptura no pueden ser tokens, así que se declaran aquí y son **los dos únicos** que existen:

| Anchura | Qué pasa |
|---|---|
| Hasta 40 rem (**móvil**) | Una columna. Formularios de una columna, tabla de líneas como tarjetas apiladas, total anclado abajo, barra de secciones en **una sola línea** |
| 40 rem a 64 rem (**escritorio**) | La tabla de líneas vuelve a ser tabla, el resumen se coloca a la derecha, más relleno interior |
| Desde 64 rem (**escritorio ancho**) | Dos columnas donde hoy hay una pila: resumen y accesos en el inicio, desglose junto a la tabla en el editor. Los párrafos largos no pasan de `--ancho-texto` |

**Reglas**:

- La aplicación no pasa de `--ancho-contenido`, y en escritorio ancho **no puede quedar como una columna estrecha entre dos franjas vacías más anchas que el contenido** (FR-048).
- El resumen de actividad son **cinco** cifras y se reparte en un número de columnas **declarado por anchura**, nunca «las que quepan»: así no queda una fila huérfana con una sola cifra (FR-049).
- La barra de secciones **queda anclada arriba** y sigue visible al desplazarse (FR-050). En móvil tiene que **caber en una línea** y quedarse en unos 56 px de alto: el total ya está anclado abajo y el alto útil se reduce por los dos lados. Si no cupiera, la salida es **dejar de anclarla en móvil**, nunca esconder accesos detrás de un menú.

## Mobile-first: lo que no se puede perder (FR-012)

Esto ya funcionaba antes del rediseño y tiene que seguir funcionando después:

- Todo se lee **sin hacer zoom**.
- Formularios de **una sola columna** en móvil; el escritorio amplía, no al revés.
- Zonas pulsables de **44 px**, acertables con el pulgar.
- Los campos de cantidad e importe abren el **teclado numérico**.
- La tabla de líneas se convierte en **tarjetas apiladas** en pantalla estrecha.
- El **total permanece a la vista** mientras se editan las líneas.

## Lo que este contrato prohíbe

- Colores, tamaños de letra, separaciones, esquinas, sombras o duraciones escritos a mano fuera del bloque de tokens — **también en el generador del PDF** (FR-051).
- Convertir en expresión calculada un token que el PDF tiene que leer.
- Usar `--color-linea` como contorno de un campo o de un botón.
- Usar la familia de titulares fuera del título de pantalla y la marca.
- Señalar «inactivo» con transparencia.
- Modo oscuro, temas alternativos o personalización de la paleta por parte del freelancer.
- Iconografía decorativa, imágenes de adorno, degradados y animaciones de entrada.
- Cualquier **dependencia nueva de npm** para conseguir todo lo anterior. Los dos archivos de tipografía no son una dependencia: son activos del producto, con su justificación en el [plan](../plan.md).

## Qué cambia respecto a la v1.1 de este contrato

**Tokens que desaparecen**: ninguno se borra sin sustituto, pero cambian de valor `--color-fondo`, `--color-papel` (igual), `--color-tinta`, `--color-tinta-suave`, `--color-linea`, `--color-acento`, `--color-atencion`, `--tipo-familia`, `--tipo-titulo`, `--tipo-seccion`, `--tipo-total`, `--radio` (pasa a ser `--radio-1`, `--radio-2` y `--radio-3`) y `--sombra` (pasa a `--sombra-1`, `--sombra-2` y `--sombra-3`).

**Tokens nuevos**: `--color-tinta-tenue`, `--color-linea-fuerte`, `--color-borde-control`, `--color-acento-pulsado`, `--color-acento-suave`, `--color-oliva`, `--tipo-familia-titular`, `--tipo-titulo-amplio`, `--peso-normal`, `--peso-medio`, `--peso-fuerte`, `--letra-titular`, `--letra-cifra`, `--linea-apretada`, `--linea-normal`, `--espacio-2`, `--espacio-7`, `--radio-pastilla`, `--transicion-rapida`, `--transicion`, `--ancho-contenido`, `--ancho-texto`.

**La escala de espaciado se renombra antes de cambiar de valor**, en dos pasos, y el primero no se ve. La tabla de equivalencias está en [research.md](../research.md), Decisión 8. Saltarse ese orden es el error más caro de esta revisión: cada `--espacio-2` del producto pasaría de 12 px a 8 px sin que nadie lo haya decidido.
