import {
  obtenerProductos,
  cambiarEstadoProducto,
  crearUsuarioAdmin,
  crearCategoria,
} from "./fetch.js";

let productos = [];

document.addEventListener("DOMContentLoaded", async () => {
  productos = await cargarProductos();
  renderizarProductos(productos);

  const token = localStorage.getItem("adminToken");
  const logoutBtn = document.getElementById("logoutBtn");

  if (token) {
    if (logoutBtn) logoutBtn.classList.remove("d-none");
    // Verificar rol del usuario y mostrar/ocultar pestañas según permisos
    verificarPermisos();
  } else {
    if (logoutBtn) logoutBtn.classList.add("d-none");
  }

  // Configurar event listeners para formularios
  configurarEventListeners();
});

const cargarProductos = async () => {
  try {
    return await obtenerProductos();
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
        <button class="btn btn-outline-primary btn-sm" data-action="editar" data-id="${producto.id}">
          <i class="bi bi-pencil-square me-1"></i>Editar
        </button>
        <button class="btn ${estadoBtnClase} btn-sm" data-action="toggle" data-id="${producto.id}">
          <i class="bi ${estadoIcono} me-1"></i>${estadoBtnTexto}
        </button>
      </div>
    </div>
  </div>
`;

    productosSection.appendChild(div);
  });

  // Agregar event listeners para los botones
  productosSection.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = parseInt(button.dataset.id);

    if (action === "editar") {
      editarProducto(id);
    } else if (action === "toggle") {
      toggleEstadoProducto(id);
    }
  });
}

function editarProducto(id) {
  window.location.href = `./editarProducto.html?id=${id}`;
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
      await cambiarEstadoProducto(id, endpoint);

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

/**
 * Configura todos los event listeners para formularios
 */
function configurarEventListeners() {
  // Event listener para crear usuario admin
  const crearUsuarioForm = document.getElementById("crearUsuarioForm");
  if (crearUsuarioForm) {
    crearUsuarioForm.addEventListener("submit", manejarCrearUsuario);
  }

  // Event listener para crear categoría
  const categoriaForm = document.getElementById("categoriaForm");
  if (categoriaForm) {
    categoriaForm.addEventListener("submit", manejarCrearCategoria);
  }
}

/**
 * Maneja el envío del formulario de crear usuario
 */
async function manejarCrearUsuario(e) {
  e.preventDefault();

  const form = e.target;
  const msgDiv = document.getElementById("usuarioMsg");

  // Validación básica
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const email = form.email.value;
  const password = form.password.value;
  const passwordConfirm = form.passwordConfirm.value;

  if (password !== passwordConfirm) {
    msgDiv.textContent = "Las contraseñas no coinciden";
    msgDiv.className = "alert alert-danger";
    msgDiv.classList.remove("d-none");
    return;
  }

  try {
    await crearUsuarioAdmin({ email, password });

    msgDiv.textContent = "Usuario admin creado correctamente";
    msgDiv.className = "alert alert-success";
    msgDiv.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");

    setTimeout(() => {
      msgDiv.classList.add("d-none");
    }, 3000);
  } catch (error) {
    msgDiv.textContent = error.message || "Error al crear usuario";
    msgDiv.className = "alert alert-danger";
    msgDiv.classList.remove("d-none");
  }
}

/**
 * Maneja el envío del formulario de crear categoría
 */
async function manejarCrearCategoria(e) {
  e.preventDefault();

  const form = e.target;
  const msgDiv = document.getElementById("categoriaMsg");

  // Validación básica
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const nombreCategoria = form.nombreCategoria.value.trim();

  if (!nombreCategoria) {
    msgDiv.textContent = "El nombre de la categoría es requerido";
    msgDiv.className = "alert alert-danger";
    msgDiv.classList.remove("d-none");
    return;
  }

  try {
    await crearCategoria(nombreCategoria);

    msgDiv.textContent = "Categoría creada correctamente";
    msgDiv.className = "alert alert-success";
    msgDiv.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");

    setTimeout(() => {
      msgDiv.classList.add("d-none");
    }, 3000);
  } catch (error) {
    msgDiv.textContent = error.message || "Error al crear categoría";
    msgDiv.className = "alert alert-danger";
    msgDiv.classList.remove("d-none");
  }
}

/**
 * Verifica los permisos del usuario y muestra/oculta elementos según el rol
 */
function verificarPermisos() {
  const rol = sessionStorage.getItem("rol");

  console.log("Rol obtenido del sessionStorage:", rol);
  console.log("Tipo de rol:", typeof rol);

  // Actualizar indicador de rol
  const rolIndicator = document.getElementById("rolIndicator");

  if (rolIndicator) {
    // Si no hay rol o es null/undefined, asignar "admin" por defecto
    const rolActual =
      rol && rol !== "null" && rol !== "undefined" ? rol : "admin";

    rolIndicator.textContent = rolActual;
    rolIndicator.className =
      rolActual === "root"
        ? "badge bg-warning text-dark"
        : "badge bg-info text-dark";

    console.log("Rol mostrado:", rolActual);
  }

  // Elementos que solo deben ver los usuarios con rol 'root'
  const crearUsuarioTab = document.getElementById("crear-usuario-tab");
  const crearUsuarioContent = document.getElementById("crear-usuario");

  if (rol !== "root") {
    // Ocultar la pestaña de crear usuario admin si no es root
    if (crearUsuarioTab) {
      crearUsuarioTab.style.display = "none";
    }
    if (crearUsuarioContent) {
      crearUsuarioContent.style.display = "none";
    }

    console.log(
      "Usuario sin permisos de root - Ocultando funciones administrativas"
    );
  } else {
    // Mostrar todas las funciones para usuarios root
    if (crearUsuarioTab) {
      crearUsuarioTab.style.display = "block";
    }
    if (crearUsuarioContent) {
      crearUsuarioContent.style.display = "block";
    }

    console.log("Usuario root - Mostrando todas las funciones administrativas");
  }
}
