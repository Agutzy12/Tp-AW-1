// Utilidades de formato y seguridad para el texto que se inserta en el HTML.

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  return formatoMoneda.format(valor);
}

const ENTIDADES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

// Evita que un texto con caracteres especiales rompa el HTML generado.
export function escaparHTML(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter]);
}

// Quita tildes y pasa a minúsculas para que la búsqueda no distinga "Jazmín" de "jazmin".
export function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export const ETIQUETAS_LUZ = {
  sol: "Sol pleno",
  "media-sombra": "Media sombra",
  sombra: "Sombra",
};

export const ETIQUETAS_CUIDADO = {
  facil: "Cuidado fácil",
  medio: "Cuidado medio",
};
