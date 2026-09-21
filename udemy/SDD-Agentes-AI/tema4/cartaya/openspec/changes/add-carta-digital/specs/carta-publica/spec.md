# Spec Delta

## Purpose

La carta digital que el cliente de La Estación consulta desde su móvil al escanear el QR de la mesa: las categorías y los platos activos del catálogo, con precio y alérgenos siempre visibles, sin identificarse ni instalar nada.

## ADDED Requirements

### Requirement: Consulta pública sin identificación
El sistema MUST servir la carta a cualquier persona que abra su dirección, sin pedir registro, inicio de sesión, ni ningún dato personal, y sin asociar la consulta a una persona identificada.

#### Scenario: Cliente abre la carta desde el QR de la mesa
- **WHEN** un cliente escanea el QR de su mesa y abre la carta
- **THEN** el sistema muestra la carta completa sin solicitar credenciales ni datos personales

#### Scenario: La carta no registra al cliente
- **WHEN** un cliente consulta la carta
- **THEN** el sistema no almacena ningún dato que identifique a esa persona

### Requirement: Organización de la carta en categorías ordenadas
El sistema MUST mostrar la carta agrupada en las categorías definidas por el dueño, en el orden que él ha establecido, y MUST mostrar dentro de cada categoría sus platos activos en el orden manual que él ha establecido.

#### Scenario: Las categorías respetan el orden del dueño
- **WHEN** el dueño ha ordenado las categorías como Desayunos, Bocadillos, Raciones, Bebidas, Postres
- **THEN** la carta muestra las categorías exactamente en ese orden

#### Scenario: Los platos respetan el orden manual dentro de su categoría
- **WHEN** el dueño ha colocado "Tostada con tomate" por delante de "Croissant a la plancha" en Desayunos
- **THEN** la carta muestra "Tostada con tomate" antes de "Croissant a la plancha"

#### Scenario: Una categoría sin platos activos no aparece
- **WHEN** todos los platos de una categoría están archivados
- **THEN** la carta no muestra esa categoría

### Requirement: La carta muestra solo los platos activos
El sistema MUST mostrar todos los platos activos de cada categoría y MUST NOT mostrar jamás en la carta pública un plato archivado ni una categoría archivada.

#### Scenario: Un plato archivado desaparece de la carta
- **WHEN** el dueño archiva un plato que estaba publicado
- **THEN** la siguiente consulta de la carta ya no incluye ese plato

#### Scenario: Un plato restaurado vuelve a la carta
- **WHEN** el dueño restaura un plato archivado
- **THEN** la siguiente consulta de la carta vuelve a incluirlo en su categoría y posición

#### Scenario: Un plato nuevo aparece sin intervención del cliente
- **WHEN** el dueño crea un plato nuevo en una categoría
- **THEN** la siguiente consulta de la carta lo incluye, sin que el cliente tenga que actualizar ni instalar nada

### Requirement: Contenido de la ficha de un plato
El sistema MUST mostrar, para cada plato de la carta, su nombre, su precio en euros con el IVA incluido, su descripción corta y sus alérgenos; MUST mostrar su foto cuando el plato la tenga y MUST presentar el plato correctamente cuando no la tenga.

#### Scenario: Plato con todos sus datos
- **WHEN** el cliente ve un plato con nombre, precio, descripción y foto
- **THEN** la carta muestra el nombre, el precio en euros con IVA incluido, la descripción corta y la foto

#### Scenario: Plato sin foto
- **WHEN** un plato no tiene foto
- **THEN** la carta muestra el plato con su nombre, precio, descripción y alérgenos, sin hueco roto ni imagen de error

#### Scenario: El precio se muestra en euros con IVA incluido
- **WHEN** un plato cuesta 2,50 € con IVA incluido
- **THEN** la carta muestra "2,50 €" con la coma decimal española, sin desgloses ni recargos posteriores

### Requirement: Declaración de alérgenos siempre visible
El sistema MUST mostrar la información de alérgenos en todos los platos de la carta, sin que el cliente tenga que desplegar, pulsar ni navegar a otra pantalla. Los alérgenos declarables son exclusivamente los 14 de declaración obligatoria de la normativa europea: cereales con gluten, crustáceos, huevos, pescado, cacahuetes, soja, lácteos, frutos de cáscara, apio, mostaza, granos de sésamo, dióxido de azufre y sulfitos, altramuces y moluscos. Un plato sin ninguno de ellos MUST declarar explícitamente "Sin alérgenos". El sistema MUST NOT presentar nunca un plato sin declaración de alérgenos.

#### Scenario: Plato con alérgenos
- **WHEN** un bocadillo contiene cereales con gluten y lácteos
- **THEN** la carta muestra en la ficha del plato, siempre visibles, los alérgenos "Cereales con gluten" y "Lácteos"

#### Scenario: Plato sin ningún alérgeno
- **WHEN** un plato no contiene ninguno de los 14 alérgenos de declaración obligatoria
- **THEN** la carta muestra explícitamente "Sin alérgenos" en su ficha

#### Scenario: Los alérgenos no se esconden tras una interacción
- **WHEN** el cliente recorre la carta sin pulsar en ningún plato
- **THEN** cada plato visible muestra ya su declaración de alérgenos

### Requirement: Carga rápida en móvil
La carta pública MUST quedar utilizable en menos de 2 segundos en un móvil de gama media sobre una conexión 4G, con el catálogo completo de la cafetería.

#### Scenario: Carga con el catálogo completo
- **WHEN** un cliente abre la carta desde un móvil de gama media con 4G y el catálogo tiene todas las categorías y platos de la cafetería
- **THEN** la carta queda visible y navegable en menos de 2 segundos

#### Scenario: Las fotos no bloquean la lectura de la carta
- **WHEN** las fotos de los platos aún se están descargando
- **THEN** los nombres, precios, descripciones y alérgenos ya son legibles y la maqueta no salta al llegar cada foto

### Requirement: Carta legible para personas mayores en el móvil
La carta MUST ser legible en un móvil a contraluz por personas mayores: texto de tamaño suficiente, contraste alto entre texto y fondo, y zonas pulsables amplias. La carta MUST seguir siendo legible cuando el cliente ha aumentado el tamaño de letra de su sistema.

#### Scenario: Contraste y tamaño de texto
- **WHEN** el cliente abre la carta en un móvil
- **THEN** el texto de nombres, precios y alérgenos cumple un contraste mínimo de 4,5:1 sobre su fondo y el cuerpo de texto no baja de 16 píxeles

#### Scenario: Cliente con el texto del sistema ampliado
- **WHEN** el cliente tiene el tamaño de letra del sistema al 200 %
- **THEN** la carta sigue siendo legible y navegable, sin texto cortado ni solapado

### Requirement: Carta vacía
Cuando el catálogo no tiene ningún plato activo, el sistema MUST mostrar un mensaje claro en lugar de una pantalla en blanco o un error.

#### Scenario: Catálogo sin platos activos
- **WHEN** el cliente abre la carta y no hay ningún plato activo en ninguna categoría
- **THEN** la carta muestra un mensaje indicando que la carta no está disponible en este momento
