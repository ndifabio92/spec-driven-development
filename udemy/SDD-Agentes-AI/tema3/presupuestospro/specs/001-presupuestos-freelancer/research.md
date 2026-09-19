# Research: Presupuestos para Freelancers (PresupuestosPro v0)

**Fecha**: 2026-09-18
**Spec**: [spec.md](./spec.md)
**Constitución aplicada**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)

## Punto de partida

Tres restricciones mandan sobre todas las decisiones de este documento:

1. **La constitución exige la solución más simple** (Principio I) y prohíbe construir nada que la spec no pida (Principio III).
2. **El encargo del negocio**: versión 1 publicable online enseguida y que funcione bien en móvil.
3. **La spec prohíbe explícitamente**: cuentas de usuario, almacenamiento en la nube, envío de emails, multidivisa.

Estas tres cosas encajan entre sí mejor de lo que parece: una web que se publica en una dirección pública, pero cuyos datos nunca salen del navegador del freelancer.

---

## Decisión 1 — Aplicación web estática, sin servidor propio

**Decisión**: una única aplicación web que se publica como archivos estáticos (HTML, CSS y JavaScript). No hay servidor de aplicación, ni API, ni backend que mantener.

**Qué significa para el negocio**: el freelancer entra en una dirección web desde el móvil o el portátil y usa la herramienta. No hay que contratar servidores, ni pagar mantenimiento mensual, ni vigilar caídas. Publicar una versión nueva es subir una carpeta de archivos, y se puede hacer el mismo día.

**Por qué**: la spec no pide nada que requiera un servidor. No hay cuentas, no hay datos compartidos entre usuarios, no hay integraciones externas. Todo lo que hace la aplicación (guardar datos, calcular impuestos, generar el PDF) puede ocurrir dentro del navegador. Añadir un backend sería exactamente la "infraestructura para necesidades hipotéticas" que prohíbe el Principio I.

**Alternativas descartadas**:

- *Aplicación de escritorio instalable (Electron/Tauri)*: encaja con "los datos viven en el ordenador del freelancer", pero obliga a instalar, firmar binarios y publicar versiones por sistema operativo. Incompatible con "publicable online enseguida" y con el uso desde el móvil.
- *Web con backend y base de datos*: resuelve problemas que esta versión no tiene (multidispositivo, copias de seguridad) a cambio de cuentas de usuario, costes y superficie de seguridad. Prohibido por la spec y por el Principio III.

---

## Decisión 2 — Los datos se guardan en el navegador del freelancer

**Decisión**: perfil, catálogo de servicios, clientes y presupuestos se guardan en el almacenamiento local del navegador (`localStorage`), en un único documento JSON versionado.

**Qué significa para el negocio**: los datos del freelancer y de sus clientes no viajan a ningún sitio; se quedan en su dispositivo, igual que un archivo de Excel en su portátil. Nadie (ni siquiera quien publica la aplicación) puede verlos. La contrapartida, que hay que decirle al freelancer con claridad, es que **los datos están ligados a ese navegador y ese dispositivo**: si usa el móvil y el portátil verá dos conjuntos de datos distintos, y si borra los datos del navegador, los pierde.

**Por qué**: es la única forma de cumplir a la vez "publicable online" y "sin almacenamiento en la nube". `localStorage` es síncrono y trivial de usar, lo que mantiene el código simple.

**Límites conocidos y cómo se gestionan**:

| Límite | Gestión en v1 |
|---|---|
| Capacidad aproximada de 5 MB por dominio | El único dato pesado es el logo: se limita a 1 MB y se avisa al freelancer si se pasa |
| El navegador puede borrar los datos (modo incógnito, limpieza manual) | Se advierte en la pantalla de inicio con una frase clara; no se promete lo que la tecnología no garantiza |
| Los datos no se comparten entre dispositivos | Se asume y se comunica; sincronizar exigiría nube y cuentas, ambas fuera de alcance |

**Alternativas descartadas**:

- *IndexedDB*: mayor capacidad, pero API asíncrona y más código para el mismo resultado. Solo merecería la pena si guardáramos muchos archivos pesados, que no es el caso.
- *Descargar/cargar un archivo de datos manualmente*: sería una funcionalidad nueva (copias de seguridad) que la spec no pide.

---

## Decisión 3 — React + Vite + TypeScript

**Decisión**: React 19 sobre Vite 7, escrito en TypeScript. Sin framework adicional (sin Next.js, sin librería de estado global, sin framework de CSS).

**Qué significa para el negocio**: se usa la combinación más común y mejor documentada para este tipo de aplicación, lo que hace el trabajo predecible y fácil de retomar por cualquiera. TypeScript actúa como una red de seguridad: avisa de errores al escribir el código, algo especialmente valioso cuando se manejan importes, porcentajes y totales.

**Por qué React y no JavaScript plano**: la pantalla central del producto es un presupuesto cuyos totales deben recalcularse solos en cuanto cambia cualquier línea (FR-011). React hace eso automáticamente; a mano habría que escribir y mantener ese refresco pantalla por pantalla, lo cual acaba siendo *más* código y más frágil, no menos. Simplicidad aquí significa menos código propio, no menos herramientas.

**Dependencias de producción (lista completa y cerrada)**:

| Paquete | Para qué | Por qué es imprescindible |
|---|---|---|
| `react`, `react-dom` | Interfaz y recálculo automático | Núcleo de la aplicación |
| `react-router-dom` | Navegación entre pantallas | Hace que el botón "atrás" del móvil funcione (ver Decisión 7) |
| `jspdf` | Generar el PDF | Entregable del producto (FR-013) |
| `jspdf-autotable` | Tabla de líneas dentro del PDF | Evita maquetar una tabla a mano coordenada a coordenada |

Cualquier dependencia fuera de esta lista requiere justificarse contra el Principio I antes de instalarse.

---

## Decisión 4 — El PDF se genera dentro del navegador

**Decisión**: el PDF se construye en el propio navegador con `jsPDF` + `jspdf-autotable` y se descarga directamente con el nombre `Presupuesto-2026-001.pdf`.

**Qué significa para el negocio**: el freelancer pulsa "Descargar PDF" y obtiene el archivo al instante, también desde el móvil, sin esperas ni conexión con ningún servidor. El documento sale con texto real (seleccionable y nítido al imprimir), no como una foto de una pantalla.

**Por qué**: es la opción que da control exacto sobre lo que exige FR-013 (logo, datos, número, fechas, tabla y desglose) y produce un PDF de calidad profesional, que es literalmente el objetivo del producto ("se ve poco profesional" era el problema a resolver).

**Alternativas descartadas**:

- *`window.print()` con estilos de impresión*: cero dependencias, pero el resultado depende del navegador, no es una descarga sino un diálogo de impresión, y en móviles el comportamiento es irregular. No cumple "descargar el PDF" de forma fiable.
- *`html2canvas` + jsPDF*: convierte la pantalla en imagen; el texto sale rasterizado, pesa más y se ve borroso al imprimir. Peor imagen profesional.
- *Generación en un servidor*: exigiría el backend que la Decisión 1 descarta.

**Detalle técnico relevante**: las fuentes estándar de jsPDF (Helvetica) cubren acentos españoles y el símbolo €, así que no hace falta incrustar fuentes adicionales ni aumentar el tamaño de la aplicación.

---

## Decisión 5 — Formato de euros y fechas con el formateador nativo del navegador

**Decisión**: usar `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })` e `Intl.DateTimeFormat('es-ES')`. Sin librerías de formato ni de fechas.

**Qué significa para el negocio**: los importes salen siempre como espera un cliente español —`1.500,00 €`, con punto de miles y coma decimal— y las fechas como `18/09/2026`, tanto en pantalla como en el PDF. Es exactamente lo que exige el Principio II de la constitución, y se consigue sin añadir ni una dependencia.

**Alternativas descartadas**: `date-fns`, `dayjs`, `currency.js`. Todas resuelven problemas (zonas horarias, calendarios, multidivisa) que esta versión no tiene.

---

## Decisión 6 — Cómo se aplica la regla de redondeo acordada

**Decisión**: todos los cálculos intermedios se hacen con la precisión completa del lenguaje y el redondeo a céntimos (2 decimales, modo *half-up*) se aplica **solo** a los cuatro importes que se muestran: base imponible, IVA, retención y total. Una única función `redondearCentimos()` centraliza ese redondeo y nadie redondea por su cuenta.

**Qué significa para el negocio**: es la traducción literal de la clarificación aceptada en la spec. Evita el clásico descuadre de un céntimo cuando un presupuesto tiene muchas líneas con importes no redondos, que es justo lo que destruye la confianza en una herramienta de presupuestos.

**Por qué es seguro hacerlo con números decimales normales**: los importes de un presupuesto (miles de euros, como mucho decenas de miles) están muy lejos del límite de precisión del lenguaje; el error acumulado es del orden de una billonésima de euro, y el redondeo final a céntimos lo absorbe por completo. Trabajar internamente en céntimos enteros sería la alternativa "de libro", pero obligaría a convertir en cada entrada y salida, y contradice la regla acordada de mantener precisión completa en los intermedios.

**Cautela de implementación**: el redondeo se implementa de forma que `1,005 €` redondee a `1,01 €` (half-up real), no con un `Math.round` ingenuo que por representación binaria devolvería `1,00 €`. Esto queda cubierto por pruebas automáticas (Decisión 9).

---

## Decisión 7 — Navegación por rutas con `#` en la dirección

**Decisión**: `react-router-dom` en modo *hash* (`#/presupuestos/nuevo`).

**Qué significa para el negocio**: el botón "atrás" del móvil funciona como el usuario espera —de un presupuesto vuelve a la lista, no se sale de la aplicación—, y el freelancer puede guardar en favoritos la pantalla que use más. Es una de esas cosas que nadie pide pero que, si faltan, hacen que la aplicación "se sienta rara" en el móvil.

**Por qué el modo *hash***: permite publicar la aplicación en cualquier alojamiento estático (GitHub Pages, Netlify, Vercel) sin configurar reglas de reescritura en el servidor. Un detalle pequeño que elimina un paso entero del despliegue.

---

## Decisión 8 — Diseño pensado primero para el móvil, con CSS propio

**Decisión**: CSS plano, escrito primero para pantalla de móvil y ampliado a escritorio con media queries. Sin Tailwind, sin Bootstrap, sin librería de componentes.

**Qué significa para el negocio**: la escena real de la spec es "las once de la noche, hay que mandar el presupuesto mañana"; muchas veces eso ocurre con el móvil en la mano. La aplicación se diseña para ese caso: botones grandes (mínimo 44 px, pulsables con el pulgar), formularios de una sola columna, tabla de líneas que se convierte en tarjetas apiladas en pantallas estrechas, y el total siempre visible mientras se editan las líneas.

**Por qué sin framework de CSS**: la aplicación tiene seis pantallas y un puñado de formularios. Un framework añadiría configuración de build y cientos de utilidades para ahorrar unas pocas hojas de estilo. El Principio I decide.

**Teclados móviles**: los campos de importe y cantidad usan el tipo de entrada numérico adecuado para que el móvil abra el teclado de números directamente. Detalle mínimo, gran diferencia de uso.

---

## Decisión 9 — Pruebas automáticas solo donde está el dinero

**Decisión**: Vitest cubriendo únicamente la lógica pura de dominio: cálculo de base/IVA/retención/total, regla de redondeo, regla del cliente particular, y numeración anual. Sin pruebas de interfaz ni end-to-end en v1.

**Qué significa para el negocio**: el mayor riesgo del producto no es que un botón esté descolocado, es que un presupuesto salga con un número equivocado y el freelancer lo descubra cuando el cliente ya lo tiene. Esas cuentas quedan blindadas con pruebas que incluyen el ejemplo de referencia de la spec (2.120,00 €, 2.280,00 € y 2.420,00 €) y se comprueban solas en cada cambio.

**Por qué no más**: el Principio IV de la constitución exige que los criterios de aceptación sean verificables por una persona no técnica usando la aplicación. Esa verificación la cubre el guion de [quickstart.md](./quickstart.md). Montar además Playwright sería infraestructura no pedida.

---

## Decisión 10 — Publicación

**Decisión**: `npm run build` genera una carpeta de archivos estáticos que se sube a cualquier alojamiento estático gratuito. Sin variables de entorno, sin claves, sin configuración por entorno.

**Qué significa para el negocio**: no hay nada que configurar ni ningún secreto que custodiar, lo que cumple el Principio V de la constitución por construcción: si no hay credenciales, no hay credenciales que filtrar. Publicar una corrección es cuestión de minutos.

---

## Riesgos asumidos conscientemente

| Riesgo | Impacto | Postura en v1 |
|---|---|---|
| El freelancer borra los datos del navegador y pierde su histórico | Alto para él | Se advierte de forma visible; las copias de seguridad son una funcionalidad futura que deberá pasar por su propia spec |
| Usa móvil y portátil y ve datos distintos | Medio | Consecuencia aceptada de no tener nube; se comunica con claridad |
| Un logo muy pesado agota el almacenamiento | Bajo | Límite de 1 MB con mensaje de error explicativo |
| Los tipos de IVA o IRPF cambian por ley | Medio a futuro | Los porcentajes viven en un único sitio del código, fácil de actualizar; hacerlos configurables sería alcance no pedido |

## Descartado explícitamente (y por qué)

- **PWA / funcionamiento sin conexión / instalable**: la spec no lo pide (Principio III).
- **Backend, base de datos, cuentas de usuario**: prohibido por la spec y por el encargo del negocio.
- **Envío del PDF por email, estados del presupuesto, descuentos, multidivisa, facturación**: fuera de alcance declarado en la spec.
- **Librería de estado global (Redux, Zustand)**: con seis pantallas y un único documento de datos, el estado propio de React sobra.
- **Analítica o telemetría**: no pedida, y contraria al espíritu del Principio V.
