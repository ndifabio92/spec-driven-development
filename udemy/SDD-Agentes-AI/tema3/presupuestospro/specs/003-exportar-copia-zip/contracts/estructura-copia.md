# Contrato: qué hay dentro de la copia y cómo se llama cada cosa

**Tipo de contrato**: estructura del archivo que se descarga (FR-004 a FR-012)
**Dónde se calcula**: `src/dominio/nombresCopia.ts`, con pruebas automáticas

## Por qué existe este contrato

Es lo primero que el freelancer ve al descomprimir, y lo único que le permite encontrar un presupuesto concreto dentro de la copia. Un nombre mal construido no da un error: da un archivo que no se abre, o dos presupuestos que se pisan y uno que desaparece sin aviso.

## Estructura

Todo va en la raíz. Sin carpetas: al descomprimir se ve el contenido de un vistazo.

```text
presupuestospro-copia-2026-03-15.zip
├── 2026-001 - Estudio García.pdf
├── 2026-002 - Diseño-Web S.L..pdf
├── 2026-003 - Ayuntamiento de Cuenca.pdf
└── datos-presupuestospro.json
```

## Nombre del archivo comprimido

```text
presupuestospro-copia-AAAA-MM-DD.zip
```

- La fecha es **la del día de la exportación**, tomada del dispositivo, en el mismo orden `AAAA-MM-DD` que ya usan las fechas guardadas.
- No se numeran las versiones: dos copias del mismo día se llaman igual, y es el sistema operativo quien decide si renombra la segunda descarga.

| Exportado el | Nombre |
|---|---|
| 15 de marzo de 2026 | `presupuestospro-copia-2026-03-15.zip` |
| 1 de enero de 2027 | `presupuestospro-copia-2027-01-01.zip` |

## Nombre de cada PDF

Patrón: `<número> - <cliente>.pdf`

El número **nunca se altera**: es lo que identifica el documento y ya viene con un formato seguro (`AAAA-NNN`). Lo que se limpia es el nombre del cliente.

### Reglas de saneado, en este orden

1. **Sustituir por un guion** los caracteres que ningún sistema de archivos admite: `/ \ : * ? " < > |` y cualquier carácter de control.
2. **Conservar los acentos y la eñe.** `García` sigue siendo `García`. El formato de archivo marca el nombre como UTF-8 para que se extraiga bien también fuera de España.
3. **Colapsar los espacios** repetidos que hayan quedado y recortar los espacios sobrantes al principio y al final del nombre del cliente.
4. **Conservar los puntos, también el del final.** `S.L.` sigue siendo `S.L.`, y el archivo queda `2026-002 - Diseño-Web S.L..pdf`, con dos puntos seguidos. Es correcto y se abre sin problemas: lo que Windows no admite es un nombre que **termine** en punto o espacio, y detrás siempre va `.pdf`.
5. **Recortar el nombre del cliente a 60 caracteres** si se pasa, y volver a quitar los espacios que queden al final del recorte. El número nunca se recorta.
6. **Si el nombre queda vacío** tras la limpieza, usar `Cliente`. Es una red de seguridad: FR-008 deja fuera de la copia los presupuestos sin nombre de cliente, así que esta regla no debería activarse nunca.
7. **Si dos nombres coinciden**, añadir ` (2)`, ` (3)`… al segundo y siguientes, antes de la extensión.

### Ejemplos

| Número | Cliente | Nombre del archivo |
|---|---|---|
| `2026-001` | `Estudio García` | `2026-001 - Estudio García.pdf` |
| `2026-002` | `Diseño/Web S.L.` | `2026-002 - Diseño-Web S.L..pdf` |
| `2026-003` | `Pérez & Hijos: obra "La Vega"` | `2026-003 - Pérez & Hijos- obra -La Vega-.pdf` |
| `2026-004` | `   ` (solo espacios) | `2026-004 - Cliente.pdf` — la red de seguridad de la regla 6 |
| `2026-005` | Un nombre de 120 caracteres | `2026-005 - <los 60 primeros>.pdf` |

> La regla 7 casi nunca se activa, porque el número de presupuesto es único y va delante. Existe para que el recuento de PDF del zip coincida **siempre** con el de presupuestos completos (FR-012), pase lo que pase con los nombres.

## Qué presupuestos entran

Solo los **completos**: con número y con nombre de cliente. Es la misma condición que ya distingue un Borrador en la lista.

Los borradores no generan PDF, pero **sus datos viajan íntegros** en `datos-presupuestospro.json`. No se pierde nada.

## El archivo de datos

Se llama siempre `datos-presupuestospro.json` y va uno solo, en la raíz. Su contenido está en [archivo-datos.md](./archivo-datos.md).

## Lo que este contrato NO permite

- **Carpetas dentro del zip.** Ni por año, ni por cliente, ni para separar borradores.
- **Renombrar o numerar copias del mismo día.**
- **Contraseña o cifrado.** Fuera de alcance por spec.
- **Repartir la copia en varios archivos.** Una exportación entrega un archivo o ninguno (FR-020a).
