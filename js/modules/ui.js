// Componentes de interfaz compartidos por todas las páginas:
// menú responsive, contador del carrito, carrito lateral y avisos flotantes.

import * as carrito from "./carrito.js";
import { crearItemCarrito } from "./render.js";
import { formatearPrecio } from "./formato.js";

export function iniciarInterfaz() {
  iniciarMenu();
  carrito.suscribir(actualizarContador);
  iniciarCarritoLateral();
}

/* ---------- Menú de navegación (mobile) ---------- */

function iniciarMenu() {
  const boton = document.querySelector("[data-boton-menu]");
  const menu = document.getElementById("menu-principal");
  if (!boton || !menu) return;

  const cambiarEstado = (abrir) => {
    boton.setAttribute("aria-expanded", String(abrir));
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("nav--abierto", abrir);
  };

  boton.addEventListener("click", () => {
    cambiarEstado(boton.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("nav--abierto")) {
      cambiarEstado(false);
      boton.focus();
    }
  });
}

/* ---------- Contador del carrito en el encabezado ---------- */

function actualizarContador() {
  const unidades = carrito.contarUnidades();

  document.querySelectorAll("[data-contador-carrito]").forEach((contador) => {
    contador.textContent = unidades;
    contador.hidden = unidades === 0;
  });

  document.querySelectorAll("[data-abrir-carrito]").forEach((boton) => {
    const texto = unidades === 1 ? "1 producto" : `${unidades} productos`;
    boton.setAttribute("aria-label", `Abrir carrito, ${texto}`);
  });
}

/* ---------- Acciones sobre los productos del carrito ---------- */

// Se usa con delegación de eventos en cualquier lista de items del carrito.
export function manejarAccionCarrito(evento) {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;
  const item = carrito.obtenerItems().find((elemento) => elemento.id === id);
  if (!item) return;

  if (accion === "sumar") carrito.cambiarCantidad(id, item.cantidad + 1);
  if (accion === "restar") carrito.cambiarCantidad(id, item.cantidad - 1);
  if (accion === "quitar") {
    carrito.quitar(id);
    mostrarAviso(`Quitaste ${item.nombre} del carrito.`);
  }

  // La lista se vuelve a dibujar: devolvemos el foco al mismo botón para
  // que quien navega con teclado no pierda su lugar.
  const contenedor = evento.currentTarget;
  const mismoBoton = contenedor.querySelector(`[data-accion="${accion}"][data-id="${id}"]:not(:disabled)`);
  const alternativa = contenedor.querySelector(`[data-accion="restar"][data-id="${id}"]`);
  (mismoBoton ?? alternativa ?? contenedor.closest("[data-zona-foco]"))?.focus();
}

// Conecta los botones "Agregar" de una grilla de productos con el carrito.
export function activarBotonesAgregar(contenedor, obtenerListaProductos) {
  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar]");
    if (!boton) return;

    const producto = obtenerListaProductos().find((p) => p.id === Number(boton.dataset.agregar));
    if (!producto) return;

    if (carrito.agregar(producto)) {
      mostrarAviso(`Agregaste ${producto.nombre} al carrito.`);
    } else {
      mostrarAviso(`No hay más stock disponible de ${producto.nombre}.`, "error");
    }
  });
}

/* ---------- Carrito lateral (comportamiento SPA) ---------- */

function iniciarCarritoLateral() {
  const panel = document.getElementById("carrito");
  const fondo = document.querySelector("[data-fondo-carrito]");
  if (!panel || !fondo) return;

  const lista = panel.querySelector("[data-carrito-lista]");
  const mensajeVacio = panel.querySelector("[data-carrito-vacio]");
  const pie = panel.querySelector("[data-carrito-pie]");
  const total = panel.querySelector("[data-carrito-total]");
  const botonCerrar = panel.querySelector("[data-cerrar-carrito]");
  const abridores = document.querySelectorAll("[data-abrir-carrito]");
  let elementoPrevio = null;

  const abrir = () => {
    elementoPrevio = document.activeElement;
    panel.hidden = false;
    fondo.hidden = false;
    document.body.classList.add("sin-scroll");
    abridores.forEach((boton) => boton.setAttribute("aria-expanded", "true"));
    botonCerrar.focus();
  };

  const cerrar = () => {
    panel.hidden = true;
    fondo.hidden = true;
    document.body.classList.remove("sin-scroll");
    abridores.forEach((boton) => boton.setAttribute("aria-expanded", "false"));
    elementoPrevio?.focus();
  };

  abridores.forEach((boton) => boton.addEventListener("click", abrir));
  botonCerrar.addEventListener("click", cerrar);
  fondo.addEventListener("click", cerrar);

  panel.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") cerrar();
    if (evento.key === "Tab") atraparFoco(panel, evento);
  });

  lista.addEventListener("click", manejarAccionCarrito);

  panel.querySelector("[data-vaciar-carrito]").addEventListener("click", () => {
    if (window.confirm("¿Querés quitar todos los productos del carrito?")) {
      carrito.vaciar();
      mostrarAviso("Vaciaste el carrito.");
      botonCerrar.focus();
    }
  });

  carrito.suscribir((items) => {
    lista.innerHTML = items.map(crearItemCarrito).join("");
    mensajeVacio.hidden = items.length > 0;
    pie.hidden = items.length === 0;
    total.textContent = formatearPrecio(carrito.calcularSubtotal(items));
  });
}

// Mantiene el foco del teclado dentro del panel mientras está abierto.
function atraparFoco(contenedor, evento) {
  const enfocables = Array.from(
    contenedor.querySelectorAll("a[href], button:not(:disabled), input, select, textarea")
  ).filter((elemento) => !elemento.closest("[hidden]"));

  const primero = enfocables[0];
  const ultimo = enfocables[enfocables.length - 1];

  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primero.focus();
  }
}

/* ---------- Avisos flotantes (notificaciones breves) ---------- */

let temporizadorAviso;

export function mostrarAviso(mensaje, tipo = "exito") {
  const aviso = document.querySelector("[data-aviso-flotante]");
  if (!aviso) return;

  aviso.textContent = mensaje;
  aviso.className = `aviso-flotante aviso-flotante--${tipo} aviso-flotante--visible`;

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => {
    aviso.classList.remove("aviso-flotante--visible");
  }, 3200);
}
