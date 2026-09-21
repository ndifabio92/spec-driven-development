# Design

## Context

El repositorio está vacío: este cambio levanta el esqueleto de CartaYa además de la funcionalidad de carta y catálogo. El stack está fijado por `config.yaml` (Node.js 22 + Express + better-sqlite3, React 19 + Vite servido como estático por el propio Express, CSS propio) y no se renegocia aquí. Motivación y decisiones de negocio: ver `proposal.md`. Comportamiento exigible: ver `specs/carta-publica/spec.md` y `specs/catalogo-platos/spec.md`.

Restricciones que moldean el diseño:
- Presupuesto duro de 2 s en móvil de gama media con 4G para la carta pública.
- Obligación legal: ningún plato puede llegar a la carta sin declaración de alérgenos explícita.
- Un único establecimiento y un único usuario administrador; volumen del catálogo del orden de decenas de platos.
- Principio 3: la carta pública no guarda nada del cliente.

## Goals / Non-Goals

**Goals:**
- Esqueleto mínimo del proyecto (servidor, base de datos, build del frontend, suite de tests) sobre el que se apoyará el cambio de pedidos.
- Un modelo de datos en el que "archivado" sea el único mecanismo de retirada y los pedidos futuros puedan referenciar platos archivados.
- Una carta pública que se sirva en una sola petición de datos y no dependa de JavaScript pesado ni de dependencias nuevas.
- Sesión de establecimiento suficiente para proteger la administración, sin librería de autenticación.

**Non-Goals:**
- No se introduce SSE en este cambio: la carta pública no necesita actualizarse en vivo, y el tiempo real llega con el flujo de pedidos.
- No se diseña el modelo de pedidos ni de mesas; solo se garantiza que el catálogo sea referenciable de forma estable por ellos.
- No se gestionan usuarios, roles ni recuperación de contraseña.
- No se hace despliegue ni infraestructura: el desarrollo es local, sin Docker.

## Decisions

### 1. Archivado con marca temporal, no borrado ni booleano

`categorias` y `platos` llevan `archivado_en TEXT NULL` (ISO-8601). "Activo" significa `archivado_en IS NULL`. Restaurar es ponerlo a `NULL`.

*Por qué*: un booleano no dice cuándo se retiró; la marca temporal sale gratis y ayuda al listado de archivados. No se ofrece borrado real en la administración porque los pedidos históricos referenciarán `plato_id` (ver `proposal.md`, decisión del 2026-09-20).

*Alternativa descartada*: tabla `platos_archivados` separada. Duplicaría el esquema y obligaría a que los pedidos buscaran en dos tablas.

Una categoría archivada oculta sus platos de la carta sin archivarlos: los platos conservan su `archivado_en` propio, de modo que restaurar la categoría devuelve exactamente los platos que seguían activos. La consulta pública filtra por ambas condiciones.

### 2. Precio en céntimos enteros

`platos.precio_centimos INTEGER NOT NULL CHECK (precio_centimos >= 0)`. El formateo a `"2,50 €"` ocurre solo en la capa de presentación, con `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`.

*Por qué*: SQLite no tiene decimal y los flotantes acumulan error justo donde más duele (totales de pedido, cambio posterior). El entero es exacto y suma sin sorpresas.

### 3. Alérgenos: conjunto cerrado en tabla puente + marca explícita "sin alérgenos"

- Constante compartida con los 14 códigos (`gluten`, `crustaceos`, `huevos`, `pescado`, `cacahuetes`, `soja`, `lacteos`, `frutos_cascara`, `apio`, `mostaza`, `sesamo`, `sulfitos`, `altramuces`, `moluscos`) en un módulo único que importan servidor y frontend, para que las etiquetas en español y los códigos nunca diverjan.
- `plato_alergeno(plato_id, alergeno)` con `CHECK (alergeno IN (...))` y clave primaria compuesta.
- `platos.sin_alergenos INTEGER NOT NULL` como declaración explícita.
- La validación de "exactamente una de las dos formas de declarar" vive en el servidor, en el mismo validador que usan alta y edición: o `sin_alergenos = 1` sin filas en `plato_alergeno`, o `sin_alergenos = 0` con al menos una fila. No existe camino de escritura que salte ese validador.

*Por qué*: el conjunto cerrado en `CHECK` impide que entre un alérgeno inventado, y la marca explícita distingue "declarado sin alérgenos" de "no declarado" — distinción que es el núcleo del requisito legal.

*Alternativa descartada*: una columna de texto con códigos separados por comas. Más simple de escribir, pero no puede validar el conjunto cerrado en la base de datos y convierte "vacío" en ambiguo, que es exactamente el fallo que hay que evitar.

### 4. Orden manual con posición entera renumerada en transacción

`categorias.posicion` y `platos.posicion` (entero dentro de su categoría). Reordenar recalcula las posiciones afectadas dentro de una transacción de better-sqlite3, que es síncrona y no requiere manejo de concurrencia: hay un solo administrador.

*Alternativa descartada*: posiciones fraccionarias o `LexoRank`. Resuelven un problema de escala que una cafetería con decenas de platos no tiene (principio 2).

Al mover un plato de categoría se le asigna `MAX(posicion) + 1` en la de destino, tal y como exige la spec.

### 5. La carta pública se sirve en una sola respuesta JSON

`GET /api/carta` devuelve el árbol completo (categorías activas en orden, con sus platos activos, alérgenos incluidos). Se arma con una consulta por tabla y se ensambla en memoria; con este volumen es trivial.

- `Cache-Control: public, max-age=60` y `ETag` sobre el contenido: el segundo escaneo de la mesa responde `304`.
- Las escrituras de la administración no necesitan invalidar nada: 60 s de desfase máximo es aceptable para una carta, y evita toda maquinaria de invalidación.

*Por qué*: una sola petición elimina cascadas de red, que es donde se va el presupuesto de 2 s en 4G.

### 6. Fotos: redimensionado en el navegador, sin dependencia de procesado de imagen

El panel de administración redimensiona la foto antes de subirla, con `canvas` del propio navegador: lado mayor máximo 1200 px, salida JPEG de calidad 0,8. El servidor acepta el binario resultante y **rechaza** lo que supere **500 KB** o no sea `image/jpeg`, `image/png` o `image/webp` (verificado por los primeros bytes del fichero, no por la extensión ni por el `Content-Type` declarado).

Los ficheros se guardan en `datos/fotos/<plato_id>-<hash>.jpg` y se sirven con `Cache-Control: public, max-age=31536000, immutable`; el hash en el nombre hace que sustituir la foto cambie la URL, así que la caché larga es segura. En la carta, cada `<img>` lleva `loading="lazy"`, `decoding="async"` y `width`/`height` explícitos para que no haya saltos de maqueta mientras cargan.

*Por qué esta división*: el redimensionado en cliente evita añadir `sharp` (binario nativo, pesado, innecesario para una cafetería) y el límite en servidor mantiene la garantía aunque alguien suba sin pasar por el panel. El límite de 500 KB es lo que permite mostrar una carta con fotos dentro del presupuesto de 2 s.

*Dependencias nuevas*: **ninguna**. La subida va como cuerpo binario crudo (`PUT /api/admin/platos/:id/foto` con `Content-Type` de imagen), no como `multipart/form-data`, lo que evita `multer`: controlamos el único cliente que sube, y un solo fichero por petición no justifica un parseador de multipart.

### 7. Sesión de establecimiento con cookie firmada y token en base de datos

- La contraseña no se guarda en claro: en el entorno vive `CARTAYA_PASSWORD_HASH`, un hash `scrypt` con sal generado por un script del repositorio. La comparación usa `crypto.timingSafeEqual`.
- Al iniciar sesión se crea una fila en `sesiones(token, creada_en, expira_en)` y se devuelve una cookie `HttpOnly; SameSite=Strict; Path=/` (y `Secure` fuera de desarrollo). Caducidad: 30 días, porque Andrés usa su propio móvil y reautenticarse a diario sería un castigo.
- Todo `/api/admin/*` pasa por un middleware que valida el token.

*Dependencias nuevas*: **ninguna**. `node:crypto` genera el token y el hash; la cookie se lee de `req.headers.cookie` con un parseo de una línea. `express-session` y `passport` añaden almacenes y estrategias para un problema —un usuario, una contraseña— que no los tiene.

*Riesgo aceptado*: no hay bloqueo por intentos fallidos. Se mitiga con un retardo fijo en la respuesta de login fallido y un mensaje genérico; un límite de intentos por IP se puede añadir después sin tocar las specs.

### 8. Frontend: dos rutas, un solo bundle, sin router de terceros

`/` es la carta pública y `/admin` el panel. Vite construye a `dist/`, que Express sirve como estático con *fallback* a `index.html`. La selección de vista se hace leyendo `location.pathname`: dos pantallas no justifican `react-router`.

*Dependencias nuevas*: **ninguna** más allá de React 19 y Vite, ya fijados.

La accesibilidad exigida por la spec (contraste ≥ 4,5:1, cuerpo ≥ 16 px, zonas pulsables ≥ 44 px, soporte de texto ampliado al 200 %) se implementa con variables CSS propias y unidades relativas; se verifica en la revisión de cada pantalla, no con una librería.

### 9. Esquema versionado con migraciones SQL numeradas

`migraciones/001-catalogo.sql` y un arranque que aplica en orden las pendientes, registrando las aplicadas en una tabla `migraciones`. Sin herramienta externa.

*Por qué*: el cambio de pedidos añadirá tablas y necesita un mecanismo ya en marcha; escribirlo ahora cuesta unas pocas líneas.

### 10. Tests con el runner de Node y trazabilidad por nombre de escenario

`node:test` más `fetch` contra una instancia de Express levantada en un puerto efímero, con una base de datos SQLite en fichero temporal por fichero de test. Cada escenario de las specs tiene un test cuyo nombre **es** el nombre del escenario, para que la trazabilidad sea una búsqueda de texto.

*Dependencias nuevas*: **ninguna**. El runner y el cliente HTTP vienen en Node 22; `supertest` y `jest` no aportan nada que haga falta aquí.

## Risks / Trade-offs

- **El presupuesto de 2 s depende del peso real de las fotos** → Límite de 500 KB en servidor, redimensionado en cliente, `lazy loading` y caché inmutable; se mide con el catálogo completo cargado, no con dos platos de prueba.
- **El desfase de hasta 60 s de la caché de la carta puede confundir a Andrés** ("he cambiado el precio y no lo veo") → El panel muestra siempre datos frescos y la spec exige el cambio "en la siguiente consulta"; se documenta el desfase en la interfaz del panel con una línea.
- **Sin bloqueo por intentos fallidos en el login** → Retardo fijo y mensaje genérico; el límite por IP queda como mejora posterior que no altera las specs.
- **El conjunto de 14 alérgenos vive en código, no en base de datos** → Si la normativa cambiase, hay que tocar la constante y añadir una migración del `CHECK`. Es el precio de que la base de datos garantice el conjunto cerrado, y se considera preferible a que un error de escritura publique un alérgeno inventado.
- **Redimensionar en el navegador falla si Andrés usa un navegador muy antiguo** → El servidor sigue aceptando cualquier imagen que cumpla el límite; en el peor caso la subida se rechaza por tamaño con un mensaje claro y él repite la foto con menos resolución.
- **La sesión de 30 días en un móvil perdido da acceso al catálogo** → El alcance del daño es editar la carta, no datos de clientes (no los hay); se mitiga con un botón de cerrar sesión que borra la fila de `sesiones`.

## Migration Plan

Proyecto nuevo: no hay datos que migrar ni versión anterior en producción. El arranque aplica `migraciones/001-catalogo.sql` sobre una base de datos vacía y el catálogo se carga a mano desde el panel. La reversión consiste en borrar el fichero SQLite y el directorio de fotos.

## Open Questions

- Valor definitivo del límite de tamaño de foto: 500 KB es la estimación que encaja con el presupuesto de 2 s; se confirma o se ajusta al medir con el catálogo real de La Estación. El ajuste cambia una constante, no las specs ni el desglose de tareas.
