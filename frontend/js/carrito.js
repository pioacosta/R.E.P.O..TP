function mostrarAlerta() {
  const alerta = document.getElementById("alertaProducto");
  alerta.classList.remove("d-none");
  setTimeout(() => alerta.classList.add("d-none"), 2000);
}
