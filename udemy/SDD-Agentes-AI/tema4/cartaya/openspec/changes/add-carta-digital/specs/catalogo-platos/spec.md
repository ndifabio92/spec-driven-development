# Spec Delta

## Purpose

El catálogo que Andrés mantiene desde su móvil: las categorías y los platos que alimentan la carta pública, con su orden, sus precios, sus fotos y su declaración de alérgenos, y el archivado que retira un plato de la carta sin perder los pedidos que lo referencian.

## ADDED Requirements

### Requirement: Acceso al catálogo protegido por la sesión de establecimiento
El sistema MUST exigir la sesión de establecimiento para consultar o modificar el catálogo desde la administración. Sin sesión válida, el sistema MUST rechazar toda operación de administración y MUST NOT revelar datos de gestión. La sesión se abre con la contraseña única del establecimiento; no hay múltiples usuarios.

#### Scenario: Acceso con la contraseña correcta
- **WHEN** el dueño introduce la contraseña del establecimiento
- **THEN** el sistema abre la sesión y le da acceso a la administración del catálogo

#### Scenario: Acceso con contraseña incorrecta
- **WHEN** alguien introduce una contraseña que no es la del establecimiento
- **THEN** el sistema rechaza el acceso con un mensaje genérico, sin indicar si la contraseña existe

#### Scenario: Operación de administración sin sesión
- **WHEN** se intenta crear, editar, reordenar o archivar un plato o una categoría sin sesión válida
- **THEN** el sistema rechaza la operación y no modifica el catálogo

#### Scenario: La carta pública no queda afectada
- **WHEN** no hay ninguna sesión de establecimiento abierta
- **THEN** la carta pública sigue consultándose con normalidad

### Requirement: Gestión de categorías
El sistema MUST permitir al dueño crear una categoría con un nombre, renombrarla, cambiar su posición en la carta y archivarla. El nombre de la categoría MUST ser obligatorio y no vacío.

#### Scenario: Crear una categoría
- **WHEN** el dueño crea la categoría "Raciones"
- **THEN** el sistema la añade al catálogo en la última posición y queda disponible para asignarle platos

#### Scenario: Renombrar una categoría
- **WHEN** el dueño cambia el nombre de "Bebidas" a "Bebidas y refrescos"
- **THEN** la carta pública muestra el nuevo nombre y los platos de la categoría no se ven afectados

#### Scenario: Categoría sin nombre
- **WHEN** el dueño intenta guardar una categoría con el nombre vacío
- **THEN** el sistema rechaza la operación y le indica que el nombre es obligatorio

#### Scenario: Reordenar categorías
- **WHEN** el dueño mueve "Bebidas" por delante de "Raciones"
- **THEN** el sistema guarda el nuevo orden y la carta pública lo refleja en la siguiente consulta

### Requirement: Alta y edición de platos
El sistema MUST permitir al dueño crear un plato indicando su nombre, su precio, su descripción corta, su categoría y su declaración de alérgenos, y MUST permitir editar después cualquiera de esos datos. El nombre, el precio, la categoría y la declaración de alérgenos MUST ser obligatorios; la descripción corta y la foto son opcionales.

#### Scenario: Crear un plato completo
- **WHEN** el dueño crea "Tostada con tomate" a 2,50 € en Desayunos, con descripción y alérgenos declarados
- **THEN** el sistema lo guarda como plato activo en la última posición de esa categoría y aparece en la carta pública

#### Scenario: Editar el precio de un plato
- **WHEN** el dueño cambia el precio de un plato de 2,50 € a 2,80 €
- **THEN** la carta pública muestra 2,80 € en la siguiente consulta

#### Scenario: Plato sin nombre o sin categoría
- **WHEN** el dueño intenta guardar un plato sin nombre o sin categoría
- **THEN** el sistema rechaza la operación e indica qué dato falta, sin crear el plato

### Requirement: Precio en euros con IVA incluido
El sistema MUST aceptar el precio del plato en euros con IVA incluido, con dos decimales como máximo, y MUST rechazar un precio negativo, vacío o no numérico. El sistema MUST conservar el precio sin pérdida de precisión.

#### Scenario: Precio válido con decimales
- **WHEN** el dueño introduce el precio 12,90
- **THEN** el sistema lo guarda y la carta lo muestra como "12,90 €"

#### Scenario: Precio negativo
- **WHEN** el dueño introduce un precio negativo
- **THEN** el sistema rechaza la operación e indica que el precio debe ser mayor o igual que cero

#### Scenario: Precio con más de dos decimales
- **WHEN** el dueño introduce el precio 2,555
- **THEN** el sistema rechaza la operación e indica que el precio admite como máximo dos decimales

### Requirement: Declaración obligatoria de alérgenos al guardar un plato
El sistema MUST exigir una declaración de alérgenos explícita en cada plato antes de guardarlo: o bien uno o más de los 14 alérgenos de declaración obligatoria, o bien la marca explícita "Sin alérgenos". El sistema MUST NOT guardar un plato cuya declaración de alérgenos no se haya hecho de forma explícita, ni tratar la ausencia de selección como "sin alérgenos". El sistema MUST NOT aceptar a la vez la marca "Sin alérgenos" y alérgenos seleccionados.

#### Scenario: Plato con alérgenos seleccionados
- **WHEN** el dueño marca "Cereales con gluten" y "Lácteos" en un bocadillo y guarda
- **THEN** el sistema guarda esos dos alérgenos y la carta los muestra en la ficha del plato

#### Scenario: Plato declarado sin alérgenos
- **WHEN** el dueño marca explícitamente "Sin alérgenos" y guarda
- **THEN** el sistema guarda esa declaración y la carta muestra "Sin alérgenos" en la ficha del plato

#### Scenario: Plato sin declaración
- **WHEN** el dueño intenta guardar un plato sin marcar ningún alérgeno ni la casilla "Sin alérgenos"
- **THEN** el sistema rechaza la operación e indica que la declaración de alérgenos es obligatoria por normativa

#### Scenario: Declaración contradictoria
- **WHEN** el dueño marca "Sin alérgenos" junto con uno o más alérgenos concretos
- **THEN** el sistema rechaza la operación e indica que ambas opciones son incompatibles

### Requirement: Orden manual de los platos dentro de la categoría
El sistema MUST permitir al dueño cambiar la posición de un plato dentro de su categoría y MUST conservar ese orden. Cuando un plato cambia de categoría, el sistema MUST colocarlo al final de la categoría de destino.

#### Scenario: Subir un plato en su categoría
- **WHEN** el dueño sube "Pincho de tortilla" una posición en Raciones
- **THEN** el sistema guarda el nuevo orden y la carta pública lo refleja

#### Scenario: Mover un plato a otra categoría
- **WHEN** el dueño cambia un plato de Raciones a Bocadillos
- **THEN** el plato aparece al final de Bocadillos y desaparece de Raciones

### Requirement: Archivado y restauración de platos
El sistema MUST permitir al dueño archivar un plato para retirarlo de la carta, y MUST conservar el plato archivado en el sistema porque los pedidos históricos lo referencian. El sistema MUST NOT borrar un plato de forma irreversible desde la administración. El sistema MUST permitir restaurar un plato archivado.

#### Scenario: Archivar un plato
- **WHEN** el dueño archiva "Croissant a la plancha"
- **THEN** el plato desaparece de la carta pública y queda listado entre los platos archivados de la administración

#### Scenario: El plato archivado se conserva
- **WHEN** un plato ha sido archivado
- **THEN** sus datos (nombre, precio, alérgenos) siguen disponibles en el sistema para los pedidos que lo referencian

#### Scenario: Restaurar un plato archivado
- **WHEN** el dueño restaura un plato archivado
- **THEN** el plato vuelve a estar activo en su categoría y reaparece en la carta pública

#### Scenario: Confirmación antes de archivar
- **WHEN** el dueño pulsa archivar en un plato
- **THEN** el sistema pide confirmación antes de retirarlo de la carta

### Requirement: Archivado de categorías
El sistema MUST permitir archivar una categoría, lo que retira de la carta pública la categoría y sus platos. El sistema MUST advertir al dueño de cuántos platos activos quedarán fuera de la carta antes de confirmar.

#### Scenario: Archivar una categoría con platos activos
- **WHEN** el dueño archiva la categoría "Postres", que tiene 4 platos activos
- **THEN** el sistema le advierte de que 4 platos dejarán de verse y, al confirmar, la categoría y sus platos desaparecen de la carta pública

#### Scenario: Restaurar una categoría
- **WHEN** el dueño restaura una categoría archivada
- **THEN** la categoría vuelve a la carta con los platos que seguían activos, en su orden

### Requirement: Foto del plato con límite de tamaño
El sistema MUST permitir al dueño subir una foto para un plato desde su móvil, MUST aceptar los formatos de imagen habituales de cámara de móvil, MUST rechazar los ficheros que superen el límite de tamaño establecido y MUST permitir sustituir o quitar la foto de un plato. El sistema MUST servir las fotos a la carta pública en un tamaño acorde con el presupuesto de carga de 2 segundos.

#### Scenario: Subir una foto válida
- **WHEN** el dueño sube una foto del plato dentro del límite de tamaño
- **THEN** el sistema la guarda, la asocia al plato y la carta pública la muestra

#### Scenario: Foto demasiado grande
- **WHEN** el dueño sube una foto que supera el límite de tamaño
- **THEN** el sistema rechaza la subida e indica el límite máximo permitido, sin modificar el plato

#### Scenario: Formato no admitido
- **WHEN** el dueño sube un fichero que no es una imagen de un formato admitido
- **THEN** el sistema rechaza la subida e indica qué formatos acepta

#### Scenario: Quitar la foto de un plato
- **WHEN** el dueño quita la foto de un plato
- **THEN** la carta pública muestra ese plato sin foto y con el resto de sus datos intactos

### Requirement: Administración utilizable desde el móvil
La administración del catálogo MUST poder usarse por completo desde un móvil: todas las operaciones de alta, edición, reordenación y archivado MUST estar disponibles en pantalla de móvil, con zonas pulsables amplias y sin requerir un ordenador.

#### Scenario: Alta de plato desde el móvil
- **WHEN** el dueño crea un plato desde la pantalla de su móvil
- **THEN** puede rellenar todos los campos obligatorios y guardarlo sin salir del móvil

#### Scenario: Reordenar desde el móvil
- **WHEN** el dueño reordena platos o categorías desde el móvil
- **THEN** los controles de reordenación son pulsables con el dedo y el nuevo orden se guarda
