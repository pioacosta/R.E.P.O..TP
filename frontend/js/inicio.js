// Función para guardar el nombre
function guardarNombre(event) {
  event.preventDefault();
  const nombre = document.getElementById("inputNombre").value.trim();
  if (nombre) {
    sessionStorage.setItem("nombreUsuario", nombre);
    window.location.href = "./productos.html";
  }
}

// Bloquea navegación si no hay nombre
document.addEventListener("DOMContentLoaded", () => {
  const nombre = sessionStorage.getItem("nombreUsuario");

  // Si no hay nombre, deshabilita los links de la navbar (excepto inicio)
  if (!nombre) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (!link.href.endsWith("inicio.html")) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          alert("Debes ingresar tu nombre para continuar.");
        });
      }
    });
  }

  // Si hay nombre y el usuario vuelve a inicio, borra la sesión y avisa
  if (nombre && window.location.pathname.endsWith("inicio.html")) {
    sessionStorage.removeItem("nombreUsuario");
    alert("Has cerrado sesión. Debes ingresar tu nombre nuevamente.");
  }
});
