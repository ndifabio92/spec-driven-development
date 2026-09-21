# Pre-especificación: dirección visual «Mediterráneo» (PresupuestosPro v1.3)

**Estado**: propuesta. No es una spec todavía.
**Para qué sirve este documento**: es el texto de entrada de `/speckit-specify`. Nada de
lo que aquí se describe se construye hasta que exista la spec, su plan y sus tareas
(Principio III de la constitución).
**Nombre y rama propuestos**: `004-direccion-visual-mediterranea`.
**Fecha**: 2026-09-19.
**Modifica**: la capa visual que creó la [spec 002](../002-inicio-y-rediseno/spec.md).
**No modifica**: ningún cálculo, ningún dato guardado y ni una palabra de lo que dice el PDF.

---

## Objetivo

Sustituir el sistema visual actual —sobrio pero genérico, heredado de la 002— por una
dirección con carácter propio, cálida y reconocible, de modo que la aplicación **y el
documento que recibe el cliente** parezcan hechos en 2026 por un profesional con criterio,
no exportados de una plantilla.

Es un cambio de presentación puro. La regla que manda sobre todo lo que sigue es la misma
que se impuso la 002: **si un cambio altera un cálculo, un dato guardado o lo que *dice* el
PDF, no pertenece a esta spec.**

### Qué falla hoy, en concreto

Siete diagnósticos sobre el sistema actual. Cada uno es el problema que esta propuesta
tiene que dejar resuelto:

1. **Tipografía sin decisión**: la familia es la pila del sistema (`Helvetica Neue, Helvetica,
   Arial`) y la escala no progresa: el título de sección está 2 px por encima del cuerpo y
   el `h3` está *exactamente* al tamaño del párrafo.
2. **Un solo peso hace de jerarquía**: nueve elementos distintos —rótulo de campo, pastilla
   de navegación, botón, importe, etiqueta de situación, mensaje de error— comparten
   `600` y casi el mismo tamaño. El dinero pesa lo mismo que el rótulo de un formulario.
3. **Color gris sobre gris y un acento que hace de todo**: el lienzo y las superficies se
   diferencian en un 2 % de luminancia, y el mismo azul marca marca, enlace, sección activa,
   botón principal, progreso y situación *Vigente*.
4. **La escala de espaciado está rota entre el primer y el segundo peldaño** (×3), no existe
   el paso de 8 px, y eso deja 4 px de hueco entre pastillas de navegación de 44 px y una
   etiqueta de situación con cero relleno vertical.
5. **Nueve componentes con el mismo dibujo**: tarjeta, métrica, acceso, resumen, agrupador,
   campo, botón, imagen y fila de tabla comparten fondo blanco, borde de 1 px y radio de 8 px.
   Una sola sombra para toda la aplicación.
6. **Los estados casi no existen**: un `hover` de 2 %, ningún `:active`, una única transición
   en todo el archivo y dos opacidades distintas para lo mismo (`0,55` y `0,6`).
7. **Densidad de sitio web, no de aplicación**: un único punto de ruptura (40rem) y una
   columna de 62rem centrada; en un monitor ancho el producto es una cinta con dos franjas
   vacías, y la cabecera se va con el desplazamiento.

---

## Usuarios

| Quién | Qué hace con esto | Qué necesita de esta dirección |
|---|---|---|
| **El freelancer** (usuario principal, ya definido en la [001](../001-presupuestos-freelancer/spec.md)) | Trabaja en la app, a menudo desde el móvil y con prisa | Encontrar el total y el siguiente paso sin pensar; que la herramienta no parezca un borrador |
| **El cliente que recibe el presupuesto** (no usa la aplicación) | Abre un PDF, lo lee y decide | Un documento que se lea rápido, con el total inequívoco, y que transmita que detrás hay un profesional |
| **Quien imprime en blanco y negro** | Archiva el presupuesto en papel | Que Borrador, Vigente y Caducado sigan distinguiéndose sin color |
| **Quien no percibe el color como la mayoría** | Usa la app con daltonismo o bajo contraste | Que ninguna información dependa solo del tono |
| **Quien navega con teclado o con el pulgar** | Tabula, o toca con una mano en el autobús | Foco siempre visible y zonas pulsables de 44 px |

No hay usuarios nuevos: esta propuesta no abre el producto a nadie que no estuviera ya dentro.

---

## Dirección visual elegida (decisión de producto: dirección **C — Mediterráneo**)

Se evaluaron tres direcciones. Se elige la **C**.

**Referencias reales**: **Holded** (SaaS español: calidez sin infantilismo, tipografía muy
legible, color valiente en las acciones) y **Qonto** (acento saturado sobre neutros cálidos,
jerarquía construida con tamaño y aire, no con bordes).

**Qué es**: neutros cálidos de papel en lugar de grises fríos; **terracota** para todo lo
pulsable y para la marca; **oliva** para lo que va bien; titulares con una tipografía con
carácter y cuerpo con una tipografía de lectura; radios grandes, aire generoso y cifras
tabulares. El total a pagar deja de competir con nada.

**Qué transmite al cliente que recibe el presupuesto**: «detrás de esto hay una persona, y le
importa». Cercanía sin blandura. El presupuesto se lee rápido, el total destaca, y el
conjunto parece hecho a mano por un profesional con criterio en lugar de exportado de una
plantilla. Encaja cuando el destinatario es pyme, estudio, agencia o particular.

**Por qué esta y no las otras dos**:

- La **A** («Papel Timbrado», serif editorial) transmite autoridad fiscal, pero acerca el
  producto a un documento notarial y aleja a la clientela típica de un freelancer español.
- La **B** («Instrumento», densa, monoespaciada, oscura) es precisa y fría; optimiza para
  quien vive dentro de la herramienta, no para quien recibe el documento, y el modo oscuro
  nativo que la define no tiene sentido en un PDF que siempre es papel blanco.
- La **C** es la única que mejora las dos caras del producto a la vez con la misma decisión.

**Lo que esta dirección hereda y no discute**: mobile-first, una sola columna en móvil,
44 px de zona pulsable, 16 px reales de texto mínimo, el color nunca como único portador de
información, y los tokens en un único sitio.

---

## Reglas de diseño (tokens)

Sigue vigente la regla del [contrato visual de la 002](../002-inicio-y-rediseno/contracts/sistema-visual.md):
**los tokens viven en un único bloque y ningún archivo escribe un color, un tamaño o una
separación a mano.** Lo que cambia son los valores, y se añaden los tokens que hoy faltan.

### Color

Tres familias: neutros cálidos, acento de acción y tonos con significado.

| Token | Valor | Papel |
|---|---|---|
| `--color-fondo` | `#FFF8F3` | Lienzo cálido de la página |
| `--color-papel` | `#FFFFFF` | Superficies: tarjetas, campos, cabecera |
| `--color-tinta` | `#241A15` | Texto principal, títulos, importes |
| `--color-tinta-suave` | `#7A6A62` | Texto secundario, ayudas, rótulos menores |
| `--color-tinta-tenue` | `#A3958C` | **Nuevo.** Texto inactivo: sustituye a apagar con opacidad |
| `--color-linea` | `#F0E2D8` | Separaciones normales: bordes de campos y tarjetas |
| `--color-linea-fuerte` | `#E0CBBD` | **Nuevo.** Separaciones que estructuran: cabecera de tabla, regla del total |
| `--color-acento` | `#B34A25` | Terracota. Marca, botón principal, enlaces, sección activa, progreso |
| `--color-acento-pulsado` | `#8F3A1C` | **Nuevo.** El mismo acento al pasar por encima y al pulsar |
| `--color-acento-suave` | `#FBEBE3` | **Nuevo.** Relleno teñido: sección activa, fondo de bloque destacado |
| `--color-oliva` | `#4E5F33` | **Nuevo.** Lo que va bien: situación *Vigente* y confirmaciones |
| `--color-atencion` | `#8A5A0E` | Avisos que no son fallos, situación *Caducado* |
| `--color-error` | `#A32A22` | Algo que corregir, acciones destructivas |

**Reglas de color**:

- El acento **deja de hacer siete trabajos**: terracota = acción y marca; oliva = vigente y
  confirmación; atención = caducado y avisos; error = fallo. Ningún tono se reutiliza para
  dos significados distintos.
- Contraste mínimo 4,5:1 para texto normal. `#B34A25` está elegido por esto: el terracota
  más saturado de la propuesta original (`#C4562F`) se queda en 4,48:1 sobre blanco y **no
  se usa**.
- La superficie se distingue del lienzo por **temperatura**, no solo por un borde de 1 px.
- Ningún tono decorativo: si un color no está en esta tabla, no se usa.

### Tipografía

| Token | Valor | Papel |
|---|---|---|
| `--tipo-familia-titular` | `'Bricolage Grotesque', system-ui, sans-serif` | **Solo pantalla.** Título de pantalla y marca |
| `--tipo-familia` | `'Figtree', system-ui, -apple-system, sans-serif` | Todo lo demás: cuerpo, campos, rótulos, importes |
| `--tipo-apoyo` | `0.875rem` (14 px) | Ayudas y datos secundarios |
| `--tipo-base` | `1rem` (16 px) | Texto normal y campos. **Suelo infranqueable** |
| `--tipo-seccion` | `1.25rem` (20 px) | Título de bloque |
| `--tipo-titulo` | `clamp(1.75rem, 1.35rem + 2vw, 2.25rem)` | Título de pantalla, fluido de móvil a escritorio |
| `--tipo-total` | `2rem` (32 px) | El total a pagar |
| `--peso-normal` | `400` | Texto corrido |
| `--peso-medio` | `500` | **Nuevo.** Rótulos de campo, pastillas de navegación, cabeceras de tabla |
| `--peso-fuerte` | `700` | Importes, títulos, total |
| `--letra-titular` | `-0.02em` | Apretado óptico de los titulares |
| `--letra-cifra` | `-0.01em` | Apretado óptico de las cifras grandes |
| `--linea-apretada` | `1.15` | Titulares y cifras |
| `--linea-normal` | `1.55` | Cuerpo |

**Reglas de tipografía**:

- La escala progresa con razón **1,25** sobre base 16: 14 · 16 · 20 · 28→36 · 32. Se acaban
  los saltos de 2 px y el `h3` al tamaño del párrafo.
- **Tres pesos, tres trabajos.** El `600` indiscriminado desaparece: `500` para rótulos y
  navegación, `700` reservado a títulos, importes y total.
- **Todo importe lleva cifras tabulares y alineación a la derecha.** Sin excepción: pantalla,
  tabla de líneas, resumen y PDF.
- La interlínea del cuerpo no se aplica a las cifras grandes: cada uno con su token.
- **Las fuentes se sirven desde la propia aplicación**, nunca desde un tercero: ninguna
  dirección del freelancer viaja a un servidor de fuentes. Si no hay archivo, el respaldo es
  `system-ui` y todo sigue leyéndose.

### Espaciado

Escala de base 4, siete peldaños, sin huecos:

| Token | Valor | Uso |
|---|---|---|
| `--espacio-1` | `0.25rem` (4 px) | Rótulo y su campo |
| `--espacio-2` | `0.5rem` (8 px) | **Nuevo peldaño.** Huecos pequeños: pastillas, iconos, pares de botones |
| `--espacio-3` | `0.75rem` (12 px) | Entre campos de un formulario |
| `--espacio-4` | `1rem` (16 px) | Relleno interior en móvil |
| `--espacio-5` | `1.5rem` (24 px) | Relleno interior en escritorio, entre bloques |
| `--espacio-6` | `2rem` (32 px) | Entre bloques grandes |
| `--espacio-7` | `3rem` (48 px) | Entre secciones y al pie de la página |

**Atención — la renumeración no es inocente.** Los nombres actuales cambian de valor:

| Hoy | Valor de hoy | Pasa a llamarse |
|---|---|---|
| `--espacio-1` | 0,25rem | `--espacio-1` (igual) |
| `--espacio-2` | 0,75rem | `--espacio-3` |
| `--espacio-3` | 1rem | `--espacio-4` |
| `--espacio-4` | 1,5rem | `--espacio-5` |
| `--espacio-5` | 2,5rem | `--espacio-6` o `--espacio-7`, según el caso |

Si el renombrado no se hace **antes** de rediseñar, cada `var(--espacio-2)` del archivo pasa
de 12 px a 8 px en silencio y el ritmo de las seis pantallas se descuadra sin que nadie lo
haya decidido. La spec debe tratarlo como un paso propio.

### Forma, elevación y movimiento

| Token | Valor | Papel |
|---|---|---|
| `--radio-1` | `8px` | Campos, pastillas pequeñas, etiquetas |
| `--radio-2` | `14px` | Botones y tarjetas |
| `--radio-3` | `20px` | Tarjeta destacada y bloque de totales |
| `--radio-pastilla` | `999px` | Etiqueta de situación y origen de línea |
| `--sombra-1` | `0 1px 2px rgba(36,26,21,.06)` | Superficie en reposo |
| `--sombra-2` | `0 2px 8px rgba(36,26,21,.08), 0 8px 24px rgba(36,26,21,.06)` | **Nuevo.** Superficie elevada o enfocada |
| `--sombra-3` | `0 -6px 24px rgba(36,26,21,.12)` | El total pegado al borde inferior en móvil |
| `--transicion-rapida` | `120ms ease-out` | Color, fondo y borde en `hover` y `:active` |
| `--transicion` | `200ms cubic-bezier(.2,.8,.2,1)` | Tamaño, posición y progreso |
| `--toque` | `44px` | Altura mínima de cualquier cosa pulsable (heredado, intocable) |
| `--ancho-contenido` | `68rem` | Ancho máximo de la aplicación |
| `--ancho-texto` | `42rem` | Ancho máximo de un párrafo largo |

**Reglas de forma y movimiento**:

- **Tres radios, tres jerarquías.** El campo y la tarjeta dejan de tener la misma esquina.
- **Tres elevaciones.** Se acaba la sombra única; y la sombra del total deja de ser un valor
  suelto escrito a mano.
- Toda transición sale de los dos tokens. **Con «reducir movimiento» activado en el sistema,
  no hay ninguna.**
- **Dos puntos de ruptura, no uno**: 40rem (móvil → escritorio, ya existe) y 64rem
  (escritorio ancho: más aire, resumen y lista en dos columnas). Nada entre 640 px y un
  monitor de 4K debe verse igual.

### Estados (obligatorios, hoy inexistentes)

| Estado | Cómo se resuelve |
|---|---|
| Reposo | `--sombra-1`, borde `--color-linea` |
| Encima (`hover`) | Cambio perceptible de fondo y borde en `--transicion-rapida`; el principal pasa a `--color-acento-pulsado` |
| Pulsado (`:active`) | El elemento acusa la pulsación: fondo `--color-acento-pulsado` y hundimiento de 1 px |
| Enfocado por teclado | Anillo de 3 px en `--color-acento` con separación de 2 px, **igual en todos los controles** |
| Inactivo | Fondo y borde propios y texto en `--color-tinta-tenue`. **Nunca se apaga con opacidad**, y se acaban las dos opacidades distintas |
| Ocupado | Tratamiento único y reutilizable para «esto está en marcha», el mismo que ya usa la exportación del `.zip` |

### La cara del PDF

Cambia lo mismo que cambió con la 002 —color, aire, jerarquía— con los valores nuevos:

- Banda superior en terracota `#B34A25`; desglose sobre `--color-acento-suave`; reglas de
  tabla en `--color-linea-fuerte`.
- **El total a pagar sube de rango**: es el elemento tipográficamente mayor del documento.
- Importes tabulares alineados a la derecha, aire entre bloques según la escala.
- Los tamaños del documento **dejan de estar escritos a mano en puntos** y pasan a derivar de
  la escala tipográfica, igual que ya ocurre con los colores.

Sigue prohibido, como hoy: imprimir la situación del presupuesto, añadir o quitar bloques,
rótulos o notas, rasterizar el documento y tocar cualquier cifra o redondeo.

---

## Invariantes: lo que no puede cambiar

Esto es la frontera de la propuesta. Si algo de aquí se mueve, el cambio no pertenece a
esta spec:

1. Los cálculos de base, IVA, retención y total, y el redondeo a céntimos half-up.
2. El esquema de datos de `localStorage` y la clave `presupuestospro.datos`.
3. La numeración `AAAA-NNN` y el nombre de los archivos que salen del producto.
4. **Todo lo que el PDF dice**: bloques, orden, rótulos, porcentajes, formato de importes y
   nombre del archivo.
5. El desglose de referencia de la 001: **2.120,00 €**, idéntico en pantalla y en PDF.
6. Las tres situaciones deducidas (Borrador · Vigente · Caducado) y que no se puedan cambiar
   a mano.
7. La tabla del PDF repite cabecera al cambiar de página y el bloque de totales no se parte.
8. Mobile-first: una columna en móvil, 44 px de toque, 16 px de texto, teclado numérico en
   cantidades e importes, tabla de líneas como tarjetas apiladas y total siempre a la vista.
9. Todo en español de España y en euros.
10. Sin backend, sin cuentas y sin que ningún dato salga del navegador.

---

## Criterios de aceptación verificables (sí/no)

Todos se comprueban **usando la aplicación y mirando el PDF**, sin leer código ni ejecutar
comandos (Principio IV). Para los de color se imprime la tabla de paleta de esta propuesta y
se compara a ojo.

### Identidad y jerarquía

- **CA-001** · Recorriendo las seis pantallas, todos los títulos de pantalla usan la misma
  tipografía de titulares y todo lo demás la misma de cuerpo. **Sí / No**
- **CA-002** · En ese recorrido no aparece ningún color que no esté en la tabla de paleta.
  **Sí / No**
- **CA-003** · En el inicio se distingue a simple vista dónde acaba el fondo y dónde empieza
  cada tarjeta, sin acercar la vista. **Sí / No**
- **CA-004** · Se le pide a alguien que no conozca la aplicación que señale el dato más
  importante de un presupuesto abierto: señala el **Total a pagar**. **Sí / No**
- **CA-005** · El título de la pantalla, los títulos de sección y el texto normal se
  distinguen por tamaño sin leer lo que dicen. **Sí / No**
- **CA-006** · Ningún título de sección tiene el mismo tamaño que el párrafo que lo sigue.
  **Sí / No**
- **CA-007** · En una fila de la lista de presupuestos, el importe destaca sobre la etiqueta
  de situación que tiene al lado. **Sí / No**

### Densidad y ritmo

- **CA-008** · Entre dos accesos de la navegación se ve un hueco: no se tocan. **Sí / No**
- **CA-009** · La etiqueta Borrador / Vigente / Caducado tiene aire por encima y por debajo de
  su texto: no parece aplastada. **Sí / No**
- **CA-010** · En un monitor ancho (1440 px o más), la aplicación no aparece como una columna
  estrecha centrada entre dos franjas vacías más anchas que el propio contenido. **Sí / No**
- **CA-011** · En una tablet en horizontal (unos 1024 px), las cinco cifras del resumen de
  actividad no dejan una fila huérfana con una sola cifra. **Sí / No**
- **CA-012** · Bajando por una lista larga de presupuestos, la navegación sigue visible arriba.
  **Sí / No**

### Estados

- **CA-013** · Al pasar el ratón por un botón se aprecia el cambio sin compararlo con una
  captura anterior. **Sí / No**
- **CA-014** · Al pulsar y mantener un botón, el botón acusa la pulsación. **Sí / No**
- **CA-015** · Un botón desactivado se distingue de uno activo y su texto se sigue leyendo sin
  esfuerzo. **Sí / No**
- **CA-016** · Recorriendo una pantalla solo con el tabulador, en todo momento se ve dónde
  está el foco, y el anillo es el mismo en enlaces, botones y campos. **Sí / No**
- **CA-017** · Con «reducir movimiento» activado en el sistema, nada se desplaza ni se atenúa
  progresivamente. **Sí / No**

### Accesibilidad

- **CA-018** · Impresa en blanco y negro, la lista sigue distinguiendo Borrador, Vigente y
  Caducado. **Sí / No**
- **CA-019** · En un teléfono, todo se lee sin hacer zoom y todas las zonas pulsables se
  aciertan con el pulgar. **Sí / No**
- **CA-020** · Ningún mensaje de error se distingue de un texto de ayuda **solo** por el color.
  **Sí / No**

### Lo que no ha cambiado

- **CA-021** · El presupuesto de referencia sigue dando **2.120,00 €** y el mismo número, en
  pantalla y en PDF. **Sí / No**
- **CA-022** · Un presupuesto creado antes del cambio se abre después con las mismas líneas y
  los mismos importes. **Sí / No**
- **CA-023** · El PDF conserva todos sus bloques, rótulos e importes; la tabla larga repite su
  cabecera al cambiar de página y el bloque de totales no se parte. **Sí / No**
- **CA-024** · Puestos uno al lado del otro, la aplicación y el PDF se reconocen como el mismo
  producto. **Sí / No**
- **CA-025** · El `.zip` de 20 presupuestos sigue descargándose, y un PDF no pesa más de un
  20 % de lo que pesaba antes del cambio (se compara en el explorador de archivos).
  **Sí / No**
- **CA-026** · Con la aplicación ya abierta una vez y el modo avión activado, al recargar la
  tipografía sigue siendo la misma: las letras no vienen de internet. **Sí / No**

---

## Decisiones abiertas (para `/speckit-clarify`)

Cada una tiene una recomendación. La spec debe cerrarlas antes del plan.

- **D1 · ¿La tipografía nueva viaja al PDF?** El contrato vigente
  [`pdf-presentacion.md`](../002-inicio-y-rediseno/contracts/pdf-presentacion.md) **prohíbe
  incrustar fuentes**, y jsPDF solo trae Helvetica, Times y Courier de serie.
  *Recomendación*: **no incrustar en esta versión.** El PDF adopta el color, el aire y la
  jerarquía de la dirección, y mantiene las métricas Helvetica. Motivo: una fuente incrustada
  se repite **en cada documento**, igual que el logo, así que el coste en la exportación en
  lote escala con el número de presupuestos (la advertencia que ya está en `CLAUDE.md`).
  Incrustar tipografía merece su propia spec, con presupuesto de peso medido.
- **D2 · ¿Dos familias o una?** `Bricolage Grotesque` es de carácter fuerte y en títulos
  largos en móvil puede resultar ruidosa. *Recomendación*: **dos familias, con la de
  titulares limitada al `h1` y a la marca.** Si en la verificación resulta ruidosa, se cae a
  una sola familia sin rehacer nada más.
- **D3 · ¿Cuántos archivos de fuente entran en el paquete?** *Recomendación*: cuatro como
  máximo —Figtree 400 / 500 / 700 y Bricolage 700—, subconjunto latino, servidos desde la
  propia aplicación. Es la primera vez que el producto añade un recurso externo desde
  `fflate`; hay que justificarlo contra el Principio I igual que se hizo entonces.
- **D4 · ¿Modo oscuro?** *Recomendación*: **fuera.** Esta dirección es papel cálido y el PDF
  es siempre blanco; un tema oscuro duplicaría la paleta sin beneficio para el documento. El
  contrato de la 002 ya lo prohíbe y aquí se mantiene la prohibición, consciente de que es
  una renuncia.
- **D5 · El terracota de la banda del PDF frente al logo del freelancer.** Un logo de colores
  fríos o saturados puede chocar con la banda. *Recomendación*: el acento del documento es
  **fijo** y la banda no se tiñe con el logo; si el choque resulta molesto en la verificación,
  se resuelve con aire y no con un color configurable (personalizar la paleta queda fuera).
- **D6 · ¿Renombrar los tokens de espaciado o reasignar sus valores?** *Recomendación*:
  **renombrar primero**, en un paso propio y verificable, antes de tocar un solo valor
  visual. Ver la tabla de equivalencias.

---

## Fuera de alcance

Escrito para que no se reabra por costumbre. Cada punto necesitaría su propia spec:

- **Modo oscuro, temas alternativos y personalización de la paleta** por parte del freelancer.
- **Incrustar fuentes en el PDF** (ver D1).
- **Iconografía, ilustraciones, imágenes decorativas, degradados y animaciones de entrada.**
- **Cualquier cambio en cálculos, redondeos, esquema de datos, numeración o nombres de
  archivo.**
- **Cualquier cambio en lo que el PDF dice**: bloques, rótulos, notas al pie, numeración de
  páginas.
- **Nuevas situaciones de presupuesto** (enviado, aceptado, rechazado): la 002 ya lo descartó.
- **Gráficas, tendencias o histogramas** en el resumen de actividad. Los cinco recuentos
  siguen siendo cinco números.
- **Restaurar una copia**, exportar a Excel o CSV, y cualquier otra salida de datos.
- **Framework de CSS, librería de componentes, librería de estado o de iconos.** La lista
  cerrada de dependencias sigue en pie.
- **Pruebas automáticas de interfaz o de PDF.** La verificación sigue siendo el guion manual
  que ejecuta una persona.
- **Nuevas pantallas o funcionalidades.** Son las mismas seis.

---

## Impacto en lo ya escrito

| Documento | Qué le pasa |
|---|---|
| [`002/contracts/sistema-visual.md`](../002-inicio-y-rediseno/contracts/sistema-visual.md) | **Se enmienda**: valores nuevos, tokens nuevos (estados, radios, elevaciones, movimiento) y la regla de «sin fuentes externas» pasa a «sin fuentes de terceros, servidas desde la aplicación» |
| [`002/contracts/pdf-presentacion.md`](../002-inicio-y-rediseno/contracts/pdf-presentacion.md) | **Se enmienda** en color, aire y jerarquía. La prohibición de incrustar fuentes se mantiene o se levanta según **D1** |
| [`001/contracts/pdf-documento.md`](../001-presupuestos-freelancer/contracts/pdf-documento.md) | **Intacto.** El contenido del PDF no se toca |
| [`001/contracts/almacen-schema.md`](../001-presupuestos-freelancer/contracts/almacen-schema.md) | **Intacto** |
| [`003/contracts/`](../003-exportar-copia-zip/) | **Intactos.** La copia y sus nombres de archivo no cambian |
| `CLAUDE.md` | Se actualiza: familias tipográficas, dónde viven los archivos de fuente y la nueva escala de espaciado |
| [`specs/README.md`](../README.md) | Nueva fila 004 al terminar el `implement`, no antes |

---

## Riesgos

| # | Riesgo | Cómo se controla |
|---|---|---|
| R1 | La renumeración del espaciado descuadra las seis pantallas en silencio | D6: renombrar en un paso aparte y verificable |
| R2 | El paquete engorda con los archivos de fuente | D3: cuatro archivos como máximo, subconjunto latino |
| R3 | La terracota del PDF choca con el logo del freelancer | D5: acento fijo, se resuelve con aire |
| R4 | Un acento bonito que no llega al contraste mínimo | Ya resuelto: `#B34A25` en lugar de `#C4562F` (4,48:1) |
| R5 | La tipografía de titulares resulta ruidosa en móvil | D2: limitada al `h1` y la marca; caída a una sola familia sin rehacer nada |
| R6 | Las fugas actuales de tokens (`1.75rem`, `200px`, `24rem`, los puntos del PDF) se multiplican | La spec las cierra como parte del trabajo, no «cuando se pueda» |
| R7 | El rediseño toca de refilón un importe o un texto del PDF | CA-021 a CA-023 lo detectan; el desglose de 2.120,00 € es el atajo de siempre |

---

## Cómo se verifica

Un guion manual, en este orden, sobre datos de prueba que incluyan un presupuesto sin líneas,
uno con validez pasada y uno normal:

1. Las seis pantallas en móvil real, sin zoom y con el pulgar.
2. Las seis pantallas en escritorio estrecho, en tablet horizontal y en monitor ancho.
3. Un recorrido completo solo con teclado.
4. La lista impresa en blanco y negro.
5. «Reducir movimiento» activado.
6. El PDF del presupuesto de referencia, al lado del anterior: mismos importes, misma cifra
   de total, otra cara.
7. El `.zip` de 20 presupuestos: se descarga y los tamaños se comparan con los de antes.
8. Modo avión y recarga.

Lo ejecuta una persona y se anota **Sí / No** en cada CA. Ningún CA se da por bueno «a la
vista del código».
