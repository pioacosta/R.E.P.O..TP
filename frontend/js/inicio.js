// Función para guardar el nombre
async function guardarNombre(event) {
  event.preventDefault();
  const nombre = document.getElementById("inputNombre").value.trim();
  if (!nombre) return;

  sessionStorage.setItem("nombreUsuario", nombre);

  await Swal.fire({
    title: `¡Bienvenido, ${nombre}!`,
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    timer: 2500,
    timerProgressBar: true,
    icon: "success",
  });

  window.location.href = "./productos.html";
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
