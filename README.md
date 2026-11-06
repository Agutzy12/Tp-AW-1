# Vivero Brotes

Trabajo práctico de Aplicaciones Web 1. Es la web de un vivero (ficticio) de Córdoba donde se pueden ver las plantas, filtrarlas, armar un pedido con el carrito y hacer consultas.

## Páginas

- **Inicio:** presentación del vivero, categorías y productos destacados.
- **Catálogo:** todos los productos con filtros por categoría, luz, precio y búsqueda.
- **Contacto:** formulario para hacer consultas.
- **Checkout y confirmación:** para terminar la compra con los datos de entrega y pago.

## Cómo correrlo

Como los productos se cargan con `fetch` desde un JSON, no anda abriendo el `index.html` directo desde la carpeta. Hay que usar un servidor local, por ejemplo la extensión **Live Server** de VS Code.

## Estructura

```
├── index.html y demás páginas
├── css/      estilos
├── js/       scripts (modules/ con las funciones compartidas, pages/ uno por página)
├── data/     productos.json con los datos del catálogo
├── img/      imágenes e íconos
└── docs/     material para los informes
```

## Tecnologías

HTML, CSS y JavaScript.

---

Agustín Benítez
