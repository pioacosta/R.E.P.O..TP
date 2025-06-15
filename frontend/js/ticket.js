document.addEventListener("DOMContentLoaded", () => {
    mostrarTicket()
});

function mostrarTicket() {
  const ticket = JSON.parse(sessionStorage.getItem("ticket")) || [];
  const nombre = sessionStorage.getItem("nombreUsuario") || "Invitado";
  const tabla = document.getElementById("tablaProductos");
  const totalCompra = document.getElementById("totalCompra");

  document.getElementById("clienteNombre").textContent = nombre;
  document.getElementById("fechaCompra").textContent =
    new Date().toLocaleDateString();
  let total = 0;

  ticket.forEach((prod) => {
    const subtotal = prod.precio * (prod.cantidad || 1);
    total += subtotal;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prod.nombre}</td>
      <td>${prod.cantidad}</td>
      <td>$${prod.precio}</td>
      <td>$${subtotal}</td>
    `;
    tabla.appendChild(fila);
  });

  totalCompra.textContent = total;
}
