# SP1 — Proyecto escrito: Vivero Brotes

> Borrador del contenido para pasar a Google Docs y exportar a PDF.
> Los puntos marcados con **[A COMPLETAR]** requieren trabajo propio (dibujos, Figma, capturas).

---

## 1.1 Descubrimiento y ficha técnica del producto

### 1.1.1 Datos del cliente

- **Nombre comercial:** Vivero Brotes
- **Rubro:** vivero, venta de plantas, macetas e insumos de jardinería
- **Tipo de cliente:** ficticio — emprendimiento familiar
- **Ubicación:** Córdoba Capital, Argentina
- **Antigüedad:** desde 2012
- **Contacto:** hola@viverobrotes.com.ar

### 1.1.2 Objetivos del proyecto web

1. Vender online y ampliar el alcance más allá de los clientes que se acercan al local.
2. Reducir las consultas repetitivas por WhatsApp (precios, stock, cuidados), mostrando esa información en el catálogo.
3. Ordenar los pedidos: que lleguen con todos los datos necesarios (productos, entrega y pago).
4. Posicionar la marca como referente en asesoramiento de plantas en Córdoba.

### 1.1.3 Descripción del producto web y modelo de negocio

Vivero Brotes es un sitio con catálogo interactivo y carrito de compras. El usuario puede filtrar las plantas según su espacio (por ejemplo, cuánta luz recibe), armar el pedido y elegir entre retiro en el vivero o envío a domicilio.

- **Modelo de negocio:** venta directa B2C. Los ingresos vienen de la venta de productos y del costo de envío ($ 4.500, gratis desde $ 60.000 para subir el ticket promedio).
- **Valor diferencial:** información de cuidados en cada producto (luz y dificultad) y asesoramiento gratuito por el formulario de contacto.

### 1.1.4 Proto-persona e historias de usuario

#### 1.1.4.1 Proto-persona

> **Lucía Fernández, 29 años** — Diseñadora gráfica, trabaja desde su departamento en Nueva Córdoba.
>
> - **Contexto:** se mudó hace poco a un departamento con poca luz y quiere decorarlo con plantas. Compra casi todo desde el celular.
> - **Objetivos:** tener plantas que sobrevivan en interiores sin dedicarles mucho tiempo; recibir la compra en su casa.
> - **Frustraciones:** se le secaron plantas por no saber cuidarlas; en otros viveros tiene que preguntar precio por precio por WhatsApp y esperar respuesta.
> - **Comportamiento digital:** usa Instagram para inspirarse y compra online frecuentemente; valora la información clara y rápida.

#### 1.1.4.2 Historias de usuario

1. **Objetivo/necesidad:** *Como* Lucía, *quiero* filtrar las plantas según la luz de mi departamento *para* comprar solo las que van a sobrevivir en mi espacio.
   - Criterio de aceptación: el catálogo tiene un filtro "Luz que recibe tu espacio" y cada producto muestra su necesidad de luz y cuidado.
2. **Frustración/punto de dolor:** *Como* Lucía, *quiero* ver precio y stock de cada producto y confirmar el pedido en el momento *para* no tener que consultar uno por uno por WhatsApp y esperar respuesta.
   - Criterio de aceptación: cada tarjeta muestra precio y avisa si no hay stock o quedan pocas unidades; el pedido se confirma con un número de comprobante.

#### 1.1.4.3 Flujo de usuario (User Flow)

```
Inicio ─→ Catálogo ─→ Filtrar (luz / categoría / precio) ─→ Agregar al carrito
                                                                   │
                                                                   ▼
Confirmación ←─ Validación OK ←─ Datos de entrega y pago ←─ Finalizar compra ←─ Revisar carrito (panel lateral)
                     │
                     └─ Error → muestra mensajes en los campos → corregir → reintentar
```

**[A COMPLETAR]** Pasar este flujo a un diagrama en draw.io, Excalidraw o Canva.

### 1.1.5 Requerimientos funcionales frontend

1. Menú de navegación responsive (botón hamburguesa en celulares).
2. Catálogo renderizado desde un archivo JSON con `fetch`.
3. Filtros combinables: búsqueda por texto, categoría, luz, precio máximo, solo con stock y orden.
4. Indicadores de stock: "Sin stock" (botón deshabilitado) y "Últimas unidades".
5. Carrito lateral desplegable: agregar, sumar/restar cantidades (con tope de stock), eliminar y vaciar.
6. Contador de productos en el ícono del carrito, visible en todas las páginas.
7. Persistencia del carrito al cambiar de página o recargar (localStorage).
8. Página de finalizar compra con resumen editable y cálculo de envío según el método de entrega.
9. Validación de formularios en tiempo real con mensajes de error accesibles.
10. Pantallas de notificación: confirmación del pedido, consulta enviada, carrito vacío, error de carga y página 404.
11. Avisos flotantes al agregar o quitar productos.

## 1.2 Arquitectura de la información

### 1.2.1 Sitemap

```
Inicio (index.html)
├── Categorías → Catálogo filtrado
├── Destacados
├── Cómo comprar
└── Sobre nosotros (#nosotros)

Catálogo (catalogo.html)
└── [Carrito lateral] → Finalizar compra (checkout.html)
                         └── Confirmación (confirmacion.html)

Contacto (contacto.html)
└── Mensaje de consulta enviada

Página 404 (404.html)
```

**[A COMPLETAR]** Pasarlo a un diagrama jerárquico.

### 1.2.2 Estrategia de navegación (MPA / SPA)

#### 1.2.2.1 Secciones MPA (páginas tradicionales)

Inicio, Catálogo, Contacto, Finalizar compra y Confirmación son páginas HTML independientes, cada una con su URL, `<title>` y `meta description`. Así cada sección se puede indexar en buscadores (SEO), compartir con un enlace y usar con el botón "atrás" del navegador.

#### 1.2.2.2 Módulos SPA (sin recargar la página)

- **Filtros del catálogo:** al cambiar un filtro, la grilla se actualiza al instante sin recargar. La categoría elegida se refleja en la URL (`?categoria=interior`), así el enlace se puede compartir.
- **Carrito lateral:** se abre como un panel sobre cualquier página; agregar, quitar o cambiar cantidades no recarga la página.
- **Formularios:** la validación y el mensaje de éxito se muestran sin recargar.

## 1.3 Diseño de interfaz (UX / UI)

> Incluir como mínimo Inicio, Catálogo y Contacto, en escritorio (1440 px) y celular (375 px).

- **1.3.1 Bocetos a mano:** **[A COMPLETAR]** dibujar en papel, sacar foto y pegar.
- **1.3.2 Wireframes:** **[A COMPLETAR]** en Figma, en escala de grises, con frames de 1440 px y 375 px.
- **1.3.3 Mockup:** **[A COMPLETAR]** en Figma, con la guía de estilo de abajo.

**Guía de estilo usada en el sitio:**

| Elemento | Valor |
| --- | --- |
| Verde principal | `#2F6B3A` |
| Verde oscuro (títulos, pie) | `#1F4D28` |
| Verde claro (fondos) | `#DCEAD3` |
| Terracota (acento) | `#B4612A` |
| Fondo crema | `#F7F4EC` |
| Tipografía de títulos | Fraunces (serif) |
| Tipografía de texto | Nunito Sans (sans serif) |
| Bordes | redondeados (14 px tarjetas, botones tipo píldora) |

## 1.4 Infraestructura web y dominio

### 1.4.1 Selección de dominio

- **1.4.1.1 Dominio propuesto:** `viverobrotes.com.ar`
- **1.4.1.2 Registro / plataforma:** NIC Argentina — https://nic.ar **[A COMPLETAR: verificar disponibilidad y agregar captura]**
- **1.4.1.3 Justificación:** se eligió un TLD `.com.ar` porque el vivero solo vende y hace envíos dentro de Argentina (Córdoba). Le da confianza al público local, ayuda al posicionamiento en búsquedas desde Argentina y el registro en NIC Argentina es económico. `.com` indica que es una actividad comercial.
