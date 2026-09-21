# Contrato: el archivo de datos de la copia

**Tipo de contrato**: formato del archivo destinado a restaurar (FR-013, FR-014, FR-014a)
**Dónde vive**: `datos-presupuestospro.json`, en la raíz del zip
**Dónde se construye**: `src/dominio/sobreCopia.ts`, con pruebas automáticas

## Por qué existe este contrato

Es el único puente entre esta funcionalidad y una que todavía no está escrita: la restauración. Las copias que el freelancer haga a partir de hoy tendrán que poder leerse dentro de dos años, con una versión de la aplicación que aún no existe. **Este formato ya no se puede cambiar retroactivamente**, y por eso se fija ahora.

El freelancer no necesita abrirlo nunca. Su trabajo es esperar quieto dentro del zip hasta que haga falta.

## Estructura

```json
{
  "aplicacion": "PresupuestosPro",
  "formatoCopia": 1,
  "exportadoEl": "2026-03-15T09:41:07.312Z",
  "datos": {
    "version": 1,
    "perfil": { "nombre": "...", "nif": "...", "contacto": "...", "logo": { "datos": "data:image/png;base64,...", "ancho": 512, "alto": 128 } },
    "clientes": [],
    "servicios": [],
    "presupuestos": []
  }
}
```

## Los campos del sobre

| Campo | Qué es | Para qué sirve el día de restaurar |
|---|---|---|
| `aplicacion` | El texto fijo `"PresupuestosPro"` | Reconocer que el archivo es una copia de esta herramienta y no otro JSON cualquiera que el freelancer haya arrastrado por error |
| `formatoCopia` | Un número entero. **`1`** en esta versión | Saber si la aplicación entiende la copia. Una copia con un número mayor viene de una versión más nueva y no debe leerse a medias |
| `exportadoEl` | Fecha y hora de la exportación, con zona horaria | Que el freelancer y la aplicación sepan de cuándo es la copia. Es lo que permite decir «vas a restaurar una copia del 15 de marzo, ¿seguro?» |
| `datos` | El documento guardado, **copiado sin modificar** | Es el contenido. Restaurar consistirá en validar el sobre y devolver esto a su sitio |

## La regla que no se puede romper

**`datos` es una copia literal de lo que había guardado.** Ni un campo añadido, ni uno quitado, ni un orden distinto, ni un número redondeado. Sigue siendo el documento de [almacen-schema.md](../../001-presupuestos-freelancer/contracts/almacen-schema.md), con su propio `version` dentro.

Si el sobre modificara los datos, restaurar dejaría de ser «devolver esto a su sitio» y pasaría a ser una traducción. Las traducciones se estropean.

## Los dos números de versión, y por qué son dos

- **`formatoCopia`** describe **el sobre**. Sube si algún día la copia lleva algo más.
- **`datos.version`** describe **el documento de datos**, y ya existía desde la spec 001. Sube si cambia el modelo de datos.

Son cosas independientes que cambian por motivos distintos. Un solo número obligaría a subirlo por razones que no tienen nada que ver entre sí, y la restauración perdería la información que necesita.

## Qué contiene, en claro

Todo lo que el freelancer tiene guardado:

- **Perfil**, con su NIF, su contacto y su **logo completo**.
- **Clientes**: la agenda entera, con NIF y datos de contacto de cada uno.
- **Servicios**: el catálogo.
- **Presupuestos**: todos, **también los borradores**, con la copia congelada de los datos de cliente que cada uno lleva dentro.

> Esto es información personal del freelancer y de terceros, en un archivo sin contraseña. Es exactamente el motivo del aviso que la aplicación muestra al terminar (FR-018a).

## Lo que este contrato NO incluye

- **Ninguna marca de exportación en los presupuestos**: el documento sale tal cual estaba.
- **Los PDF**: van aparte, como archivos del zip. El archivo de datos no los duplica.
- **Nada sobre cómo restaurar**: eso es otra spec. Aquí solo se garantiza que será posible.
