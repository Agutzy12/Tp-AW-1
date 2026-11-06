// Página de catálogo: carga los productos con fetch, los dibuja y aplica filtros
// sin recargar la página (comportamiento SPA).

import { iniciarInterfaz, activarBotonesAgregar } from "../modules/ui.js";
import { obtenerDatos } from "../modules/api.js";
import { crearTarjetaProducto } from "../modules/render.js";
import { filtrarProductos, leerFiltros } from "../modules/filtros.js";
import { formatearPrecio } from "../modules/formato.js";

iniciarInterfaz();

const formulario = document.getElementById("filtros");
const grilla = document.getElementById("grilla-productos");
const contador = document.getElementById("contador-resultados");
const rangoPrecio = formulario.elements["precio-maximo"];
const salidaPrecio = document.getElementById("salida-precio");
const estados = document.querySelectorAll("[data-estado]");

let productos = [];
let nombresCategoria = {};

function mostrarEstado(nombre) {
  estados.forEach((elemento) => {
    elemento.hidden = elemento.dataset.estado !== nombre;
  });
  grilla.hidden = nombre !== "lista";
  grilla.setAttribute("aria-busy", String(nombre === "cargando"));
}

function configurarRangoPrecio() {
  const maximo = Math.ceil(Math.max(...productos.map((p) => p.precio)) / 1000) * 1000;
  rangoPrecio.max = maximo;
  rangoPrecio.value = maximo;
  rangoPrecio.defaultValue = maximo;
  actualizarSalidaPrecio();
}

function actualizarSalidaPrecio() {
  const texto = `Hasta ${formatearPrecio(Number(rangoPrecio.value))}`;
  salidaPrecio.textContent = texto;
  rangoPrecio.setAttribute("aria-valuetext", texto);
}

// Permite llegar al catálogo ya filtrado desde el inicio: catalogo.html?categoria=interior
function aplicarCategoriaDeLaURL() {
  const categoria = new URLSearchParams(window.location.search).get("categoria");
  const opcion = formulario.querySelector(`input[name="categoria"][value="${CSS.escape(categoria ?? "")}"]`);
  if (opcion) opcion.checked = true;
}

function sincronizarURL(categoria) {
  const url = new URL(window.location.href);
  if (categoria === "todas") url.searchParams.delete("categoria");
  else url.searchParams.set("categoria", categoria);
  history.replaceState(null, "", url);
}

function actualizarCatalogo() {
  const filtros = leerFiltros(formulario);
  const resultado = filtrarProductos(productos, filtros);

  sincronizarURL(filtros.categoria);
  actualizarSalidaPrecio();

  contador.textContent =
    resultado.length === 1 ? "Se encontró 1 producto" : `Se encontraron ${resultado.length} productos`;

  if (resultado.length === 0) {
    grilla.innerHTML = "";
    mostrarEstado("vacio");
    return;
  }

  grilla.innerHTML = resultado
    .map((producto) => crearTarjetaProducto(producto, nombresCategoria[producto.categoria]))
    .join("");
  mostrarEstado("lista");
}

async function iniciarCatalogo() {
  mostrarEstado("cargando");
  contador.textContent = "Cargando productos…";

  try {
    const datos = await obtenerDatos();
    productos = datos.productos;
    nombresCategoria = Object.fromEntries(datos.categorias.map((c) => [c.id, c.nombre]));

    configurarRangoPrecio();
    aplicarCategoriaDeLaURL();
    actualizarCatalogo();
  } catch (error) {
    console.error(error);
    contador.textContent = "";
    mostrarEstado("error");
  }
}

/* ---------- Eventos ---------- */

formulario.addEventListener("input", actualizarCatalogo);
formulario.addEventListener("submit", (evento) => evento.preventDefault());

// El evento reset ocurre antes de que se restablezcan los valores.
formulario.addEventListener("reset", () => setTimeout(actualizarCatalogo));

document.querySelector("[data-limpiar-filtros]").addEventListener("click", () => {
  formulario.reset();
  actualizarCatalogo();
  formulario.elements.busqueda.focus();
});

document.querySelector("[data-reintentar]").addEventListener("click", iniciarCatalogo);

// Botón "Más filtros" (solo visible en celulares)
const botonFiltros = document.querySelector("[data-alternar-filtros]");
const filtrosExtra = document.getElementById("filtros-extra");

botonFiltros.addEventListener("click", () => {
  const abrir = botonFiltros.getAttribute("aria-expanded") !== "true";
  botonFiltros.setAttribute("aria-expanded", String(abrir));
  botonFiltros.textContent = abrir ? "Menos filtros" : "Más filtros";
  filtrosExtra.classList.toggle("filtros__extra--abierto", abrir);
});

activarBotonesAgregar(grilla, () => productos);

iniciarCatalogo();
