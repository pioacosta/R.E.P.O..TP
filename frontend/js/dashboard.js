let productos = [];

document.addEventListener("DOMContentLoaded", async () => {
  productos = await cargarProductos();
  renderizarProductos(productos);

  const token = localStorage.getItem("adminToken");
  if (token) {
    if (logoutBtn) logoutBtn.classList.remove("d-none");
  } else {
    if (logoutBtn) logoutBtn.classList.add("d-none");
  }
});

const cargarProductos = async () => {
  try {
    const resProd = await fetch("http://localhost:3000/productos");
    const productos = await resProd.json();
    return productos;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    return [];
  }
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
      <img src="${producto.imagen}" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: contain;" alt="${producto.nombre}">

      <div class="flex-grow-1">
        <h5 class="mb-1">${producto.nombre}</h5>
        <p class="mb-1 text-muted"><i class="bi bi-currency-dollar me-1"></i>$${producto.precio}</p>
        <p class="mb-1 text-muted"><i class="bi bi-box me-1"></i>Stock: ${producto.stock}</p>
      </div>

      <div class="d-flex flex-column justify-content-center text-end gap-2">
        <button class="btn btn-outline-primary btn-sm" onclick="editarProducto(${producto.id})">
          <i class="bi bi-pencil-square me-1"></i>Editar
        </button>
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

function editarProducto(id) {
  window.location.href = `/frontend/editarProducto.html?id=${id}`;
}

async function toggleEstadoProducto(id) {
  let token = localStorage.getItem("adminToken");

  // Buscamos el producto actual desde la API para asegurar estado real
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const esActivo = producto.activo;

  const textoModal = esActivo
    ? "¿Seguro que quieres dar de baja este producto?"
    : "¿Seguro que quieres dar de alta este producto?";
  const tituloModal = "¿Estás seguro?";
  const textoBoton = esActivo ? "Sí, dar de baja" : "Sí, dar de alta";

  const resultado = await Swal.fire({
    title: tituloModal,
    text: textoModal,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: textoBoton,
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });

  if (resultado.isConfirmed) {
    const endpoint = esActivo ? "baja" : "alta";

    try {
      const res = await fetch(`http://localhost:3000/productos/${id}/${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al actualizar estado");

      productos = await cargarProductos(); 

      const textoExito = !esActivo
        ? "Producto dado de alta correctamente."
        : "Producto dado de baja correctamente.";

      const tituloExito = !esActivo
        ? "Producto activado"
        : "Producto desactivado";

      await Swal.fire({
        icon: "success",
        title: tituloExito,
        text: textoExito,
        timer: 2000,
        showConfirmButton: false,
      });

      renderizarProductos(productos);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cambiar el estado del producto.",
      });
    }
  }
}
