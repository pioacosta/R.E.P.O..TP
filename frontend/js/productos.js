document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/productos");
    const productos = await response.json();
    const contenedor = document.getElementById("productosContainer");
    const activos = productos.filter((p) => p.activo !== false);

    activos.forEach((prod) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${
            prod.imagen
          }" class="card-img-top object-fit-contain" style="height: 200px;" alt="${
        prod.nombre
      }">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text text-muted">${prod.categoria || ""}</p>
            <p class="card-text fw-bold">$ ${prod.precio}</p>
            <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${
              prod.id
            })">
              Agregar al carrito
            </button>
          </div>
        </div>
      `;
      contenedor.appendChild(col);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
});

function agregarAlCarrito(id) {
  // Buscar el producto en el sessionStorage o crear uno nuevo
  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  const productoExistente = carrito.find((p) => p.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, cantidad: 1 });
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Producto agregado al carrito.");
}
