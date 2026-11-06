// Reglas del pedido: costo de envío y guardado del pedido confirmado.

const CLAVE_PEDIDO = "vivero-brotes:ultimo-pedido";

export const COSTO_ENVIO = 4500;
export const ENVIO_GRATIS_DESDE = 60000;

export const ETIQUETAS_ENTREGA = {
  retiro: "Retiro en el vivero",
  domicilio: "Envío a domicilio",
};

export const ETIQUETAS_PAGO = {
  efectivo: "Efectivo al retirar o recibir",
  transferencia: "Transferencia bancaria",
  tarjeta: "Tarjeta de débito o crédito al recibir",
};

export function calcularEnvio(subtotal, metodoEntrega) {
  if (metodoEntrega !== "domicilio" || subtotal === 0) return 0;
  return subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
}

function generarNumeroPedido() {
  const aleatorio = Math.floor(Math.random() * 9000) + 1000;
  return `VB-${Date.now().toString().slice(-5)}${aleatorio}`;
}

export function crearPedido({ items, cliente, entrega, pago, notas }) {
  const subtotal = items.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const envio = calcularEnvio(subtotal, entrega.metodo);

  return {
    numero: generarNumeroPedido(),
    fecha: new Date().toISOString(),
    items,
    cliente,
    entrega,
    pago,
    notas,
    subtotal,
    envio,
    total: subtotal + envio,
  };
}

// sessionStorage: el comprobante solo vive mientras la pestaña esté abierta.
export function guardarPedido(pedido) {
  try {
    sessionStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido));
    return true;
  } catch {
    return false;
  }
}

export function obtenerUltimoPedido() {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE_PEDIDO));
  } catch {
    return null;
  }
}
