/*
 * TICKET.JS - Lógica del comprobante de compra
 * Genera y muestra el ticket final de la compra
 * Maneja la descarga en PDF
 */

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("downloadPdfBtn")
    .addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const ticketElement = document.getElementById("ticket");

      const canvas = await html2canvas(ticketElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let y = 0;

      while (y < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, -y, imgWidth, imgHeight);
        y += pageHeight;
        if (y < imgHeight) pdf.addPage();
      }

      pdf.save(`ticket_${Date.now()}.pdf`);
    });

  mostrarTicket();
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
      <td class="text-break">${prod.nombre}</td>
      <td class="text-center">${prod.cantidad}</td>
      <td class="text-center text-nowrap">$${parseFloat(prod.precio).toFixed(
        2
      )}</td>
      <td class="text-center text-nowrap fw-bold">$${subtotal.toFixed(2)}</td>
    `;
    tabla.appendChild(fila);
  });

  totalCompra.textContent = total.toFixed(2);
}
