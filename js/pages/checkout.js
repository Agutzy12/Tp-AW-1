// Página de finalizar compra: resumen editable del carrito, datos de entrega,
// validación del formulario y confirmación del pedido.

import { iniciarInterfaz, manejarAccionCarrito, mostrarAviso } from "../modules/ui.js";
import * as carrito from "../modules/carrito.js";
import { crearItemCarrito } from "../modules/render.js";
import { formatearPrecio } from "../modules/formato.js";
import { calcularEnvio, crearPedido, guardarPedido, ENVIO_GRATIS_DESDE } from "../modules/pedido.js";
import { reglas, validarFormulario, activarValidacionEnVivo } from "../modules/validaciones.js";

iniciarInterfaz();

const contenido = document.getElementById("checkout-contenido");
const avisoVacio = document.getElementById("checkout-vacio");
const formulario = document.getElementById("formulario-pedido");
const botonEnviar = formulario.querySelector("[type='submit']");
const camposDireccion = document.getElementById("campos-direccion");
const lista = document.getElementById("resumen-lista");
const salidaSubtotal = document.getElementById("resumen-subtotal");
const salidaEnvio = document.getElementById("resumen-envio");
const salidaTotal = document.getElementById("resumen-total");
const mensajeEnvio = document.getElementById("resumen-mensaje-envio");

let enviando = false;

const esDomicilio = (form) => form.elements.entrega.value === "domicilio";

const esquema = {
  nombre: { reglas: [reglas.requerido(), reglas.minimo(3), reglas.soloLetras()] },
  email: { reglas: [reglas.requerido(), reglas.email()] },
  telefono: { reglas: [reglas.requerido(), reglas.telefono()] },
  entrega: { reglas: [reglas.seleccion("Elegí cómo querés recibir tu pedido.")] },
  direccion: { reglas: [reglas.requerido(), reglas.minimo(5)], aplica: esDomicilio },
  ciudad: { reglas: [reglas.requerido(), reglas.soloLetras()], aplica: esDomicilio },
  "codigo-postal": { reglas: [reglas.requerido(), reglas.codigoPostal()], aplica: esDomicilio },
  pago: { reglas: [reglas.seleccion("Elegí un medio de pago.")] },
  notas: { reglas: [reglas.maximo(300)] },
  terminos: { reglas: [reglas.aceptado("Tenés que aceptar las condiciones de compra.")] },
};

function metodoEntrega() {
  return formulario.elements.entrega.value || "retiro";
}

function actualizarResumen(items) {
  if (enviando) return;

  const hayItems = items.length > 0;
  contenido.hidden = !hayItems;
  avisoVacio.hidden = hayItems;
  if (!hayItems) return;

  const subtotal = carrito.calcularSubtotal(items);
  const envio = calcularEnvio(subtotal, metodoEntrega());

  lista.innerHTML = items.map(crearItemCarrito).join("");
  salidaSubtotal.textContent = formatearPrecio(subtotal);
  salidaEnvio.textContent = metodoEntrega() === "domicilio" ? (envio === 0 ? "¡Gratis!" : formatearPrecio(envio)) : "Sin cargo";
  salidaTotal.textContent = formatearPrecio(subtotal + envio);

  const faltante = ENVIO_GRATIS_DESDE - subtotal;
  mensajeEnvio.textContent =
    metodoEntrega() === "domicilio" && faltante > 0
      ? `Te faltan ${formatearPrecio(faltante)} para tener envío gratis.`
      : "";
}

function actualizarCamposDireccion() {
  const mostrar = metodoEntrega() === "domicilio";
  camposDireccion.hidden = !mostrar;
  camposDireccion.disabled = !mostrar;
  actualizarResumen(carrito.obtenerItems());
}

function leerDatosPedido() {
  const datos = new FormData(formulario);
  const entrega = { metodo: datos.get("entrega") };

  if (entrega.metodo === "domicilio") {
    entrega.direccion = datos.get("direccion").trim();
    entrega.ciudad = datos.get("ciudad").trim();
    entrega.codigoPostal = datos.get("codigo-postal").trim().toUpperCase();
  }

  return {
    items: carrito.obtenerItems(),
    cliente: {
      nombre: datos.get("nombre").trim(),
      email: datos.get("email").trim(),
      telefono: datos.get("telefono").trim(),
    },
    entrega,
    pago: datos.get("pago"),
    notas: datos.get("notas").trim(),
  };
}

formulario.addEventListener("change", (evento) => {
  if (evento.target.name === "entrega") actualizarCamposDireccion();
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (enviando) return;

  if (!validarFormulario(formulario, esquema)) {
    mostrarAviso("Revisá los campos marcados en rojo.", "error");
    return;
  }

  if (carrito.obtenerItems().length === 0) {
    mostrarAviso("Tu carrito está vacío.", "error");
    return;
  }

  enviando = true;
  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando pedido…";
  formulario.setAttribute("aria-busy", "true");

  // Simulamos el tiempo de respuesta de un servidor.
  setTimeout(() => {
    const pedido = crearPedido(leerDatosPedido());
    guardarPedido(pedido);
    carrito.vaciar();
    window.location.href = "confirmacion.html";
  }, 900);
});

lista.addEventListener("click", manejarAccionCarrito);

activarValidacionEnVivo(formulario, esquema);
actualizarCamposDireccion();
carrito.suscribir(actualizarResumen);
