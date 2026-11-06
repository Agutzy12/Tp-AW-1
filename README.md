# Vivero Brotes — TP Aplicaciones Web 1

Sitio web front-end de un vivero ficticio de Córdoba (Vivero Brotes) que vende plantas, macetas e insumos online. Proyecto de la materia **Aplicaciones Web 1 – Sistemas**.

## Cómo verlo

El sitio usa `fetch` y módulos de JavaScript (`type="module"`), así que **no funciona abriendo el `index.html` con doble clic** (el navegador bloquea esas funciones con `file://`). Hay que servirlo desde un servidor local:

- **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
- **Python:** desde la carpeta del proyecto, `python -m http.server` y abrir `http://localhost:8000`.

## Páginas

| Página | Archivo | Función |
| --- | --- | --- |
| Inicio | `index.html` | Presentación del vivero, categorías, productos destacados, cómo comprar y "Sobre nosotros". |
| Catálogo | `catalogo.html` | Productos cargados desde JSON con filtros (búsqueda, categoría, luz, precio, stock) y orden. |
| Contacto | `contacto.html` | Formulario de consulta con validación. |
| Finalizar compra | `checkout.html` | Resumen editable del carrito y formulario de entrega y pago. |
| Confirmación | `confirmacion.html` | Pantalla de notificación con el comprobante del pedido. |
| Error 404 | `404.html` | Pantalla de notificación para páginas inexistentes. |

El **carrito** es un panel lateral disponible en todas las páginas (botón del encabezado). Se guarda en `localStorage`, así que no se pierde al cambiar de página.

## Estructura

```
├── index.html, catalogo.html, contacto.html, checkout.html, confirmacion.html, 404.html
├── css/
│   ├── estilos.css       → hoja principal (importa las demás)
│   ├── base.css          → variables, reset, elementos HTML
│   ├── layout.css        → encabezado, navegación, pie
│   ├── componentes.css   → botones, formularios, tarjetas, carrito, notificaciones
│   └── paginas.css       → estilos de cada página
├── js/
│   ├── modules/          → código reutilizable
│   │   ├── api.js            fetch del JSON
│   │   ├── carrito.js        estado del carrito (localStorage)
│   │   ├── filtros.js        filtrado y orden del catálogo
│   │   ├── formato.js        precios, textos, etiquetas
│   │   ├── pedido.js         envío y guardado del pedido
│   │   ├── render.js         HTML de productos e items
│   │   ├── ui.js             menú, carrito lateral, avisos
│   │   └── validaciones.js   validación de formularios
│   └── pages/            → un script por página (punto de entrada)
├── data/
│   └── productos.json    → datos del catálogo (simula una API REST)
├── img/
│   ├── productos/        → ilustraciones de cada producto
│   └── iconos/
└── docs/                 → borradores de los informes PDF
```

## Cumplimiento de las consignas

- **SP2 – HTML:** `index.html` en la raíz, etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `address`, `fieldset`), atributos ARIA (`aria-label`, `aria-expanded`, `aria-current`, `aria-live`, `aria-invalid`, `aria-describedby`, `role="dialog"`…) y recursos ordenados en carpetas.
- **SP3 – CSS:** nomenclatura BEM en español, variables CSS, diseño *mobile first* con media queries en 600 y 900 px.
- **SP4/SP5 – JavaScript:** eventos (filtros, carrito, formularios), JSON propio, `fetch`, renderizado dinámico, validación de formularios y código dividido en módulos ES.

## Tecnologías

HTML5, CSS3 y JavaScript (sin librerías). Tipografías de Google Fonts (Fraunces y Nunito Sans).
