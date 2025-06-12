const productosPrueba = [
    {
        "id": 1,
        "nombre": "Jabón líquido",
        "precio": 1200,
        "imagen": "jabon_liquido.jpg",
        "cantidad": 1
    },
    {
        "id": 2,
        "nombre": "Desinfectante multiusos de mas",
        "precio": 18030,
        "imagen": "desinfectante.jpg2",
        "cantidad": 1
    },
    {
        "id": 5,
        "nombre": "Jabón líquido",
        "precio": 1200,
        "imagen": "frontend/assets/img/cepillo.png",
        "cantidad": 1
    },
    {
        "id": 6,
        "nombre": "Jabón líquido",
        "precio": 1200,
        "imagen": "assets/img/cepillo.png",
        "cantidad": 1
    }
]


document.addEventListener("DOMContentLoaded", async () => {


  const productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

  console.log(productosCarrito)

  renderizarProductos(productosPrueba)


function renderizarProductos(lista) {
  const contenedor = document.getElementById("carritoContainer");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML =
      "<p class='text-center'>No se encontraron productos.</p>";
    return;
  }

lista.forEach((prod) => {
  const fila = document.createElement("div");
  fila.className = "col-12 col-md-6 mb-3"; // mitad de pantalla desde md en adelante

  fila.innerHTML = `
    <div class="card shadow-sm">
      <div class="row g-0 align-items-center">
        <div class="col-4 text-center">
          <img src="${prod.imagen}" class="img-fluid object-fit-contain p-2" style="max-height: 150px;" alt="${prod.nombre}">
        </div>
        <div class="col-8">
          <div class="card-body">
            <h5 class="card-title mb-1">${prod.nombre}</h5>
            <p class="card-text text-muted mb-1">${prod.categoria || ""}</p>
            <p class="card-text fw-bold mb-2">$ ${prod.precio}</p>
            
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-outline-secondary btn-sm" onclick="disminuirCantidad(${prod.id})">-</button>
              <input type="number" min="1" max="100" value="1" class="form-control form-control-sm text-center cantidad-input" data-id="${prod.id}" style="width: 60px;">
              <button class="btn btn-outline-secondary btn-sm" onclick="aumentarCantidad(${prod.id})">+</button>
              <button class="btn btn-danger btn-sm ms-auto" onclick="eliminarDelCarrito(${prod.id})">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  contenedor.appendChild(fila);
});
}



})











function mostrarAlerta() {
  const alerta = document.getElementById("alertaProducto");
  alerta.classList.remove("d-none");
  setTimeout(() => alerta.classList.add("d-none"), 2000);
}
