# Data Model: Exportar todos mis presupuestos en un .zip

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

## La regla que manda

Esta funcionalidad **no añade ni una entidad al almacenamiento, ni un campo, ni una clave**. El documento JSON de la spec 001 se lee y se deja exactamente como estaba (FR-021).

Todo lo que aparece aquí se **deriva** en el momento de exportar y muere con la descarga.

## Entidades derivadas (viven solo durante la exportación)

### `Copia`

Lo que se descarga. No se guarda en ninguna parte.

| Campo | Cómo se obtiene | Requisito |
|---|---|---|
| `nombre` | `presupuestospro-copia-` + fecha de hoy en `AAAA-MM-DD` + `.zip` | FR-005 |
| `documentos` | Un `DocumentoCopia` por cada presupuesto completo | FR-006, FR-008 |
| `archivoDatos` | El `SobreCopia`, serializado | FR-006, FR-013 |

### `DocumentoCopia`

Un PDF dentro de la copia.

| Campo | Cómo se obtiene | Requisito |
|---|---|---|
| `nombre` | `<numero> - <cliente saneado>.pdf`, desduplicado si hiciera falta | FR-010, FR-011, FR-012 |
| `contenido` | Los bytes de `construirDocumento(presupuesto, perfil)` | FR-007 |

### `SobreCopia`

La marca de identidad más los datos intactos. Formato exacto en [contracts/archivo-datos.md](./contracts/archivo-datos.md).

| Campo | Valor | Requisito |
|---|---|---|
| `aplicacion` | `"PresupuestosPro"`, fijo | FR-014a |
| `formatoCopia` | `1` en esta versión | FR-014a |
| `exportadoEl` | Momento de la exportación, con fecha y hora | FR-014a |
| `datos` | El documento guardado, **copiado sin modificar** | FR-013, FR-014 |

### `ProgresoExportacion`

Lo que el freelancer ve mientras espera. No se guarda.

| Campo | Cómo se obtiene | Requisito |
|---|---|---|
| `total` | Cuántos presupuestos completos hay que documentar | FR-019 |
| `hechos` | Cuántos llevan empaquetados | FR-019 |
| `estado` | `inactivo` · `preparando` · `terminado` · `fallido` | FR-003, FR-019, FR-020 |

## Reglas derivadas

### Qué presupuestos generan PDF

Un presupuesto genera PDF si está **completo**: tiene número y nombre de cliente. Es la misma condición que la spec 002 usa para decir que **no** es Borrador, y se consulta con la función que ya existe (`situacionDe`): generan PDF los que salen `Vigente` o `Caducado`.

Esta funcionalidad **no redefine la situación de un presupuesto ni añade ninguna nueva** (FR-008, FR-009).

| Situación | ¿PDF en la copia? | ¿En el archivo de datos? |
|---|---|---|
| Vigente | Sí | Sí |
| Caducado | Sí | Sí |
| Borrador | No | **Sí** |

### Cuándo se bloquea la exportación

El único caso que no produce archivo es **no tener absolutamente nada**: sin perfil relleno, sin clientes, sin servicios y sin presupuestos (FR-016).

| Situación de partida | Resultado |
|---|---|
| Todo vacío | Aviso, cero descargas |
| Hay perfil, clientes o servicios, pero ningún presupuesto | Se descarga: archivo de datos, sin PDF (FR-017) |
| Hay presupuestos, todos en Borrador | Se descarga: archivo de datos, sin PDF, con el aviso de cuántos se omitieron (FR-018) |
| Hay presupuestos completos | Se descarga: PDF + archivo de datos |

### Nombres de archivo

Regla completa, con ejemplos, en [contracts/estructura-copia.md](./contracts/estructura-copia.md). Se calcula en `src/dominio/nombresCopia.ts` y lleva pruebas automáticas.

## Trazabilidad: cada módulo nuevo a su requisito

| Módulo | Requisitos que cubre |
|---|---|
| `src/dominio/nombresCopia.ts` | FR-005, FR-010, FR-011, FR-012 |
| `src/dominio/sobreCopia.ts` | FR-013, FR-014, FR-014a, FR-015 |
| `src/exportacion/exportarCopia.ts` | FR-004, FR-006, FR-007, FR-008, FR-009, FR-016, FR-017, FR-020, FR-020a, FR-021, FR-022 |
| `src/componentes/BotonExportar.tsx` | FR-001, FR-002, FR-003, FR-015, FR-018, FR-018a, FR-019, FR-023 |
| `src/paginas/Inicio.tsx`, `src/paginas/Presupuestos.tsx` | FR-001 |

## Lo que explícitamente NO se guarda

- **Cuándo fue la última copia.** No se registra en ningún sitio. Sin ese dato no puede haber avisos del tipo «hace mucho que no exportas», que la spec deja fuera de alcance.
- **Un historial de exportaciones.** Cada copia es un acto aislado.
- **Ninguna marca en los presupuestos exportados.** Un presupuesto no sabe ni tiene por qué saber si ha entrado en una copia (FR-021).
