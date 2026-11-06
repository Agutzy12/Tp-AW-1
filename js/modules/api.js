// Acceso a los datos. El archivo JSON simula la respuesta de una API REST.

const URL_PRODUCTOS = "data/productos.json";

let datosEnCache = null;

export async function obtenerDatos() {
  if (datosEnCache) return datosEnCache;

  const respuesta = await fetch(URL_PRODUCTOS);
  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar el catálogo (error ${respuesta.status}).`);
  }

  datosEnCache = await respuesta.json();
  return datosEnCache;
}

export async function obtenerProductos() {
  const datos = await obtenerDatos();
  return datos.productos;
}

export async function obtenerCategorias() {
  const datos = await obtenerDatos();
  return datos.categorias;
}
