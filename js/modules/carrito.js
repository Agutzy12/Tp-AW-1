// Estado del carrito de compras. Se guarda en localStorage para que
// persista al cambiar de página o recargar el navegador.

const CLAVE_STORAGE = "vivero-brotes:carrito";

let items = leerDelStorage();
const suscriptores = new Set();

function leerDelStorage() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

function guardarYNotificar() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
  } catch {
    // Si el navegador bloquea el storage, el carrito sigue funcionando en memoria.
  }
  notificar();
}

function notificar() {
  const copia = obtenerItems();
  suscriptores.forEach((funcion) => funcion(copia));
}

// Permite que otras partes de la interfaz se actualicen cuando cambia el carrito.
export function suscribir(funcion) {
  suscriptores.add(funcion);
  funcion(obtenerItems());
  return () => suscriptores.delete(funcion);
}

export function obtenerItems() {
  return items.map((item) => ({ ...item }));
}

// Devuelve false si no se pudo agregar porque se alcanzó el stock disponible.
export function agregar(producto, cantidad = 1) {
  if (producto.stock <= 0) return false;

  const existente = items.find((item) => item.id === producto.id);

  if (existente) {
    if (existente.cantidad >= producto.stock) return false;
    existente.cantidad = Math.min(existente.cantidad + cantidad, producto.stock);
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      stock: producto.stock,
      cantidad: Math.min(cantidad, producto.stock),
    });
  }

  guardarYNotificar();
  return true;
}

export function cambiarCantidad(id, cantidad) {
  const item = items.find((elemento) => elemento.id === id);
  if (!item) return;

  if (cantidad <= 0) {
    quitar(id);
    return;
  }

  item.cantidad = Math.min(cantidad, item.stock);
  guardarYNotificar();
}

export function quitar(id) {
  items = items.filter((item) => item.id !== id);
  guardarYNotificar();
}

export function vaciar() {
  items = [];
  guardarYNotificar();
}

export function contarUnidades() {
  return items.reduce((total, item) => total + item.cantidad, 0);
}

export function calcularSubtotal(lista = items) {
  return lista.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

// Mantiene sincronizado el carrito si el usuario tiene el sitio abierto en otra pestaña.
window.addEventListener("storage", (evento) => {
  if (evento.key === CLAVE_STORAGE) {
    items = leerDelStorage();
    notificar();
  }
});
