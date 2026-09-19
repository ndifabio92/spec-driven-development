# Quickstart: verificar el rediseño

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

Arrancar, probar y publicar no cambia: sigue siendo lo que explica el [quickstart de la 001](../001-presupuestos-freelancer/quickstart.md) (`npm install`, `npm run dev`, `npm test`, `npm run build`).

Lo que cambia es **qué hay que mirar**. Este guion lo ejecuta una persona usando la aplicación, sin leer código.

## Antes de empezar: guarda el "antes"

Esta funcionalidad se juzga comparando. Con la versión **anterior** todavía en marcha:

1. Crea o abre un presupuesto con dos líneas y un cliente de tipo empresa.
2. Descarga su PDF y **guarda ese archivo aparte**. Es la referencia.
3. Anota su número y su total.

Si ya has actualizado, sirve igual cualquier PDF que hayas descargado antes.

---

## A. La entrada y la navegación (Historia 1 · SC-001, SC-003)

1. Abre la dirección de la aplicación.
2. **Resultado esperado**: lo primero que ves es **Inicio**, no la lista de presupuestos.
3. Desde Inicio, comprueba que llegas a Presupuestos, Clientes, Catálogo y Perfil.
4. Entra en un presupuesto a editarlo y, **sin usar el botón "atrás"**, vete a Perfil. Luego a Catálogo. Luego a Inicio.
5. **Resultado esperado**: en todas las pantallas está la misma barra de secciones, siempre visible, y cada salto es un solo toque.
6. Mira la barra en cada pantalla.
7. **Resultado esperado**: se distingue en qué sección estás, y no solo por el color.
8. Desde Inicio, crea un presupuesto nuevo sin pasar por la lista.

## B. El resumen de actividad (Historia 1 · SC-002)

1. En Inicio, mira el resumen sin pulsar nada.
2. **Resultado esperado**: ves cuántos presupuestos tienes en **Borrador**, **Vigente** y **Caducado**, cuántos clientes y cuántos servicios.
3. Suma los tres recuentos de presupuestos y compáralo con la lista.
4. **Resultado esperado**: coinciden exactamente (FR-018).

## C. Las situaciones (Historia 4)

Prepara tres presupuestos y comprueba su etiqueta:

| Prueba | Cómo prepararla | Resultado esperado |
|---|---|---|
| Vigente | Un presupuesto normal, con líneas y cliente | «Vigente» |
| Borrador | Bórrale todas las líneas a un presupuesto | «Borrador» |
| Caducado | Un presupuesto cuya fecha de validez ya pasó | «Caducado», sin haberlo marcado tú |

5. Abre cualquier presupuesto y busca una forma de cambiar su situación a mano.
6. **Resultado esperado**: **no existe**. La situación se deduce sola (FR-017b).

> Si no tienes ningún presupuesto caducado y no quieres esperar, cambia temporalmente la fecha del sistema para comprobarlo: un presupuesto válido hasta hoy sigue **Vigente** todo el día de hoy, y pasa a **Caducado** mañana.

## D. Que nada se ha roto (SC-004 · FR-014)

1. Abre el presupuesto que anotaste al principio.
2. **Resultado esperado**: mismo número, mismas líneas, mismos cuatro importes. Al céntimo.
3. Recorre las seis pantallas (Inicio, Presupuestos, editar un presupuesto, Clientes, Catálogo, Perfil) y comprueba que **todo lo que se podía hacer antes se sigue pudiendo hacer**: crear, editar y borrar líneas, elegir cliente, activar la retención y elegir 15 % o 7 %, guardar clientes y servicios, subir y quitar el logo.
4. **Resultado esperado**: ninguna acción ha desaparecido, ni se ha escondido, ni cuesta más pasos.
5. Cierra el navegador y vuelve a abrir.
6. **Resultado esperado**: tus presupuestos, clientes, catálogo y perfil siguen ahí, intactos (FR-026).

## E. El PDF (Historia 3 · SC-005)

1. Descarga otra vez el PDF del presupuesto de referencia.
2. Ábrelo **junto al que guardaste al principio**.
3. **Resultado esperado**: se ve mejor, y dice **exactamente lo mismo**. Mismo número, mismas fechas, mismas líneas y mismo desglose al céntimo.
4. Comprueba que no aparece por ninguna parte la palabra «Borrador», «Vigente» ni «Caducado».
5. Selecciona un texto del PDF con el ratón.
6. **Resultado esperado**: se selecciona como texto, no es una imagen.

## F. El PDF largo (FR-022)

1. Crea un presupuesto con líneas suficientes para ocupar más de una página (unas 40).
2. Descarga su PDF.
3. **Resultado esperado**: la tabla continúa en las páginas siguientes **repitiendo su cabecera**, y el bloque de totales **no está partido** entre dos páginas.

## G. Sin logo (FR-023)

1. Quita el logo en Perfil y descarga un PDF.
2. **Resultado esperado**: el documento se genera igual y la cabecera no deja un hueco descuadrado.

## H. La imagen, de un vistazo (SC-006)

1. Recorre las seis pantallas y deja el PDF abierto al lado.
2. **Resultado esperado**: una sola familia tipográfica, unos pocos colores, la misma separación entre bloques en todas partes, y la sensación de que aplicación y documento son el mismo producto.
3. En cualquier formulario, localiza el título, las etiquetas, las ayudas y un mensaje de error.
4. **Resultado esperado**: se distinguen sin esfuerzo.
5. Abre un presupuesto y edita sus líneas.
6. **Resultado esperado**: el **Total a pagar** destaca sobre los demás importes y no se pierde de vista mientras editas.

## I. En blanco y negro (SC-008)

1. Imprime la lista de presupuestos en blanco y negro, o mira una captura en escala de grises.
2. **Resultado esperado**: las etiquetas Borrador, Vigente y Caducado se siguen distinguiendo, porque llevan su palabra escrita y se diferencian también por la forma.

## J. Desde el móvil (FR-012 · SC-007)

1. Repite los apartados A, C y E desde un teléfono.
2. **Resultado esperado**: todo se lee sin zoom, los botones y las secciones de la barra se aciertan con el pulgar a la primera, el teclado numérico aparece en los campos de cantidad e importe, la tabla de líneas se ve como tarjetas apiladas y el total permanece visible mientras editas.

## K. El cronómetro sigue en pie (SC-009)

1. Con perfil y catálogo ya configurados, cronometra desde Inicio la creación de un presupuesto completo y su descarga en PDF.
2. **Resultado esperado**: menos de 5 minutos, igual que antes. El rediseño no ha añadido pasos.

---

## Y las cuentas, ¿quién las vigila?

Las de siempre: `npm test` sigue cubriendo base, IVA, retención, total, redondeo, numeración y formato. Esta versión añade a esa red las pruebas de **la situación de un presupuesto**, que blindan los dos bordes que no se ven mirando la pantalla: que el día de la validez todavía cuenta como vigente, y que un presupuesto incompleto es Borrador aunque su validez haya pasado.
