# Contrato: documento de datos guardado en el navegador

**Tipo de contrato**: formato de los datos persistidos (FR-017)
**Dónde vive**: `localStorage`, clave `presupuestospro.datos`
**Formato**: un único documento JSON

## Por qué existe este contrato

Es el "archivo" del freelancer. Mientras su formato se respete, la aplicación puede cambiar por dentro sin que él pierda su histórico. El campo `version` permite, en el futuro, leer datos antiguos y adaptarlos; en v1 su valor es `1` y no hay ninguna migración que hacer.

## Estructura

```json
{
  "version": 1,
  "perfil": {
    "nombre": "Ana Ruiz Molina",
    "nif": "12345678Z",
    "contacto": "Calle Mayor 3, 28013 Madrid\nana@anaruiz.es\n600 123 456",
    "logo": {
      "datos": "data:image/png;base64,iVBORw0KGgo...",
      "ancho": 512,
      "alto": 128
    }
  },
  "clientes": [
    {
      "id": "cli_7f3a",
      "nombre": "Estudio Marbre S.L.",
      "nif": "B12345678",
      "contacto": "Gran Via 42, 08007 Barcelona",
      "tipo": "empresa"
    }
  ],
  "servicios": [
    {
      "id": "srv_2b91",
      "nombre": "Diseño de página web",
      "precioPorDefecto": 1500
    }
  ],
  "presupuestos": [
    {
      "id": "pre_a41c",
      "numero": "2026-001",
      "fechaEmision": "2026-09-18",
      "fechaValidez": "2026-10-18",
      "clienteId": "cli_7f3a",
      "cliente": {
        "nombre": "Estudio Marbre S.L.",
        "nif": "B12345678",
        "contacto": "Gran Via 42, 08007 Barcelona",
        "tipo": "empresa"
      },
      "lineas": [
        {
          "id": "lin_1",
          "descripcion": "Diseño de página web",
          "cantidad": 1,
          "precioUnitario": 1500,
          "origen": "catalogo",
          "servicioId": "srv_2b91"
        },
        {
          "id": "lin_2",
          "descripcion": "Sesión de fotos de producto",
          "cantidad": 1,
          "precioUnitario": 500,
          "origen": "manual"
        }
      ],
      "retencionActivada": true,
      "tipoRetencion": 15
    }
  ]
}
```

## Reglas del contrato

| Regla | Detalle |
|---|---|
| Documento único | Todo se guarda y se lee de una sola vez; no hay claves sueltas repartidas por el almacenamiento |
| Importes | Números en euros con decimales (`1500`, `1500.5`). Nunca cadenas de texto ni céntimos enteros |
| Fechas | Texto `AAAA-MM-DD`. El formato visible `18/09/2026` se genera al mostrarlas, no se guarda |
| Importes calculados | **No se guardan**. Base, IVA, retención y total se recalculan siempre desde las líneas |
| Datos copiados | `cliente` (dentro del presupuesto) y `descripcion`/`precioUnitario` (dentro de la línea) son copias congeladas, no referencias |
| Documento ausente o ilegible | La aplicación arranca con datos vacíos y avisa; nunca se queda en blanco sin explicación |
| Escritura | Se guarda tras cada cambio confirmado por el usuario; si el navegador lo impide, se avisa en pantalla |
