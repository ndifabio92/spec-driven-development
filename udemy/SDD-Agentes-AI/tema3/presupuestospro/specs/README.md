# Estado del producto — PresupuestosPro

Índice de las specs construidas, en orden. Cada fila dice **qué aporta** esa versión
al freelancer y **en qué punto está**. El detalle vive en la carpeta de cada spec;
aquí solo está lo que hace falta para saber por dónde va el producto.

> Se actualiza al terminar cada `/speckit-implement`, no antes.

| # | Nombre | Qué aporta | Estado | Rama |
|---|---|---|---|---|
| **001** | [Presupuestos para freelancers](./001-presupuestos-freelancer/spec.md) (v0) | El producto entero: perfil con logo, clientes, catálogo de servicios, presupuestos con IVA y retención de IRPF calculados solos, numeración `AAAA-NNN` y descarga en PDF. Todo en el navegador, sin cuentas ni servidor | **Implementada**, pendiente de verificar y publicar: quedan la verificación manual completa (T043) y el despliegue de `dist/` (T042).<br>**Modificada por la 002** en su capa visual y en su punto de entrada; el contenido del PDF, los cálculos y el esquema de datos siguen siendo los suyos, intactos | `001-presupuestos-freelancer` |
| **002** | [Pantalla de inicio e imagen «Mediterráneo»](./002-inicio-y-rediseno/spec.md) (v1.1 → v1.3) | Una pantalla de inicio con resumen de actividad, navegación común visible y la situación de cada presupuesto (Borrador · Vigente · Caducado) deducida de lo ya guardado. **Reescrita en la v1.3**: el sistema visual sobrio pero genérico se sustituye por la dirección «Mediterráneo» —neutros cálidos, terracota para lo pulsable, oliva para lo vigente, dos tipografías servidas desde el propio alojamiento, escala de espaciado completa, tres esquinas, tres elevaciones y los seis estados de interacción—, en pantalla y en el PDF | **v1.1 implementada**; **v1.3 implementada, pendiente de verificar**: queda ejecutar el [quickstart](./002-inicio-y-rediseno/quickstart.md) entero anotando Sí/No en los 28 criterios (T062), y la comprobación en un móvil real de que la barra anclada no estorba al editar (T051).<br>**Modifica la 001**: la entrada deja de ser la lista (`#/` → Inicio, la lista pasa a `#/presupuestos`) y el PDF cambia de cara. **No sustituye** [`pdf-documento.md`](./001-presupuestos-freelancer/contracts/pdf-documento.md): el contenido lo sigue fijando la 001 | `002-inicio-y-rediseno` |
| **003** | [Exportar todos mis presupuestos en un .zip](./003-exportar-copia-zip/spec.md) (v1.2) | La primera salida de datos del producto: un botón que descarga un único `.zip` con un PDF por cada presupuesto completo y un archivo de datos con todo lo guardado, listo para restaurar el día que exista esa funcionalidad | **Implementada**, pendiente de verificar: quedan los tres guiones que ejecuta una persona — Parte A del quickstart (T027), la medición del límite de volumen (T028) y descomprimir en Windows y macOS (T029) | `003-exportar-copia-zip` |

> **Sobre las ramas**: los nombres son los que declara cada spec. Hoy el repositorio
> solo tiene `master` y todo el trabajo está ahí; las ramas no llegaron a crearse.

## Cómo se relacionan

- **La 002 no toca lo que la 001 decidió, solo cómo se ve.** Su propia regla lo dice:
  si un cambio altera un cálculo, un dato guardado o lo que *dice* el PDF, no pertenece
  a esa spec. Por eso el desglose de referencia —**2.120,00 €**— sigue saliendo igual en
  las tres versiones, y es la comprobación que las ata.
- **La 003 no sustituye ni modifica nada.** Es de solo lectura: consulta el almacén sin
  escribir (FR-021), reutiliza `construirDocumento()` de la 001 en vez de generar el PDF
  por otro camino, y pregunta por la situación a la función de la 002 en lugar de
  redefinirla. Lo único que añade a una spec anterior es el botón en dos pantallas que
  creó la 002.
- **La 003 sí abre una excepción de proyecto**: `fflate` es la primera dependencia
  añadida desde la 001 y la primera grieta en la lista cerrada de dependencias. Está
  justificada en su *Complexity Tracking* y anotada en `CLAUDE.md`. La regla sigue en
  pie: la siguiente también tendrá que justificarse.
- **La 002 en su v1.3 abre la segunda, y de otro tipo**: dos archivos de tipografía y su
  licencia entran en el producto. **No son un paquete de npm**, así que la lista cerrada de
  dependencias no se amplía, pero sí es un activo añadido y está justificado por escrito en
  su *Complexity Tracking*. Se quedan en dos frente al tope de cuatro que fijaba la spec,
  porque una fuente variable da los tres grosores en un solo archivo.

## Lo que sigue fuera de alcance

Escrito aquí para que no se reabra por costumbre. Cada una necesitaría su propia spec:

- **Restaurar una copia.** La 003 fija el formato que lo hará posible
  ([`archivo-datos.md`](./003-exportar-copia-zip/contracts/archivo-datos.md)), nada más.
- **Registrar si un presupuesto se envió, se aceptó o se rechazó.** La 002 lo descartó
  expresamente: solo se reconocen las situaciones deducibles de lo ya guardado.
- **Exportar a Excel o CSV, copias automáticas y enviar el zip a ningún sitio.**
- **Cuentas, servidor o sincronización entre dispositivos.** Los datos viven en el
  navegador del freelancer y no salen de ahí.
