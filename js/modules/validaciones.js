// Validación de formularios reutilizable.
//
// Cada formulario define un "esquema": por cada campo, una lista de reglas.
// Una regla recibe el valor y devuelve "" si está bien o un mensaje de error.
// Opcionalmente, un campo puede tener "aplica(formulario)" para validarse solo
// en ciertas condiciones (por ejemplo, la dirección solo si hay envío).

export const reglas = {
  requerido: (mensaje = "Este campo es obligatorio.") => (valor) =>
    valor.trim() === "" ? mensaje : "",

  minimo: (cantidad) => (valor) =>
    valor.trim().length < cantidad ? `Ingresá al menos ${cantidad} caracteres.` : "",

  maximo: (cantidad) => (valor) =>
    valor.trim().length > cantidad ? `Usá como máximo ${cantidad} caracteres.` : "",

  soloLetras: () => (valor) =>
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' ]+$/.test(valor.trim()) ? "" : "Usá solo letras y espacios.",

  email: () => (valor) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim()) ? "" : "Ingresá un email válido, por ejemplo nombre@correo.com.",

  telefono: ({ opcional = false } = {}) => (valor) => {
    const limpio = valor.replace(/[\s()-]/g, "");
    if (opcional && limpio === "") return "";
    return /^\+?\d{8,14}$/.test(limpio) ? "" : "Ingresá un teléfono válido, solo números (8 a 14 dígitos).";
  },

  codigoPostal: () => (valor) =>
    /^([A-Za-z]\d{4}[A-Za-z]{3}|\d{4})$/.test(valor.trim()) ? "" : "Ingresá un código postal válido (ej. 5000 o X5000ABC).",

  seleccion: (mensaje = "Elegí una opción.") => (valor) => (valor === "" ? mensaje : ""),

  aceptado: (mensaje = "Tenés que aceptar para continuar.") => (valor) => (valor === "" ? mensaje : ""),
};

function obtenerValor(formulario, nombre) {
  const campo = formulario.elements[nombre];
  if (!campo) return "";
  if (campo instanceof RadioNodeList) return campo.value;
  if (campo.type === "checkbox") return campo.checked ? campo.value || "on" : "";
  return campo.value;
}

// Devuelve los elementos a marcar como inválidos (un input o todos los radios de un grupo).
function obtenerControles(formulario, nombre) {
  const campo = formulario.elements[nombre];
  if (!campo) return [];
  return campo instanceof RadioNodeList ? Array.from(campo) : [campo];
}

function mostrarError(formulario, nombre, mensaje) {
  const contenedorError = formulario.querySelector(`#error-${nombre}`);
  const controles = obtenerControles(formulario, nombre);

  controles.forEach((control) => {
    control.setAttribute("aria-invalid", mensaje ? "true" : "false");
    control.closest(".campo")?.classList.toggle("campo--error", Boolean(mensaje));
  });

  if (contenedorError) contenedorError.textContent = mensaje;
}

export function validarCampo(formulario, esquema, nombre) {
  const definicion = esquema[nombre];
  if (!definicion) return true;

  if (definicion.aplica && !definicion.aplica(formulario)) {
    mostrarError(formulario, nombre, "");
    return true;
  }

  const valor = obtenerValor(formulario, nombre);
  const mensaje = definicion.reglas.map((regla) => regla(valor)).find((error) => error !== "") ?? "";

  mostrarError(formulario, nombre, mensaje);
  return mensaje === "";
}

// Valida todo el formulario. Si hay errores, mueve el foco al primero.
export function validarFormulario(formulario, esquema) {
  let primerInvalido = null;

  Object.keys(esquema).forEach((nombre) => {
    const valido = validarCampo(formulario, esquema, nombre);
    if (!valido && !primerInvalido) primerInvalido = obtenerControles(formulario, nombre)[0];
  });

  primerInvalido?.focus();
  return primerInvalido === null;
}

// Valida cada campo cuando el usuario sale de él y, si ya mostraba error,
// lo vuelve a validar mientras escribe para quitar el mensaje apenas se corrige.
export function activarValidacionEnVivo(formulario, esquema) {
  formulario.addEventListener("focusout", (evento) => {
    const nombre = evento.target.name;
    if (nombre in esquema && evento.target.type !== "radio") validarCampo(formulario, esquema, nombre);
  });

  formulario.addEventListener("input", (evento) => {
    const nombre = evento.target.name;
    if (evento.target.getAttribute("aria-invalid") === "true") validarCampo(formulario, esquema, nombre);
  });

  formulario.addEventListener("change", (evento) => {
    const nombre = evento.target.name;
    if (evento.target.type === "radio" || evento.target.type === "checkbox") {
      if (nombre in esquema) validarCampo(formulario, esquema, nombre);
    }
  });
}

export function limpiarErrores(formulario, esquema) {
  Object.keys(esquema).forEach((nombre) => mostrarError(formulario, nombre, ""));
}
