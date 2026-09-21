# Tasks

> Cada escenario de `specs/carta-publica/spec.md` y `specs/catalogo-platos/spec.md` debe acabar con un test cuyo nombre sea literalmente el nombre del escenario. La tarea 8.1 comprueba que no falta ninguno.

## 1. Esqueleto del proyecto

- [ ] 1.1 Inicializar el repositorio Node.js 22 con `package.json` (tipo módulo, scripts `dev`, `build`, `start`, `test`) y verificar que `npm run test` ejecuta el runner de `node:test` sin fallos con cero tests
- [ ] 1.2 Añadir Express y better-sqlite3 como únicas dependencias de servidor y verificar que `npm install` termina sin errores y `npm ls` no muestra más dependencias directas
- [ ] 1.3 Crear el servidor Express mínimo que responde en `/api/salud` y verificar con una petición que devuelve 200
- [ ] 1.4 Configurar React 19 con Vite y el servido de `dist/` como estático desde Express, con *fallback* a `index.html`, y verificar que `npm run build && npm start` sirve la página en `/`
- [ ] 1.5 Añadir `.gitignore` (node_modules, dist, `datos/`, `.env`) y verificar que `git status` no lista artefactos generados

## 2. Base de datos y modelo de catálogo

- [ ] 2.1 Implementar el aplicador de migraciones SQL numeradas con su tabla `migraciones` y verificar con un test que aplicar dos veces seguidas no repite ninguna migración
- [ ] 2.2 Escribir `migraciones/001-catalogo.sql` con las tablas `categorias`, `platos`, `plato_alergeno` y `sesiones`, incluyendo `posicion`, `archivado_en`, `precio_centimos` con `CHECK (>= 0)`, `sin_alergenos` y el `CHECK` del conjunto cerrado de alérgenos (design, decisiones 1-3), y verificar con un test que el esquema se crea sobre una base vacía
- [ ] 2.3 Crear el módulo compartido con los 14 códigos de alérgeno y sus etiquetas en español, importable por servidor y frontend, y verificar con un test que contiene exactamente 14 códigos y que coinciden con los del `CHECK` de la migración
- [ ] 2.4 Implementar el acceso a datos de categorías (alta, renombrado, reordenación, archivado, restauración) y verificar con tests unitarios sobre una base temporal
- [ ] 2.5 Implementar el acceso a datos de platos (alta, edición, cambio de categoría al final de destino, reordenación, archivado, restauración) y verificar con tests unitarios sobre una base temporal

## 3. Validación de negocio

- [ ] 3.1 Implementar el validador de plato (nombre y categoría obligatorios; precio no negativo, numérico y de dos decimales como máximo, convertido a céntimos) y verificar con los tests de los escenarios "Plato sin nombre o sin categoría", "Precio válido con decimales", "Precio negativo" y "Precio con más de dos decimales"
- [ ] 3.2 Implementar la validación de la declaración de alérgenos (exactamente una de las dos formas, códigos dentro del conjunto cerrado) como paso obligatorio de alta y edición, y verificar con los tests de los escenarios "Plato con alérgenos seleccionados", "Plato declarado sin alérgenos", "Plato sin declaración" y "Declaración contradictoria"
- [ ] 3.3 Implementar la validación de categoría (nombre obligatorio y no vacío) y verificar con el test del escenario "Categoría sin nombre"

## 4. Sesión de establecimiento

- [ ] 4.1 Añadir el script que genera el hash `scrypt` de la contraseña en `CARTAYA_PASSWORD_HASH` y documentar su uso en el README, verificando que el hash generado valida contra la contraseña de origen
- [ ] 4.2 Implementar `POST /api/admin/sesion` (verificación con `timingSafeEqual`, retardo fijo en fallo, cookie `HttpOnly; SameSite=Strict`, fila en `sesiones` con caducidad de 30 días) y `DELETE /api/admin/sesion`, y verificar con los tests de los escenarios "Acceso con la contraseña correcta" y "Acceso con contraseña incorrecta"
- [ ] 4.3 Implementar el middleware que protege `/api/admin/*` y verificar con los tests de los escenarios "Operación de administración sin sesión" y "La carta pública no queda afectada"

## 5. API de catálogo y carta

- [ ] 5.1 Implementar `GET /api/carta` devolviendo en una sola respuesta las categorías activas ordenadas con sus platos activos y alérgenos, excluyendo platos de categorías archivadas, y verificar con los tests de los escenarios "Un plato archivado desaparece de la carta", "Un plato restaurado vuelve a la carta", "Un plato nuevo aparece sin intervención del cliente", "Una categoría sin platos activos no aparece" y "Catálogo sin platos activos"
- [ ] 5.2 Añadir `ETag` y `Cache-Control: public, max-age=60` a `GET /api/carta` y verificar con un test que una segunda petición con `If-None-Match` responde 304
- [ ] 5.3 Implementar los endpoints de administración de categorías (crear, renombrar, reordenar, archivar con recuento de platos afectados, restaurar) y verificar con los tests de los escenarios "Crear una categoría", "Renombrar una categoría", "Reordenar categorías", "Archivar una categoría con platos activos" y "Restaurar una categoría"
- [ ] 5.4 Implementar los endpoints de administración de platos (crear, editar, reordenar, cambiar de categoría, archivar, restaurar, listar archivados) y verificar con los tests de los escenarios "Crear un plato completo", "Editar el precio de un plato", "Subir un plato en su categoría", "Mover un plato a otra categoría", "Archivar un plato", "El plato archivado se conserva" y "Restaurar un plato archivado"

## 6. Fotos de platos

- [ ] 6.1 Implementar `PUT /api/admin/platos/:id/foto` con cuerpo binario crudo, límite de 500 KB, detección del formato por los primeros bytes del fichero y guardado en `datos/fotos/<plato_id>-<hash>.jpg`, y verificar con los tests de los escenarios "Subir una foto válida", "Foto demasiado grande" y "Formato no admitido"
- [ ] 6.2 Implementar `DELETE /api/admin/platos/:id/foto` y verificar con el test del escenario "Quitar la foto de un plato"
- [ ] 6.3 Servir `datos/fotos/` con `Cache-Control: public, max-age=31536000, immutable` y verificar con un test que la cabecera se emite y que sustituir la foto cambia la URL

## 7. Interfaz

- [ ] 7.1 Definir las variables CSS de tipografía, color y tamaños de zona pulsable (cuerpo ≥ 16 px, contraste ≥ 4,5:1, pulsables ≥ 44 px) y verificar los contrastes de las combinaciones definidas con una comprobación de ratio
- [ ] 7.2 Construir la pantalla de carta pública (categorías y platos en orden, nombre, precio formateado con `Intl.NumberFormat('es-ES')`, descripción, foto opcional con `width`/`height` y `loading="lazy"`, alérgenos siempre visibles sin despliegue) y verificar con los tests de los escenarios "Cliente abre la carta desde el QR de la mesa", "Las categorías respetan el orden del dueño", "Los platos respetan el orden manual dentro de su categoría", "Plato con todos sus datos", "Plato sin foto", "El precio se muestra en euros con IVA incluido", "Plato con alérgenos", "Plato sin ningún alérgeno" y "Los alérgenos no se esconden tras una interacción"
- [ ] 7.3 Verificar en la carta pública que no se envía ni almacena ningún dato del cliente (sin cookies, sin almacenamiento local, sin peticiones de seguimiento) con el test del escenario "La carta no registra al cliente"
- [ ] 7.4 Comprobar la carta con el texto del sistema al 200 % y con las fotos aún sin cargar, verificando los escenarios "Cliente con el texto del sistema ampliado", "Contraste y tamaño de texto" y "Las fotos no bloquean la lectura de la carta"
- [ ] 7.5 Construir la pantalla de acceso y el panel de catálogo para móvil (listado por categorías, alta y edición de plato con selector de los 14 alérgenos y casilla "Sin alérgenos", controles de reordenación pulsables, confirmación antes de archivar, aviso de platos afectados al archivar categoría, listado de archivados con restaurar) y verificar con los tests de los escenarios "Alta de plato desde el móvil", "Reordenar desde el móvil" y "Confirmación antes de archivar"
- [ ] 7.6 Implementar en el panel el redimensionado de la foto con `canvas` (lado mayor 1200 px, JPEG 0,8) antes de subirla y verificar con una foto de cámara de móvil que el fichero enviado queda por debajo del límite
- [ ] 7.7 Mostrar en el panel el aviso del desfase de hasta 60 s de la carta pública (design, riesgos) y verificar que aparece en la pantalla de edición

## 8. Cierre

- [ ] 8.1 Comprobar la trazabilidad escenario→test: listar los nombres de escenario de ambas specs y verificar que cada uno tiene un test con ese nombre exacto en la suite
- [ ] 8.2 Medir la carga de `/` con el catálogo completo en perfil de móvil de gama media con 4G y verificar el escenario "Carga con el catálogo completo" (< 2 s); ajustar el límite de tamaño de foto si la medición lo exige y anotar el valor final en `design.md`
- [ ] 8.3 Escribir el README con el arranque local, la generación del hash de contraseña y la ubicación de `datos/`, y verificar siguiendo sus pasos desde un clon limpio que la aplicación arranca
