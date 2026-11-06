// Página de inicio: muestra los productos destacados leídos del JSON.

import { iniciarInterfaz, activarBotonesAgregar } from "../modules/ui.js";
import { obtenerDatos } from "../modules/api.js";
import { crearTarjetaProducto } from "../modules/render.js";

iniciarInterfaz();

const grilla = document.getElementById("grilla-destacados");
const estado = document.getElementById("estado-destacados");
let destacados = [];

async function cargarDestacados() {
  try {
    const { productos, categorias } = await obtenerDatos();
    const nombres = Object.fromEntries(categorias.map((categoria) => [categoria.id, categoria.nombre]));

    destacados = productos.filter((producto) => producto.destacado).slice(0, 4);
    grilla.innerHTML = destacados
      .map((producto) => crearTarjetaProducto(producto, nombres[producto.categoria]))
      .join("");

    estado.hidden = true;
    grilla.setAttribute("aria-busy", "false");
  } catch (error) {
    console.error(error);
    estado.textContent = "No pudimos cargar los destacados. Podés verlos en el catálogo.";
    estado.classList.add("estado--error");
  }
}

activarBotonesAgregar(grilla, () => destacados);
cargarDestacados();
