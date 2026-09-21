# CLAUDE.md — PresupuestosPro

Web para que un freelancer español cree presupuestos con IVA y retención de IRPF
calculados solos y los descargue en PDF, todo dentro de su propio navegador.

## Stack y decisiones vigentes

- **TypeScript 5.9 + React 19** sobre **Vite 8**, `strict` y `verbatimModuleSyntax`.
  Node 20+ solo para desarrollar: lo que se publica es HTML/CSS/JS estático.
- **Sin backend, sin base de datos, sin cuentas.** Persistencia en `localStorage`,
  un único documento JSON versionado bajo la clave `presupuestospro.datos`
  (contrato: `specs/001-presupuestos-freelancer/contracts/almacen-schema.md`).
- **react-router-dom 7 en modo hash** (`#/`): el botón «atrás» del móvil funciona y
  `dist/` se sube a cualquier alojamiento estático sin reglas de reescritura.
  La entrada es `#/` → Inicio; la lista vive en `#/presupuestos`.
- **jsPDF 4 + jspdf-autotable 5** generan el PDF en el dispositivo y **fflate 0.8** el
  `.zip` de la copia. [003] El logo se incrusta entero en **cada** PDF: el coste de una
  operación en lote escala con el número de documentos *por* el tamaño del logo, no con
  el número de documentos. Es lo primero que mirar ante un problema de memoria o lentitud.
  [002 v1.3] Por ese mismo motivo **el PDF no incrusta tipografías**: se repetirían en cada
  documento igual que el logo.
- **Lista de dependencias cerrada.** Sin framework de CSS, sin librería de estado,
  sin librería de componentes, sin iconos ni fuentes externas. Añadir una requiere
  justificarla contra el Principio I de la constitución. [003] `fflate` es la única
  excepción concedida hasta hoy; la regla sigue en pie y la siguiente también tendrá
  que justificarse.
- **`src/dominio/` es el núcleo**: lógica pura, sin React ni navegador. Ahí está el
  dinero (cálculo, redondeo a céntimos half-up, numeración `AAAA-NNN`, formato,
  situación) y [003] los nombres de los archivos que salen del producto, que rompen en
  silencio igual que un importe mal calculado. Es lo único con pruebas automáticas.
- **Los tokens visuales viven solo en el bloque `:root` de `src/estilos/global.css`.**
  `src/estilos/tokens.ts` los lee para el PDF, de modo que pantalla y documento no
  pueden desincronizarse. [002 v1.3] **Todo token que el PDF lea es un valor plano**:
  el lector recibe el texto del token sin resolver, así que una expresión calculada
  haría caer el documento a su respaldo **sin avisar**. La fluidez del título y las
  mezclas de color viven en la regla que las usa, nunca en el valor del token.
- [002 v1.3] **Dos tipografías, cada una con su trabajo**: `Figtree` (variable, cubre los
  tres grosores) para todo, y `Bricolage Grotesque` 700 **solo** en el título de pantalla
  y la marca. Los dos archivos viven en `public/fuentes/` —no bajo `src/`, para que la
  precarga de `index.html` funcione igual en desarrollo y en producción— y **no se pide
  nada a ningún servidor de fuentes**. Su licencia viaja en `public/fuentes/OFL.txt`:
  publicar `dist/` sin ella incumple la licencia.
- [002 v1.3] **Escala de espaciado de siete peldaños, base 4** (`--espacio-1` … `-7` =
  4, 8, 12, 16, 24, 32 y 48 px) y **tres tonos de línea con tres trabajos**: `--color-linea`
  separa filas, `--color-linea-fuerte` estructura y `--color-borde-control` es el contorno
  de lo que se escribe o se pulsa. El contorno de un campo **nunca** usa el de separar filas:
  se queda en 1,27:1 y no llega al mínimo de contraste.
- [002 v1.3] **El PDF deriva sus tamaños de la escala con la conversión declarada
  1 rem = 9 pt**, no de la directa (que sería 12 pt): con 12 la tabla crecería un tercio,
  el documento ocuparía más páginas y pesaría más. El documento es más denso que una
  pantalla, y siempre lo fue.

## Arrancar y probar en local

```bash
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # para abrirlo desde el móvil en la misma wifi
npm test                 # Vitest: solo src/dominio/*.test.ts
npm run build            # tsc --noEmit + vite build → dist/
npm run preview          # ver dist/ antes de publicar
```

No hay variables de entorno ni claves. `dist/` se sube tal cual.

## Convenciones

- **Todo en español de España**: interfaz, mensajes, PDF y también los nombres de
  archivos, carpetas, funciones y tipos (`dominio`, `almacen`, `paginas`,
  `calcularTotales`, `EtiquetaSituacion`). Importes con `Intl` `es-ES`/`EUR`.
- **La interfaz y el PDF nunca recalculan**: consultan `dominio/`. Cualquier regla de
  dinero o derivada de los datos entra en `dominio/` con su test al lado.
- [003] **Un solo camino hacia el PDF**: todo lo que produzca un documento pasa por
  `construirDocumento()`. Nunca se escribe un segundo generador, ni «para lotes».
- [003] **Todo lo que el producto exporte va envuelto en un sobre** con la aplicación, la
  versión del formato y el momento, y con los datos **sin tocar**: es lo que hará posible
  volver a leerlos dentro de años.
- **Verificación manual por delante de los tests de UI**: no se añaden pruebas de
  interfaz ni de PDF; el guion de cada `quickstart.md` lo ejecuta una persona.
- **Mobile-first**, CSS escrito a mano; ningún color, tamaño ni espaciado fuera de
  los tokens.
- Estilo del código: sin punto y coma, comillas simples, indentación de 2 espacios,
  comentarios que explican el *porqué* y citan el FR o la decisión de `research.md`.
- Flujo de trabajo **Spec Kit**: nada se construye sin estar escrito en la spec
  activa (`/speckit-specify` → `plan` → `tasks` → `implement`). Las ideas nuevas se
  proponen como spec, no se implementan por el camino.

Las reglas de producto viven en `.specify/memory/constitution.md` y el estado del
producto en `specs/README.md`.
