# Research: Exportar todos mis presupuestos en un .zip

**Fecha**: 2026-09-19
**Spec**: [spec.md](./spec.md)
**Constitución aplicada**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

## Punto de partida

La clarificación de la spec dejó tres deberes explícitos para este documento:

1. Justificar la dependencia de compresión contra el Principio I y elegir la más pequeña que resuelva el requisito.
2. Medir el volumen máximo que aguanta la exportación y dejarlo escrito.
3. Fijar la forma de la marca de identidad del archivo de datos.

A los tres se suma una restricción que manda sobre todo lo demás: **el PDF no puede cambiar** (FR-007). Cualquier decisión que obligue a reconstruir el documento por otro camino queda descartada de entrada.

---

## Decisión 1 — Se añade `fflate` para construir el archivo comprimido

**Decisión**: incorporar `fflate` (MIT) como quinta dependencia de producción y única añadida desde la spec 001.

**Qué significa para el negocio**: el botón produce un `.zip` normal y corriente, que se abre con doble clic en Windows, macOS y Linux sin instalar nada, y que además ocupa bastante menos que la suma de lo que contiene.

**Por qué hace falta algo**: el navegador sabe **comprimir** datos en bruto (`CompressionStream`), pero no sabe construir un **archivo `.zip`**, que es otra cosa: cabeceras por archivo, sumas de verificación, un directorio central al final y banderas de codificación para que los acentos sobrevivan. Eso hay que escribirlo o traerlo.

**Por qué `fflate` y no otra**: se compararon las tres candidatas reales, midiendo el paquete publicado el 19/09/2026.

| Candidata | Versión | Licencia | Dependencias transitivas | ¿Comprime? | Veredicto |
|---|---|---|---|---|---|
| **`fflate`** | 0.8.3 | MIT | **0** | Sí (deflate) | **Elegida** |
| `client-zip` | 2.5.1 | MIT | 0 | **No**: solo empaqueta | Descartada |
| `jszip` | 3.10.2 | MIT o GPL-3.0 | **4** (`pako`, `lie`, `setimmediate`, `readable-stream`) | Sí | Descartada |

Solo `fflate` cumple las dos condiciones a la vez: **no arrastra nada detrás** y **comprime de verdad**.

- `jszip` es la opción más conocida, y por eso la tentación por defecto. Añadirla significa meter cinco paquetes donde basta uno. Contra el Principio I no hay discusión posible.
- `client-zip` es aún más pequeña (6,5 kB) y encaja con la idea de "lo mínimo". Pero su propia documentación lo dice sin rodeos: no comprime, solo concatena. Un freelancer que exporta una copia y ve que el `.zip` pesa lo mismo que la suma de sus archivos concluye, con razón, que algo no funciona.

**Alternativa descartada — escribirlo a mano**: técnicamente posible sobre `CompressionStream('deflate-raw')`, que todos los navegadores objetivo soportan. Serían unas 150 líneas: cabecera local por archivo, CRC32 propio, directorio central, y la bandera de nombre en UTF-8 que hay que activar para que «Diseño/Web S.L.» se descomprima bien en un Windows español. Es **más** código propio del que ahorra, concentrado precisamente en el formato binario donde un fallo no se ve hasta que el freelancer intenta abrir su copia. El Principio I pide la solución más simple, no la que tiene menos líneas en `package.json`.

**Comprobado, no supuesto**: `fflate` marca el nombre de archivo como UTF-8 cuando contiene caracteres no ASCII, que es la condición para que los acentos se extraigan correctamente fuera de España. El guion de verificación lo comprueba igualmente en Windows y macOS (SC-007).

---

## Decisión 2 — Los PDF del zip salen de la misma función que los individuales

**Decisión**: `exportarCopia.ts` llama a `construirDocumento(presupuesto, perfil)` —la función que ya existe en `src/pdf/generarPdf.ts`— y le pide los bytes del documento. No se escribe ninguna variante del generador para la exportación.

**Qué significa para el negocio**: el PDF que el cliente recibe por email y el que queda archivado en la copia son el mismo documento. No pueden separarse con el tiempo porque no hay dos sitios donde mantenerlos.

**Por qué**: FR-007 exige que coincidan al céntimo y hasta la última línea. Hay dos maneras de conseguirlo: comprobarlo o hacerlo imposible. Comprobarlo exige una prueba que compare documentos, y esa prueba envejece mal. Reutilizar la función lo convierte en una propiedad de la estructura: solo existe un camino que produzca un PDF.

**Matiz honesto sobre la palabra "idéntico"**: dos PDF generados en momentos distintos no son iguales **byte a byte**, porque el documento lleva dentro su fecha de creación. Son idénticos en lo que se ve y en lo que dice: número, líneas, desglose, importes y maquetación. La verificación (SC-003) es mirar los dos documentos, no compararlos con una herramienta binaria.

**Alternativas descartadas**:

- *Guardar el PDF al generarlo y reutilizar el guardado*: obligaría a escribir en el almacenamiento, que ya está al límite de su capacidad, y rompería FR-021 (exportar no escribe nada).
- *Un generador "en lote" optimizado*: sería un segundo camino hacia el documento, exactamente lo que este diseño quiere evitar.

---

## Decisión 3 — El límite no lo marca el número de presupuestos, sino el logo

**Decisión**: el plan no fija un tope de presupuestos. Empaqueta **en streaming** —un documento entra en el archivo y se suelta antes de construir el siguiente— y deja escrito en [quickstart.md](./quickstart.md) el procedimiento para medir el techo real antes de publicar.

**El hallazgo**: el volumen de partida está acotado y es pequeño. Todo lo que el freelancer tiene guardado cabe en el almacenamiento del navegador, que ronda los **5 MB**; ese es el tamaño máximo del archivo de datos, logo incluido. El problema no está ahí.

Está en los PDF: **el logo del perfil se incrusta entero en cada documento**. Con un logo de 500 kB y 200 presupuestos, los documentos generados suman unos 100 MB aunque los datos de origen ocupen 3 MB. El factor que manda no es el número de presupuestos, sino **ese número multiplicado por el tamaño del logo**.

**Qué significa para el negocio**: dos freelancers con los mismos 200 presupuestos pueden tener experiencias muy distintas según el logo que subieran en su día. El del logo ligero exporta sin enterarse; el del logo de 1 MB es quien puede encontrarse el límite. Es contraintuitivo y conviene que esté escrito, porque es lo primero que hay que mirar si alguien reporta que la exportación falla.

**Por qué streaming**: si se construyeran los 200 documentos y luego se empaquetaran, el pico de memoria sería la suma de todos los PDF **más** el archivo final. Entregando cada documento al empaquetador según se construye, el pico lo marca el archivo final más un documento. No elimina el techo —el resultado tiene que caber entero en memoria para poder descargarse— pero lo baja a la mitad larga con el mismo esfuerzo.

**Por qué no se fija una cifra aquí**: cualquier número que se escribiera ahora sería una estimación de despacho, y quedaría en la spec con la apariencia de un dato medido. El procedimiento de medida está en el quickstart y su resultado se anota ahí mismo, con el equipo y el dispositivo en que se midió.

**Alternativa descartada — trocear la copia en varios archivos**: elimina el techo, pero rompe la promesa central de la spec («un único .zip») y complica tanto descomprimir como la futura restauración. La spec lo descarta expresamente.

---

## Decisión 4 — La interfaz cede el control entre presupuesto y presupuesto

**Decisión**: el bucle de exportación devuelve el control al navegador después de cada documento, y actualiza el progreso con el número de presupuestos ya empaquetados.

**Qué significa para el negocio**: la barra de progreso avanza de verdad en lugar de aparecer congelada al final, y el freelancer con 200 presupuestos ve que la aplicación está trabajando en vez de pensar que se ha colgado.

**Por qué**: generar un PDF es una operación que ocupa el hilo con el que se pinta la pantalla. Un bucle cerrado de 200 documentos deja la interfaz muerta: el progreso que se calcula no llega a dibujarse nunca. Cediendo el control entre documento y documento, cada paso se pinta. Cuesta una línea.

**Alternativa descartada — un Web Worker**: mantendría la interfaz perfectamente fluida, pero obliga a mover el generador de PDF fuera del hilo principal, con su propio empaquetado y el logo viajando entre hilos. Es una capa de infraestructura para un problema que se resuelve cediendo el control, y el Principio I la descarta.

---

## Decisión 5 — El archivo de datos es un sobre alrededor de lo guardado

**Decisión**: el archivo de datos es `datos-presupuestospro.json`, en la raíz del zip, con esta forma:

```json
{
  "aplicacion": "PresupuestosPro",
  "formatoCopia": 1,
  "exportadoEl": "2026-09-19T18:04:22.118Z",
  "datos": { "...el documento guardado, tal cual..." }
}
```

**Qué significa para el negocio**: la copia se identifica a sí misma. El día que exista la restauración, podrá decir «esto no es una copia de PresupuestosPro» o «esta copia viene de una versión más nueva que tu aplicación» en lugar de intentar leerla y dejar los datos a medias.

**Por qué un sobre y no campos sueltos**: porque `datos` sale **sin tocar**, exactamente como estaba en el almacenamiento. Restaurar será validar el sobre y devolver `datos` a su sitio, sin traducir nada. Si la marca se mezclara con el documento, habría que separarla al restaurar, y ahí es donde aparecen los errores.

**Sobre los dos números de versión**: `formatoCopia` describe el sobre; `datos.version` —que ya existe desde la spec 001— describe el documento de datos. Son dos cosas que pueden cambiar por separado: el sobre cambia si algún día la copia lleva algo más, y el documento cambia si cambia el modelo de datos. Mezclarlos en un solo número obligaría a subirlo por motivos que no tienen nada que ver entre sí.

**Por qué ahora y no en la spec de restaurar**: porque las copias que el freelancer haga estos meses ya no se pueden cambiar. Una copia sin marca nace huérfana y lo será siempre. El coste hoy es de tres campos.

**Alternativas descartadas**:

- *Guardar solo la versión del formato*: distingue incompatibilidades, pero no distingue una copia de PresupuestosPro de cualquier otro archivo JSON que el freelancer arrastre por error.
- *Nada*: ahorra tres campos hoy y obliga a adivinar mañana, con los datos del freelancer de por medio.

---

## Decisión 6 — Los nombres de archivo son una regla de dominio, con pruebas

**Decisión**: el nombre del zip y el de cada PDF se calculan en `src/dominio/nombresCopia.ts`, con pruebas automáticas, igual que los cálculos y la numeración.

**Qué significa para el negocio**: un nombre mal construido no da un error visible: da un archivo que no se descomprime, o dos presupuestos que se pisan y uno que desaparece de la copia sin que nadie se entere hasta que hace falta. El daño se parece mucho al de un número mal calculado, y por eso se trata igual.

**Por qué en `dominio/`**: la regla es determinista, no depende del navegador y se puede comprobar con entradas y salidas. Es la definición de lo que en este proyecto vive en `dominio/` y lleva pruebas.

**Reglas exactas**: están en [contracts/estructura-copia.md](./contracts/estructura-copia.md). En resumen: se sustituyen los caracteres que ningún sistema de archivos admite, se conservan los acentos, se recorta el nombre del cliente si es excesivo, el número nunca se toca y, si dos nombres coincidieran, se numeran para que no se pisen.

---

## Lo que este documento NO decide

- **Cómo se restaura una copia**: fuera de alcance por spec. Aquí solo se fija el formato que lo hará posible.
- **El tamaño máximo del logo**: sigue siendo el de la spec 001 (1 MB). Esta funcionalidad lo señala como el factor que manda en el límite de volumen, pero no lo cambia.
- **La cifra concreta del límite**: se mide y se anota en el quickstart, no se estima aquí.
