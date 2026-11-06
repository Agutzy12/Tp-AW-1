// Página de contacto: formulario de consulta con validación y mensaje de éxito.

import { iniciarInterfaz, mostrarAviso } from "../modules/ui.js";
import { obtenerProductos } from "../modules/api.js";
import { escaparHTML } from "../modules/formato.js";
import { reglas, validarFormulario, activarValidacionEnVivo, limpiarErrores } from "../modules/validaciones.js";

iniciarInterfaz();

const formulario = document.getElementById("formulario-contacto");
const botonEnviar = formulario.querySelector("[type='submit']");
const panelExito = document.getElementById("contacto-exito");
const tituloExito = document.getElementById("contacto-exito-titulo");
const textoExito = document.getElementById("contacto-exito-texto");
const mensaje = formulario.elements.mensaje;
const contadorMensaje = document.getElementById("contador-mensaje");
const selectProducto = formulario.elements.producto;

const MAXIMO_MENSAJE = 500;

const esquema = {
  nombre: { reglas: [reglas.requerido(), reglas.minimo(3), reglas.soloLetras()] },
  email: { reglas: [reglas.requerido(), reglas.email()] },
  telefono: { reglas: [reglas.telefono({ opcional: true })] },
  motivo: { reglas: [reglas.seleccion("Elegí el motivo de tu consulta.")] },
  mensaje: { reglas: [reglas.requerido(), reglas.minimo(20), reglas.maximo(MAXIMO_MENSAJE)] },
  privacidad: { reglas: [reglas.aceptado("Necesitamos tu autorización para responderte.")] },
};

// Completa la lista de productos de interés con los datos del JSON.
async function cargarProductos() {
  try {
    const productos = await obtenerProductos();
    const opciones = productos
      .map((producto) => `<option value="${producto.id}">${escaparHTML(producto.nombre)}</option>`)
      .join("");
    selectProducto.insertAdjacentHTML("beforeend", opciones);
  } catch (error) {
    console.error(error);
    selectProducto.closest(".campo").hidden = true;
  }
}

function actualizarContador() {
  const largo = mensaje.value.length;
  contadorMensaje.textContent = `${largo} / ${MAXIMO_MENSAJE} caracteres`;
  contadorMensaje.classList.toggle("campo__ayuda--alerta", largo > MAXIMO_MENSAJE);
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!validarFormulario(formulario, esquema)) {
    mostrarAviso("Revisá los campos marcados en rojo.", "error");
    return;
  }

  const nombre = formulario.elements.nombre.value.trim().split(" ")[0];
  const email = formulario.elements.email.value.trim();

  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando…";
  formulario.setAttribute("aria-busy", "true");

  // Simulamos el envío al servidor.
  setTimeout(() => {
    formulario.hidden = true;
    formulario.removeAttribute("aria-busy");
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar consulta";

    tituloExito.textContent = `¡Gracias, ${nombre}! Recibimos tu consulta`;
    textoExito.textContent = `Te vamos a responder a ${email} dentro de las próximas 48 horas hábiles.`;
    panelExito.hidden = false;
    tituloExito.focus();
  }, 800);
});

document.querySelector("[data-nueva-consulta]").addEventListener("click", () => {
  formulario.reset();
  limpiarErrores(formulario, esquema);
  actualizarContador();
  panelExito.hidden = true;
  formulario.hidden = false;
  formulario.elements.nombre.focus();
});

mensaje.addEventListener("input", actualizarContador);

activarValidacionEnVivo(formulario, esquema);
actualizarContador();
cargarProductos();
