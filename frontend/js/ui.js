/*
 * UI.JS - Utilidades generales de interfaz
 * Funciones reutilizables para componentes y animaciones
 * Helpers para manipulación del DOM
 */

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

// Efectos de ripple en botones
function addRippleEffect() {
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Llamar cuando cargue la página
document.addEventListener("DOMContentLoaded", addRippleEffect);
