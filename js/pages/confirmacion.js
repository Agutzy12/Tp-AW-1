// Pantalla de notificación: muestra el comprobante del último pedido confirmado.

import { iniciarInterfaz } from "../modules/ui.js";
import { obtenerUltimoPedido, ETIQUETAS_ENTREGA, ETIQUETAS_PAGO } from "../modules/pedido.js";
import { crearFilaResumen } from "../modules/render.js";
import { escaparHTML, formatearPrecio } from "../modules/formato.js";

iniciarInterfaz();

const pedido = obtenerUltimoPedido();
const exito = document.getElementById("confirmacion-exito");
const sinPedido = document.getElementById("confirmacion-sin-pedido");

function mostrarPedido() {
  const primerNombre = pedido.cliente.nombre.split(" ")[0];
  const fecha = new Date(pedido.fecha).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" });

  document.getElementById("confirmacion-titulo").textContent = `¡Gracias por tu compra, ${primerNombre}!`;
  document.getElementById("confirmacion-numero").textContent = pedido.numero;
  document.getElementById("confirmacion-email").textContent = pedido.cliente.email;
  document.getElementById("confirmacion-fecha").textContent = fecha;

  document.getElementById("confirmacion-items").innerHTML = pedido.items.map(crearFilaResumen).join("");
  document.getElementById("confirmacion-subtotal").textContent = formatearPrecio(pedido.subtotal);
  document.getElementById("confirmacion-envio").textContent = pedido.envio === 0 ? "Sin cargo" : formatearPrecio(pedido.envio);
  document.getElementById("confirmacion-total").textContent = formatearPrecio(pedido.total);

  const { entrega } = pedido;
  const detalleEntrega =
    entrega.metodo === "domicilio"
      ? `${ETIQUETAS_ENTREGA.domicilio}: ${escaparHTML(entrega.direccion)}, ${escaparHTML(entrega.ciudad)} (CP ${escaparHTML(entrega.codigoPostal)}). Te avisamos por WhatsApp el día de entrega.`
      : `${ETIQUETAS_ENTREGA.retiro}: Av. de las Plantas 1234, Córdoba. Tu pedido estará listo en 24 horas hábiles.`;

  document.getElementById("confirmacion-entrega").innerHTML = detalleEntrega;
  document.getElementById("confirmacion-pago").textContent = ETIQUETAS_PAGO[pedido.pago];

  exito.hidden = false;
  document.getElementById("confirmacion-titulo").focus();
}

if (pedido) {
  mostrarPedido();
} else {
  sinPedido.hidden = false;
}
