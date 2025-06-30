document.addEventListener("DOMContentLoaded", () => {
  // Si no hay nombre guardado, redirige a inicio
  if (!sessionStorage.getItem("nombreUsuario")) {
    alert("Debes ingresar tu nombre para acceder.");
    window.location.href = "./inicio.html";
  }
});
