# Quickstart: arrancar, verificar y publicar

**Spec**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md)

## 1. Requisitos

- Node.js 20 o superior (incluye `npm`)
- Un navegador moderno (Chrome, Edge, Firefox o Safari)

## 2. Arrancar en local

```bash
npm install
npm run dev
```

La aplicación queda disponible en la dirección que indique la consola (normalmente `http://localhost:5173`).

Para probarla desde el móvil en la misma red wifi:

```bash
npm run dev -- --host
```

y abrir en el móvil la dirección de red que muestra la consola.

## 3. Comprobar que las cuentas están bien

```bash
npm test
```

Estas pruebas cubren lo único que no puede salir mal: base imponible, IVA, retención, total, redondeo y numeración anual. Incluyen el ejemplo de referencia de la spec.

## 4. Publicar online

```bash
npm run build
```

Genera la carpeta `dist/`. Esa carpeta se sube tal cual a cualquier alojamiento estático (Netlify, Vercel, GitHub Pages, Cloudflare Pages). No hay variables de entorno, ni claves, ni configuración de servidor: la navegación usa rutas con `#`, así que funciona sin reglas de reescritura.

Para ver el resultado final antes de publicar: `npm run preview`.

---

## 5. Guion de verificación manual

Este guion lo puede ejecutar cualquier persona, sin conocimientos técnicos, usando solo la aplicación. Cada paso corresponde a criterios de la spec.

### A. Mi marca (Historia 3 · SC-004)

1. Abrir **Perfil**, escribir nombre, NIF y datos de contacto, y subir un logo.
2. Guardar.
3. **Resultado esperado**: al volver a entrar en Perfil, los datos siguen ahí.

### B. Mi catálogo y mis clientes (Historias 4 y 5)

1. En **Catálogo**, crear "Diseño de página web" con precio 1500 y "Sesión de fotos de producto" con precio 500.
2. En **Clientes**, crear un cliente de tipo **empresa/autónomo** y otro de tipo **particular**.
3. **Resultado esperado**: ambos aparecen en sus listas y se pueden editar.

### C. El presupuesto del ejemplo (Historia 1 · SC-002)

1. Pulsar **Nuevo presupuesto** y elegir el cliente de tipo empresa.
2. Añadir las dos líneas desde el catálogo (1.500,00 € y 500,00 €).
3. Activar la retención de IRPF al **15 %**.
4. **Resultado esperado**, al céntimo:

   | Concepto | Importe |
   |---|---|
   | Base imponible | 2.000,00 € |
   | IVA (21 %) | 420,00 € |
   | Retención de IRPF (−15 %) | −300,00 € |
   | **Total a pagar** | **2.120,00 €** |

5. Cambiar la retención al **7 %** → el total pasa solo a **2.280,00 €**.
6. Cambiar el cliente por el de tipo **particular** → la retención deja de aplicarse y el total sube a **2.420,00 €**.

### D. Editar líneas (Historia 1 · FR-011)

1. Cambiar la cantidad de una línea y borrar la otra.
2. **Resultado esperado**: base, IVA, retención y total se actualizan solos, sin pulsar ningún botón de recalcular.

### E. El PDF (Historia 2 · SC-004)

1. Con el presupuesto del paso C (cliente empresa, retención 15 %), pulsar **Descargar PDF**.
2. **Resultado esperado**: se descarga `Presupuesto-2026-001.pdf` y al abrirlo se ven el logo, los datos del freelancer y del cliente, el número, la fecha de emisión, la validez a 30 días, la tabla de líneas y el desglose completo, con el total en 2.120,00 €.

### F. Numeración automática (SC-003)

1. Crear un segundo presupuesto.
2. **Resultado esperado**: recibe el número siguiente (por ejemplo, `2026-002`) sin escribir nada.

### G. Presupuesto vacío y presupuesto abandonado (FR-014 · FR-018)

1. Crear un presupuesto sin añadir ninguna línea e intentar descargar el PDF.
2. **Resultado esperado**: no se genera y aparece un aviso explicando que hace falta al menos una línea.
3. Volver a la lista sin haber añadido ninguna línea y crear después otro presupuesto, esta vez con una línea.
4. **Resultado esperado**: el presupuesto abandonado no aparece en la lista, y el nuevo recibe el número que le tocaba (no se ha quemado ninguno).

### H. Los datos siguen ahí (SC-005 · FR-017)

1. Cerrar completamente el navegador y volver a abrir la aplicación.
2. **Resultado esperado**: perfil, catálogo, clientes y presupuestos siguen tal y como se dejaron.

### I. Desde el móvil (encargo de negocio)

1. Repetir los pasos C y E desde un teléfono.
2. **Resultado esperado**: todo se lee sin hacer zoom, los botones se pulsan con el pulgar sin fallar, el teclado numérico aparece en los campos de importe, el total permanece visible mientras se editan las líneas y el PDF se descarga correctamente.

### J. Cronómetro del negocio (SC-001)

1. Con perfil y catálogo ya configurados, cronometrar la creación de un presupuesto completo y su descarga en PDF.
2. **Resultado esperado**: menos de 5 minutos.
