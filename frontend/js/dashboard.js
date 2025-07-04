let productos = []; // ✅ Variable global para mantener estado

  document.addEventListener("DOMContentLoaded", async () => {
    productos = await cargarProductos();
    // Le agregamos la propiedad 'editando'
    productos = productos.map(p => ({ ...p, editando: false }));
    renderizarProductos(productos);
  });

  const cargarProductos = async () => {
    const resProd = await fetch("http://localhost:3000/productos");
    const productos = await resProd.json();
    return productos;
  };

function renderizarProductos(lista) {
  const productosSection = document.getElementById("listarProductos");
  productosSection.innerHTML = "";

  if (lista.length === 0) {
    productosSection.classList.add("d-none");
    return;
  }

  productosSection.classList.remove("d-none");

  lista.forEach((producto) => {
    const div = document.createElement("div");
    div.className = "col-md-6";

    const estadoBtnTexto = producto.activo ? "Dar de Baja" : "Dar de Alta";
    const estadoBtnClase = producto.activo
      ? "btn-outline-danger"
      : "btn-outline-success";
    const estadoIcono = producto.activo ? "bi-toggle-on" : "bi-toggle-off";

    div.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex gap-3">
          <img src="${producto.imagen}" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover;" alt="${producto.nombre}">

          <div class="flex-grow-1">
            <h5 class="mb-1">${producto.nombre}</h5>
            <p class="mb-1 text-muted"><i class="bi bi-currency-dollar me-1"></i>$${producto.precio}</p>
            <p class="mb-1 text-muted"><i class="bi bi-box me-1"></i>Stock: ${producto.stock}</p>
          </div>

          <div class="d-flex flex-column justify-content-center text-end">
            <button class="btn ${estadoBtnClase} btn-sm" onclick="toggleEstadoProducto(${producto.id})">
              <i class="bi ${estadoIcono} me-1"></i>${estadoBtnTexto}
            </button>
          </div>
        </div>
      </div>
    `;

    productosSection.appendChild(div);
  });
}

  function alternarEdicion(id) {
   //
  }

  function guardarCambiosProducto(producto) {
    console.log("Guardado:", producto);
    // 
    // hacer un fetch aca
  }

  function toggleEstadoProducto(id) {
    //hacer un fetch aca 
    
    renderizarProductos(productos);
  }