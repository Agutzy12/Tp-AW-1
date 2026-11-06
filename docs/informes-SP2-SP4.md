# Informes de avance — SP2, SP3 y SP4

> Borrador para pasar a Google Docs y exportar a PDF (un informe por entrega).

---

## SP2 — Estructura HTML

### Lo desarrollado

- Seis páginas: `index.html` (inicio), `catalogo.html`, `contacto.html`, `checkout.html` (finalizar compra), `confirmacion.html` y `404.html`.
- `index.html` está en la raíz y cumple la función de presentación del vivero.
- Recursos ordenados en carpetas: `css/`, `js/`, `data/`, `img/productos/`, `img/iconos/`.
- **Etiquetado semántico:** `header`, `nav`, `main`, `section`, `article` (cada producto), `aside` (carrito y resumen), `footer`, `address`, `fieldset`/`legend` en los formularios, `ol` para los pasos de compra, `dl` para los totales.
- **Accesibilidad:**
  - Enlace "Saltar al contenido principal" para teclado.
  - `aria-label` en botones con solo ícono (menú, carrito, cerrar, eliminar).
  - `aria-expanded` y `aria-controls` en el menú y el carrito.
  - `aria-current="page"` en el enlace de la página actual y `aria-current="step"` en los pasos de compra.
  - `role="dialog"` y `aria-modal` en el carrito lateral.
  - `role="status"`/`aria-live` para anunciar cambios (resultados, avisos).
  - `aria-invalid` y `aria-describedby` para asociar los errores a cada campo.
  - `alt` descriptivo en imágenes informativas y `alt=""` en las decorativas.

### Cambios respecto a la propuesta

**[A COMPLETAR]** (ej.: "Se agregó la página 404 y la sección Sobre nosotros se integró en el inicio").

---

## SP3 — Estilos CSS

### Lo desarrollado

- **Organización:** `estilos.css` importa cuatro archivos según su responsabilidad (`base`, `layout`, `componentes`, `paginas`).
- **Nomenclatura BEM** en español: bloque (`.producto`), elemento (`.producto__nombre`) y modificador (`.producto--agotado`, `.boton--primario`).
- **Variables CSS** (`:root`) para colores, tipografías, espaciados y bordes, así el diseño es consistente y fácil de cambiar.
- **Responsive, *mobile first*:** los estilos base son para celular y las media queries agregan cambios en:
  - `min-width: 600px` → formularios en dos columnas y más categorías por fila.
  - `min-width: 900px` → menú horizontal, filtros en barra lateral fija, checkout en dos columnas.
- Grilla de productos con `grid-template-columns: repeat(auto-fill, minmax(...))`, que se adapta sola al ancho.
- Estados visuales: foco visible (`:focus-visible`), hover, campos con error, botones deshabilitados, producto sin stock.
- Se respeta `prefers-reduced-motion` para quienes desactivan las animaciones.

### Cambios respecto a la propuesta

**[A COMPLETAR]**

---

## SP4 / SP5 — JavaScript

### Lo desarrollado

- **JSON propio** (`data/productos.json`) con categorías y 19 productos (id, nombre, categoría, precio, stock, luz, cuidado, destacado, imagen, descripción).
- **`fetch`** en `js/modules/api.js` para leer el JSON, con manejo de errores (estado de error y botón "Reintentar").
- **Renderizado dinámico:** destacados del inicio, grilla del catálogo, carrito, resumen y comprobante.
- **Eventos:**
  - `input` en el formulario de filtros → actualiza el catálogo al instante.
  - `click` con delegación de eventos para "Agregar", sumar, restar y eliminar.
  - `submit` en los formularios de contacto y de compra.
  - `keydown` para cerrar el carrito o el menú con Escape.
  - `storage` para sincronizar el carrito entre pestañas.
- **Carrito de ciclo completo:** agregar → modificar cantidades (con tope de stock) → finalizar compra → validar datos → confirmación con número de pedido. Persiste en `localStorage`.
- **Validaciones** (`js/modules/validaciones.js`): reglas reutilizables (requerido, mínimo, máximo, solo letras, email, teléfono, código postal, selección, aceptado). Validan al salir de cada campo y al enviar, muestran el mensaje debajo del campo y llevan el foco al primer error. La dirección solo se valida si se elige envío a domicilio.
- **Modularización:** módulos ES (`import`/`export`). Un archivo por responsabilidad en `js/modules/` y un punto de entrada por página en `js/pages/`.

### Cambios respecto a la propuesta

**[A COMPLETAR]**
