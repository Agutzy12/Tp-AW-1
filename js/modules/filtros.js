// Lógica de filtrado y ordenamiento del catálogo.

import { normalizarTexto } from "./formato.js";

export const FILTROS_INICIALES = {
  busqueda: "",
  categoria: "todas",
  luz: "todas",
  precioMaximo: Infinity,
  soloConStock: false,
  orden: "destacados",
};

// Lee los valores actuales del formulario de filtros.
export function leerFiltros(formulario) {
  const datos = new FormData(formulario);
  return {
    busqueda: datos.get("busqueda") ?? "",
    categoria: datos.get("categoria") ?? "todas",
    luz: datos.get("luz") ?? "todas",
    precioMaximo: Number(datos.get("precio-maximo")) || Infinity,
    soloConStock: datos.has("solo-stock"),
    orden: datos.get("orden") ?? "destacados",
  };
}

const ORDENAMIENTOS = {
  destacados: (a, b) => Number(b.destacado) - Number(a.destacado) || a.id - b.id,
  "precio-asc": (a, b) => a.precio - b.precio,
  "precio-desc": (a, b) => b.precio - a.precio,
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, "es"),
};

export function filtrarProductos(productos, filtros) {
  const texto = normalizarTexto(filtros.busqueda);

  const resultado = productos.filter((producto) => {
    const coincideTexto =
      texto === "" ||
      normalizarTexto(producto.nombre).includes(texto) ||
      normalizarTexto(producto.descripcion).includes(texto);
    const coincideCategoria = filtros.categoria === "todas" || producto.categoria === filtros.categoria;
    const coincideLuz = filtros.luz === "todas" || producto.luz === filtros.luz;
    const coincidePrecio = producto.precio <= filtros.precioMaximo;
    const coincideStock = !filtros.soloConStock || producto.stock > 0;

    return coincideTexto && coincideCategoria && coincideLuz && coincidePrecio && coincideStock;
  });

  const comparar = ORDENAMIENTOS[filtros.orden] ?? ORDENAMIENTOS.destacados;
  return resultado.sort(comparar);
}
