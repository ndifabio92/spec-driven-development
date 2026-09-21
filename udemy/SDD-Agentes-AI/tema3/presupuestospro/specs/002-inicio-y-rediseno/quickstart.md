# Quickstart: verificar la dirección «Mediterráneo»

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

Arrancar, probar y publicar no cambia: sigue siendo lo que explica el [quickstart de la 001](../001-presupuestos-freelancer/quickstart.md) (`npm install`, `npm run dev`, `npm test`, `npm run build`).

Lo que cambia es **qué hay que mirar**. Este guion lo ejecuta una persona usando la aplicación, sin leer código. Se anota **Sí / No** en cada criterio, y ninguno se da por bueno «a la vista del código».

## Antes de empezar: guarda el «antes»

Esta revisión se juzga comparando. Con la versión **anterior** todavía en marcha:

1. Crea o abre un presupuesto con dos líneas y un cliente de tipo empresa. Anota su número y su total.
2. Descarga su PDF y **guarda ese archivo aparte**. Es la referencia.
3. **Anota el tamaño de ese PDF** (el que muestra el explorador de archivos) y **cuántas páginas tiene**.
4. Haz una captura de la pantalla de inicio y otra de un presupuesto abierto. Son la referencia del paso 1 del renombrado.
5. Ten preparados, además: un presupuesto sin líneas, uno con la validez ya pasada, uno de unas 40 líneas y un logo de colores fríos (azul o verde) en el perfil.

Si ya has actualizado, sirve igual cualquier PDF que hayas descargado antes.

---

## Parte 0 · El renombrado que no se tiene que ver (FR-041)

**Se ejecuta al terminar el bloque 1 del plan, antes de tocar un solo valor visual.** Es el único apartado cuyo resultado esperado es que no pase nada.

1. Abre la aplicación y ponla al lado de las capturas del punto 4.
2. Recorre el inicio y un presupuesto abierto.
3. **Resultado esperado**: **no se aprecia ninguna diferencia** respecto a las capturas. Ni un hueco, ni un relleno, ni una separación.
4. **Si algo se ha movido, hay un error de renombrado**: hay que corregirlo antes de seguir. No es un cambio de diseño, porque todavía no se ha cambiado ningún valor.

> Por qué este apartado existe: cambiar nombre y valor a la vez significa que ninguna diferencia es atribuible. Con más de cien usos en la hoja de estilos, un error de renombrado quedaría escondido detrás de un cambio de diseño y se descubriría en producción.

---

## Parte A · La entrada y la navegación (Historia 1 · SC-001, SC-003, SC-014, SC-018)

1. Abre la dirección de la aplicación. **Esperado**: lo primero que ves es **Inicio**, no la lista.
2. Desde Inicio, comprueba que llegas a Presupuestos, Clientes, Catálogo y Perfil.
3. Entra en un presupuesto a editarlo y, **sin usar el botón "atrás"**, vete a Perfil. Luego a Catálogo. Luego a Inicio. **Esperado**: la barra está en todas las pantallas y cada salto es un solo toque.
4. Mira la barra en cada pantalla. **Esperado**: se distingue en qué sección estás, y no solo por el color.
5. Mira el espacio entre dos accesos de la barra. **Esperado (SC-014)**: se ve un hueco; **no se tocan**.
6. Baja por una lista larga de presupuestos. **Esperado (SC-018)**: la barra **sigue visible arriba** sin volver arriba.
7. Desde Inicio, crea un presupuesto nuevo sin pasar por la lista.
8. En un **móvil**, repite el punto 6 mientras editas las líneas de un presupuesto. **Esperado**: la barra arriba y el total abajo dejan sitio suficiente para escribir. Si no lo dejan, hay que dejar de anclar la barra en móvil (está previsto en [contracts/navegacion.md](./contracts/navegacion.md)); esconder accesos **no** es una salida válida.

## Parte B · El resumen de actividad (Historia 1 · SC-002, SC-017)

1. En Inicio, mira el resumen sin pulsar nada. **Esperado**: ves cuántos presupuestos tienes en **Borrador**, **Vigente** y **Caducado**, cuántos clientes y cuántos servicios.
2. Suma los tres recuentos y compáralo con la lista. **Esperado**: coinciden exactamente (FR-018).
3. Abre el inicio en una **tablet en horizontal** (unos 1024 px) y en un escritorio estrecho. **Esperado (SC-017)**: en ninguna anchura queda una fila con **una sola cifra** suelta.

## Parte C · Las situaciones (Historia 4 · SC-008, SC-015)

| Prueba | Cómo prepararla | Resultado esperado |
|---|---|---|
| Vigente | Un presupuesto normal, con líneas y cliente | «Vigente», ahora en **oliva** |
| Borrador | Bórrale todas las líneas a un presupuesto | «Borrador», en neutro y con contorno discontinuo |
| Caducado | Un presupuesto cuya fecha de validez ya pasó | «Caducado», sin haberlo marcado tú |

4. Mira de cerca cualquier etiqueta. **Esperado (SC-015)**: tiene aire por encima y por debajo de su texto; **no parece aplastada**.
5. Abre cualquier presupuesto y busca una forma de cambiar su situación a mano. **Esperado**: **no existe** (FR-017b).
6. Imprime la lista en blanco y negro, o mírala en escala de grises. **Esperado (SC-008)**: las tres etiquetas se siguen distinguiendo, porque llevan su palabra escrita y se diferencian también por la forma.

> Si no tienes ningún presupuesto caducado y no quieres esperar, cambia temporalmente la fecha del sistema: un presupuesto válido hasta hoy sigue **Vigente** todo el día de hoy y pasa a **Caducado** mañana.

## Parte D · Que nada se ha roto (SC-004 · FR-014)

1. Abre el presupuesto que anotaste al principio. **Esperado**: mismo número, mismas líneas, mismos cuatro importes. Al céntimo.
2. Recorre las seis pantallas y comprueba que **todo lo que se podía hacer antes se sigue pudiendo hacer**: crear, editar y borrar líneas, elegir cliente, activar la retención y elegir 15 % o 7 %, guardar clientes y servicios, subir y quitar el logo, exportar la copia en `.zip`.
3. **Esperado**: ninguna acción ha desaparecido, ni se ha escondido, ni cuesta más pasos.
4. Cierra el navegador y vuelve a abrir. **Esperado**: tus presupuestos, clientes, catálogo y perfil siguen ahí, intactos (FR-026).
5. Ejecuta `npm test`. **Esperado**: todo en verde. Esta revisión **no añade ni cambia ninguna prueba**: si algo falla, se ha tocado el dominio, que debía quedar intacto.

## Parte E · La identidad y la jerarquía (Historia 2 · SC-006, SC-010 … SC-013, SC-027)

Ten la tabla de paleta de [contracts/sistema-visual.md](./contracts/sistema-visual.md) impresa al lado.

1. Recorre las seis pantallas. **Esperado (SC-006)**: cuentas **dos** familias tipográficas —una en los títulos de pantalla y la marca, otra en todo lo demás— y **ningún color que no esté en la tabla**.
2. Mira la pantalla de inicio sin acercarte. **Esperado (SC-010)**: distingues dónde acaba el fondo y dónde empieza cada tarjeta.
3. En cualquier formulario, localiza el título de pantalla, los títulos de bloque, las etiquetas, las ayudas y un mensaje de error. **Esperado (SC-012)**: se distinguen por tamaño sin leer lo que dicen, y **ningún título de bloque tiene el mismo tamaño que el párrafo que le sigue**.
4. Pide a alguien que no conozca la aplicación que señale el dato más importante de un presupuesto abierto. **Esperado (SC-011)**: señala el **Total a pagar**.
5. Mira una fila de la lista de presupuestos. **Esperado (SC-013)**: el importe destaca sobre la etiqueta de situación que tiene al lado.
6. Mira dos importes en filas consecutivas. **Esperado (SC-027)**: las cifras quedan alineadas en columna, sin bailar de anchura.
7. Abre un presupuesto y edita sus líneas. **Esperado**: el **Total a pagar** destaca sobre los demás importes y no se pierde de vista mientras editas.
8. Comprueba que un mensaje de error se distingue de un texto de ayuda por algo más que el color. **Esperado (SC-024)**: Sí.

## Parte F · Los estados (Historia 5 · SC-019 … SC-023)

1. Pasa el ratón por un botón, por un acceso de la barra y por un acceso del inicio. **Esperado (SC-019)**: aprecias el cambio **sin compararlo con una captura anterior**.
2. Pulsa y mantén un botón. **Esperado (SC-020)**: el botón acusa la pulsación.
3. Busca un botón desactivado (por ejemplo, descargar el PDF de un presupuesto sin líneas). **Esperado (SC-021)**: se distingue de uno activo y **su texto se sigue leyendo sin esfuerzo**; no está simplemente apagado.
4. Recorre una pantalla con formulario **solo con el tabulador**. **Esperado (SC-022)**: en todo momento ves dónde está el foco, y el indicador es **el mismo** en enlaces, botones y campos.
5. Mira el contorno de un campo de texto. **Esperado**: se ve que ahí se puede escribir, sin tener que pulsar para descubrirlo.
6. Exporta la copia en `.zip`. **Esperado**: mientras trabaja se ve que está en marcha, con el mismo tratamiento que cualquier otra espera del producto.
7. Activa **«reducir movimiento»** en tu sistema y recarga. Repite los puntos 1 a 4. **Esperado (SC-023)**: nada se desplaza ni se atenúa progresivamente, y **todos los estados siguen siendo perceptibles**.

## Parte G · Del móvil al monitor grande (Historia 6 · SC-007, SC-016)

1. Abre la aplicación en un **monitor de 1440 px o más**. **Esperado (SC-016)**: no aparece como una columna estrecha centrada entre dos franjas vacías más anchas que el contenido.
2. Lee un párrafo largo en ese monitor. **Esperado**: la línea no cruza la pantalla entera.
3. Cambia el tamaño de la ventana poco a poco desde ancho hasta estrecho. **Esperado**: el contenido se recoloca sin que nada se salga y **sin desplazamiento horizontal** en ningún momento.
4. Repite las partes A, C y E desde un **teléfono**. **Esperado (SC-007)**: todo se lee sin zoom, los botones y los accesos se aciertan con el pulgar a la primera, el teclado numérico aparece en cantidad e importe, la tabla de líneas se ve como tarjetas apiladas y el total permanece visible mientras editas.

## Parte H · El PDF (Historia 3 · SC-005, SC-025, SC-026)

1. Descarga otra vez el PDF del presupuesto de referencia y ábrelo **junto al que guardaste al principio**.
2. **Esperado (SC-005)**: se ve mejor y dice **exactamente lo mismo**. Mismo número, mismas fechas, mismas líneas y mismo desglose al céntimo. El total de referencia sigue siendo **2.120,00 €**.
3. Mira el documento nuevo de un vistazo. **Esperado**: el **Total a pagar** es el elemento **más grande** del documento, por encima del número del presupuesto.
4. Comprueba que no aparece por ninguna parte la palabra «Borrador», «Vigente» ni «Caducado» (FR-029).
5. Selecciona un texto del PDF con el ratón. **Esperado**: se selecciona como texto, no es una imagen.
6. Compara el **número de páginas** con el que anotaste. **Esperado**: el mismo. Si ha crecido, algún tamaño no ha salido de la escala.
7. Compara el **tamaño del archivo** con el que anotaste. **Esperado (SC-026)**: no pesa más de un **20 %** por encima.
8. Pon el PDF nuevo al lado de la aplicación. **Esperado (SC-006)**: se reconocen como el mismo producto por su color, su aire y su jerarquía. *La letra no es exactamente la misma, y está decidido que sea así* (D1).

## Parte I · El PDF largo (FR-022)

1. Descarga el PDF del presupuesto de unas 40 líneas.
2. **Esperado**: la tabla continúa en las páginas siguientes **repitiendo su cabecera**, y el bloque de totales **no está partido** entre dos páginas.
3. **Atención especial en esta revisión**: el total ha subido de 14 pt a 18 pt, así que el bloque de totales ocupa más alto que antes. Es el requisito con más riesgo de romperse; si se parte, hay que empujar el bloque entero a la página siguiente.

## Parte J · Sin logo y con logo que choca (FR-023 · Historia 3, escenario 7)

1. Quita el logo en Perfil y descarga un PDF. **Esperado**: se genera igual y la cabecera no deja un hueco descuadrado.
2. Pon el logo de colores fríos y descarga otro. **Esperado**: el logo y la banda de la cabecera se leen bien, separados por aire. La banda **no** se tiñe con los colores del logo (D5).

## Parte K · Sin conexión (SC-028)

1. Con la aplicación ya abierta una vez, activa el **modo avión** y recarga la página.
2. **Esperado**: la tipografía sigue siendo la misma. **Las letras no vienen de internet.**
3. Si cambian a la letra del sistema, algún archivo de tipografía se está pidiendo a un tercero, y eso incumple FR-035 y el Principio V.

## Parte L · El cronómetro sigue en pie (SC-009)

1. Con perfil y catálogo ya configurados, cronometra desde Inicio la creación de un presupuesto completo y su descarga en PDF.
2. **Esperado**: menos de 5 minutos, igual que antes. La revisión no ha añadido pasos.

---

## Y las cuentas, ¿quién las vigila?

Las de siempre: `npm test` sigue cubriendo base, IVA, retención, total, redondeo, numeración, formato, la situación de un presupuesto y los nombres de los archivos de la copia.

**Esta revisión no añade ni una prueba automática, y eso es intencionado**: no añade ni una regla de dominio. Si al terminar `npm test` no está en verde, no es que falte una prueba nueva: es que se ha tocado algo que debía quedar intacto.
