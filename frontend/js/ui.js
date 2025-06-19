function crearElemento(tipo, clase, texto) {
  const el = document.createElement(tipo);
  if (clase) el.className = clase;
  if (texto) el.textContent = texto;
  return el;
}

function mostrarAlerta(mensaje, tipo = "success") {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;
  document.body.appendChild(alerta);
  setTimeout(() => alerta.remove(), 3000);
}

function confirmarAccion(mensaje, onConfirmar) {
  if (confirm(mensaje)) onConfirmar();
}
