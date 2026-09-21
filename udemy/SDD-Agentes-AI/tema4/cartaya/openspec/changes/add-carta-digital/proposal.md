# Propuesta: carta digital pública

## Why

La Estación mantiene su oferta en cartas plastificadas que quedan desactualizadas en cuanto cambia un precio o desaparece un plato, y que no declaran los alérgenos de forma fiable pese a ser una obligación legal (Reglamento UE 1169/2011). Andrés necesita una carta que pueda corregir él mismo desde el móvil en segundos y que el cliente consulte escaneando el QR de su mesa, sin instalar nada ni identificarse.

Este cambio es el cimiento del producto: sin catálogo no hay pedido. El flujo de pedido desde la mesa se aborda en un cambio posterior.

## What Changes

- **Nueva carta pública**: pantalla que el cliente abre al escanear el QR de su mesa, sin identificación ni registro, con las categorías en el orden que decide Andrés y los platos activos de cada una en su orden manual.
- **Ficha de plato visible al cliente**: nombre, precio en euros con IVA incluido, descripción corta, foto opcional y alérgenos. Los alérgenos se muestran **siempre**, usando los 14 de declaración obligatoria; un plato sin ninguno declara explícitamente "Sin alérgenos".
- **Nuevo panel de catálogo**: pantalla de administración pensada para móvil, protegida por la sesión de establecimiento, donde Andrés crea, edita, reordena y archiva categorías y platos, y sube fotos con límite de tamaño.
- **Archivado en lugar de borrado**: un plato o categoría que Andrés retira desaparece de la carta para siempre, pero se conserva archivado porque los pedidos históricos lo referenciarán.
- **Presupuesto de rendimiento**: la carta pública carga en menos de 2 s en un móvil de gama media sobre 4G.
- No hay cambios que rompan nada: el proyecto parte de cero.

## Decisiones de negocio

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-09-20 | Un plato "activo" es simplemente un plato no archivado; no existe un estado "agotado" ni disponibilidad por horario | Principio 2 (simplicidad). Andrés archiva y restaura; si más adelante necesita marcar agotados será otro cambio |
| 2026-09-20 | Archivar nunca borra: el plato queda fuera de la carta pero persiste en la base de datos | Los pedidos históricos deben poder seguir mostrando qué se pidió y a qué precio |
| 2026-09-20 | El precio se guarda en céntimos enteros y se muestra en euros con IVA incluido | Evita errores de redondeo en coma flotante; principio 1 |
| 2026-09-20 | Los alérgenos se modelan como el conjunto cerrado de los 14 de declaración obligatoria de la UE, más el marcador explícito "sin alérgenos" | Obligación legal: la ausencia de información no es una opción. Un plato que Andrés no ha revisado no puede publicarse como si no tuviera alérgenos |
| 2026-09-20 | El orden de categorías y de platos dentro de cada categoría es manual, decidido por Andrés | Es la carta de su negocio: el orden es comercial, no alfabético |
| 2026-09-20 | La foto del plato es opcional y tiene límite de tamaño | Andrés fotografía con el móvil; sin límite la carta incumpliría los 2 s en 4G |
| 2026-09-20 | La carta pública no distingue mesas ni guarda nada del cliente | Principio 3 (privacidad por diseño) |

## Capabilities

### New Capabilities
- `carta-publica`: consulta de la carta por parte del cliente final sin identificación — categorías y platos activos ordenados, ficha de plato con alérgenos siempre visibles, accesibilidad y presupuesto de carga.
- `catalogo-platos`: gestión del catálogo por parte del dueño desde la sesión de establecimiento — alta, edición, reordenación y archivado de categorías y platos, y subida de fotos.

### Modified Capabilities
<!-- Ninguna: el proyecto no tiene specs vivas todavía. -->

## Impact

- **Código nuevo** (el repositorio está vacío): servidor Express sobre Node.js 22, persistencia con better-sqlite3 en fichero único, frontend React 19 con Vite servido como estáticos por el propio Express.
- **API nueva**: endpoints públicos de lectura de la carta y endpoints de administración del catálogo protegidos por la sesión de establecimiento.
- **Esquema de datos nuevo**: categorías, platos, alérgenos por plato y fotos.
- **Autenticación**: primera aparición de la sesión de establecimiento con contraseña única; este cambio la introduce porque el panel de catálogo la necesita.
- **Almacenamiento de ficheros**: directorio local para las fotos de los platos.
- **Sin dependencias fuera del stack ya fijado**; cualquier añadido se justifica en `design.md`.
