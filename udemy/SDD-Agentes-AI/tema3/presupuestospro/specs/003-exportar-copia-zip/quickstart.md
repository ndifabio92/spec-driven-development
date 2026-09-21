# Quickstart: verificar la copia de seguridad

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

Arrancar, probar y publicar no cambia: sigue siendo lo que explica el [quickstart de la 001](../001-presupuestos-freelancer/quickstart.md) (`npm install`, `npm run dev`, `npm test`, `npm run build`).

Lo único que se añade al arranque es la dependencia nueva:

```bash
npm install fflate
```

Este guion tiene dos partes. La **A** la ejecuta cualquier persona usando la aplicación, sin leer código. La **B** es un deber del equipo antes de publicar, y su resultado se anota aquí mismo.

---

# Parte A · Verificación por una persona (Principio IV)

## Antes de empezar: monta el escenario

1. En **Perfil**, rellena tus datos y sube un logo.
2. Crea **tres presupuestos completos** (con cliente y con al menos una línea). A uno ponle de cliente `Diseño/Web S.L.`.
3. Crea **un cuarto presupuesto y déjalo a medias**: sin líneas, o sin cliente. En la lista tiene que verse como **Borrador**.
4. Guarda además un par de clientes y un par de servicios en el catálogo.
5. Apunta el número y el total de uno de los presupuestos completos, y **descarga su PDF desde la aplicación**. Ese archivo es la referencia.

## A1. El botón está donde tiene que estar (Historia 1 · FR-001, SC-013)

1. Abre la aplicación. Lo primero que ves es **Inicio**.
2. **Resultado esperado**: el botón **«Exportar todo (.zip)»** está ahí, junto al resumen de actividad, sin tener que entrar en ninguna sección.
3. Ve a **Presupuestos**.
4. **Resultado esperado**: el mismo botón está también en la lista.
5. Pruébalo en el móvil.
6. **Resultado esperado**: se ve y se pulsa con el pulgar en las dos pantallas.

## A2. La copia se descarga y trae lo que promete (Historia 1 · SC-001)

1. Pulsa el botón desde **Inicio**.
2. **Resultado esperado**: se descarga **un único** archivo llamado `presupuestospro-copia-AAAA-MM-DD.zip`, con la fecha de hoy.
3. Descomprímelo con doble clic.
4. **Resultado esperado**: ves **tres** PDF y **un** archivo `datos-presupuestospro.json`. Ni carpetas, ni cuatro PDF.
5. Mira los nombres de los PDF.
6. **Resultado esperado**: tienen la forma `2026-001 - Estudio García.pdf`. El del cliente conflictivo se llama `2026-00X - Diseño-Web S.L..pdf`: la barra ha desaparecido y **los acentos siguen ahí** (FR-011, SC-007).
7. Repite la exportación desde **Presupuestos**.
8. **Resultado esperado**: la copia es la misma. El botón hace lo mismo desde los dos sitios.

## A3. El PDF es el mismo. Al céntimo (Historia 1 · SC-002, SC-003)

Esta es **la** comprobación de la funcionalidad. Si falla, nada de lo demás importa.

1. Abre, uno al lado del otro, el PDF que descargaste al principio desde la aplicación y el del mismo presupuesto dentro del zip.
2. **Resultado esperado**: mismo número, mismo cliente, mismas líneas, mismo desglose, mismo logo y **el mismo total, al céntimo**.
3. Con el ejemplo de referencia de la spec 001 —base imponible de **2.000,00 €** con retención del **15 %**— los dos documentos muestran **2.120,00 €** (SC-002).

> No compares los archivos con una herramienta binaria: no serán iguales byte a byte porque el PDF lleva dentro su fecha de creación. Lo que tiene que coincidir es **lo que se ve y lo que dice**.

## A4. El borrador y el archivo de datos (Historia 2 · FR-009, FR-013, FR-015, FR-018)

1. Busca en el zip un PDF del presupuesto que dejaste a medias.
2. **Resultado esperado**: **no existe**. Solo hay tres PDF, de los tres completos.
3. Vuelve a la aplicación y lee el aviso que salió al terminar la exportación.
4. **Resultado esperado**: dice cuántos presupuestos se han omitido por estar incompletos y que sus datos sí están en la copia.
5. Sin abrir nada todavía, vuelve a leer el mensaje final de la aplicación.
6. **Resultado esperado**: te dice qué es `datos-presupuestospro.json` —la copia que servirá para restaurar— y que **no hace falta que lo abras** (FR-015).
7. Ábrelo de todas formas con el Bloc de notas o TextEdit, solo para mirarlo.
8. **Resultado esperado**: dentro se reconocen tu nombre, tus clientes (los dos del catálogo, no solo los de los presupuestos), tus servicios y **los cuatro presupuestos**, borrador incluido. Arriba del todo aparecen `"aplicacion": "PresupuestosPro"`, `"formatoCopia": 1` y la fecha y hora de la exportación (FR-014a).

## A5. El aviso de datos personales (FR-018a · SC-012)

1. Mira el mensaje que aparece al terminar la exportación.
2. **Resultado esperado**: además de «copia lista», te advierte de que el archivo contiene datos personales tuyos y de tus clientes y de que conviene guardarlo en lugar seguro.
3. Comprueba que no te ha pedido confirmación antes de descargar.
4. **Resultado esperado**: no. El aviso informa, no estorba.

## A6. Que no se ha tocado nada (SC-004 · FR-021)

1. Vuelve a **Inicio** y mira el resumen de actividad.
2. **Resultado esperado**: los mismos recuentos de Borrador, Vigente, Caducado, clientes y servicios que antes de exportar.
3. Abre el presupuesto que apuntaste al principio.
4. **Resultado esperado**: mismo número, mismas líneas, mismo total.
5. Crea un presupuesto nuevo y añádele una línea.
6. **Resultado esperado**: recibe el número que le tocaba igualmente. Exportar no ha consumido ninguno.
7. Cierra el navegador, vuelve a abrirlo y entra otra vez.
8. **Resultado esperado**: todo sigue en su sitio.

## A7. Cuando no hay nada que exportar (Historia 3 · SC-005, SC-006)

1. Abre la aplicación en un navegador **limpio**, sin nada guardado (una ventana privada sirve).
2. Pulsa el botón.
3. **Resultado esperado**: un aviso de que no hay nada que exportar. **No se descarga ningún archivo** (FR-016).
4. Ahora rellena solo el **Perfil** y guarda un servicio en el catálogo. Sigue sin haber ningún presupuesto.
5. Pulsa el botón.
6. **Resultado esperado**: la copia **sí** se descarga: trae el archivo de datos y ningún PDF, y te avisa de que no había presupuestos (FR-017).

## A8. Que se vea que está trabajando (Historia 3 · SC-008)

Para este paso hace falta volumen. Si no tienes 50 presupuestos a mano, sáltalo y cúbrelo con la Parte B.

1. Con más de **50** presupuestos, pulsa el botón.
2. **Resultado esperado**: antes de **2 segundos** ves que está trabajando, y el progreso **avanza** durante la espera en vez de quedarse quieto.
3. Mientras avanza, vuelve a pulsar el botón.
4. **Resultado esperado**: no ocurre nada. No se lanza una segunda exportación ni se descargan dos archivos (FR-003).

---

# Parte B · Deberes del equipo antes de publicar

## B1. Las pruebas automáticas

```bash
npm test
```

Además de las que ya había, cubren los nombres de archivo de la copia (`nombresCopia.test.ts`) y que el sobre envuelve los datos **sin alterarlos** (`sobreCopia.test.ts`).

## B2. Medir el límite de volumen (FR-020a)

La spec no fija un tope porque sería una cifra sin medir. **Este es el procedimiento para medirla, y su resultado se anota abajo.**

Lo que manda no es el número de presupuestos: es **ese número multiplicado por el tamaño del logo**, porque el logo se incrusta entero en cada PDF ([Decisión 3 de research.md](./research.md)). Por eso se mide con dos logos distintos.

1. Prepara un perfil con un **logo ligero** (unos 50 kB) y genera presupuestos completos hasta **50**, **100** y **200**. Exporta en cada escalón. **El escalón de 200 con logo ligero es el que acredita SC-009**, que está acotado a logos de hasta 100 kB.
2. Anota, en cada escalón: cuánto tarda, cuánto pesa el zip y si termina.
3. Repite lo mismo con un **logo pesado** (cerca del máximo de 1 MB).
4. Sube el volumen hasta que la exportación falle.
5. **Resultado esperado del fallo**: el freelancer ve el aviso de que la copia no se ha podido generar, **no** se descarga un archivo a medias y sus datos siguen intactos (FR-020, FR-020a).
6. Repite el escalón que falle en un **móvil**, que es donde hay menos memoria.

### Resultado de la medición

> **Pendiente de la implementación.** Rellenar esta tabla antes de publicar y dejar escrito el equipo y el navegador en que se midió.

| Logo | Presupuestos | ¿Termina? | Tiempo | Tamaño del zip | Equipo / navegador |
|---|---|---|---|---|---|
| ~50 kB | 50 | | | | |
| ~50 kB | 200 | | | | |
| ~1 MB | 50 | | | | |
| ~1 MB | 200 | | | | |
| | **Límite encontrado** | | | | |

## B3. Que la copia se abra fuera de casa (SC-007)

Descomprimir el mismo zip —el que lleva el cliente `Diseño/Web S.L.`— en **Windows** y en **macOS**, con el descompresor del sistema, sin instalar nada.

**Resultado esperado**: se abre en los dos, y el nombre del PDF conserva la eñe y los acentos.
