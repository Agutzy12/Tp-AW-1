// Funciones que convierten datos en HTML. No modifican el DOM:
// devuelven texto que cada página inserta donde corresponde.

import { escaparHTML, formatearPrecio, ETIQUETAS_LUZ, ETIQUETAS_CUIDADO } from "./formato.js";

const ICONO_PAPELERA = `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ICONOS_LUZ = {
  sol: "img/iconos/sol.svg",
  "media-sombra": "img/iconos/media-sombra.svg",
  sombra: "img/iconos/sombra.svg",
};

export function crearTarjetaProducto(producto, nombreCategoria = "") {
  const nombre = escaparHTML(producto.nombre);
  const sinStock = producto.stock <= 0;
  const pocasUnidades = !sinStock && producto.stock <= 3;

  const etiqueta = sinStock
    ? `<p class="producto__etiqueta producto__etiqueta--agotado">Sin stock</p>`
    : pocasUnidades
      ? `<p class="producto__etiqueta producto__etiqueta--ultimas">¡Últimas ${producto.stock} unidades!</p>`
      : "";

  const datos = [];
  if (producto.luz) {
    datos.push(`<li class="producto__dato"><img src="${ICONOS_LUZ[producto.luz]}" alt="" width="18" height="18">${ETIQUETAS_LUZ[producto.luz]}</li>`);
  }
  if (producto.cuidado) {
    datos.push(`<li class="producto__dato"><img src="img/iconos/riego.svg" alt="" width="18" height="18">${ETIQUETAS_CUIDADO[producto.cuidado]}</li>`);
  }

  return `
    <article class="producto${sinStock ? " producto--agotado" : ""}" aria-labelledby="producto-${producto.id}">
      <div class="producto__media">
        <img class="producto__imagen" src="${escaparHTML(producto.imagen)}" alt="Ilustración de ${nombre}" width="300" height="300" loading="lazy">
        ${etiqueta}
      </div>
      <div class="producto__cuerpo">
        <p class="producto__categoria">${escaparHTML(nombreCategoria)}</p>
        <h3 class="producto__nombre" id="producto-${producto.id}">${nombre}</h3>
        <p class="producto__descripcion">${escaparHTML(producto.descripcion)}</p>
        ${datos.length ? `<ul class="producto__datos" aria-label="Necesidades de la planta">${datos.join("")}</ul>` : ""}
        <div class="producto__pie">
          <p class="producto__precio">${formatearPrecio(producto.precio)}</p>
          <button class="boton boton--primario boton--chico" type="button" data-agregar="${producto.id}"
            ${sinStock ? "disabled" : ""} aria-label="${sinStock ? `${nombre} sin stock` : `Agregar ${nombre} al carrito`}">
            ${sinStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </article>`;
}

// Fila de un producto dentro del carrito, con controles para cambiar la cantidad.
export function crearItemCarrito(item) {
  const nombre = escaparHTML(item.nombre);
  const enElMaximo = item.cantidad >= item.stock;

  return `
    <li class="item-carrito">
      <img class="item-carrito__imagen" src="${escaparHTML(item.imagen)}" alt="" width="64" height="64">
      <div class="item-carrito__info">
        <p class="item-carrito__nombre">${nombre}</p>
        <p class="item-carrito__precio">${formatearPrecio(item.precio)} c/u</p>
        <div class="cantidad" role="group" aria-label="Cantidad de ${nombre}">
          <button class="cantidad__boton" type="button" data-accion="restar" data-id="${item.id}" aria-label="Restar una unidad de ${nombre}">−</button>
          <span class="cantidad__valor">${item.cantidad}</span>
          <button class="cantidad__boton" type="button" data-accion="sumar" data-id="${item.id}" aria-label="Sumar una unidad de ${nombre}" ${enElMaximo ? "disabled" : ""}>+</button>
        </div>
        ${enElMaximo ? `<p class="item-carrito__aviso">Máximo disponible</p>` : ""}
      </div>
      <div class="item-carrito__lateral">
        <p class="item-carrito__subtotal">${formatearPrecio(item.precio * item.cantidad)}</p>
        <button class="item-carrito__quitar" type="button" data-accion="quitar" data-id="${item.id}" aria-label="Eliminar ${nombre} del carrito">${ICONO_PAPELERA}</button>
      </div>
    </li>`;
}

// Fila de solo lectura para resúmenes (comprobante de pedido).
export function crearFilaResumen(item) {
  return `
    <li class="resumen__fila">
      <span class="resumen__producto">${item.cantidad} × ${escaparHTML(item.nombre)}</span>
      <span class="resumen__importe">${formatearPrecio(item.precio * item.cantidad)}</span>
    </li>`;
}
