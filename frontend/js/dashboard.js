/*
 * DASHBOARD.JS - Panel de control administrativo
 * Gestión de productos, usuarios y estadísticas
 * Centro de administración del sistema
 */

import {
  obtenerProductos,
  cambiarEstadoProducto,
  crearUsuarioAdmin,
  crearCategoria,
  obtenerVentas,
  obtenerProductosPaginados
} from "./fetch.js";

let productos = [];
let ventas = [];
let paginaActual = 1;
const limitePorPagina = 4;
let totalPaginas = 1;


document.addEventListener("DOMContentLoaded", async () => {
  productos = await cargarProductos();

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
    const data = await obtenerProductosPaginados(paginaActual, limitePorPagina);
    if (!data || !data.productos) return;

    renderizarProductos(data.productos);

    // Actualiza la paginación 
    paginaActual = data.paginaActual;
    totalPaginas = data.totalPaginas;

    renderizarBotonesPaginacion();

  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};
function renderizarBotonesPaginacion() {
  const contenedor = document.getElementById("paginacion");
  contenedor.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "⬅ Anterior";
  btnAnterior.className = "btn btn-outline-primary mx-2";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.addEventListener("click", () => {
    paginaActual--;
    cargarProductos();
  });

  const btnSiguiente = document.createElement("button");
  btnSiguiente.textContent = "Siguiente ➡";
  btnSiguiente.className = "btn btn-outline-primary mx-2";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.addEventListener("click", () => {
    paginaActual++;
    cargarProductos();
  });

  contenedor.appendChild(btnAnterior);
  contenedor.appendChild(btnSiguiente);
}
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

  const nombre = form.nombre.value;
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
    await crearUsuarioAdmin({ nombre, email, password });

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
    // Ocultar correctamente con clases de Bootstrap
    if (crearUsuarioTab) crearUsuarioTab.classList.add("d-none");
    if (crearUsuarioContent) crearUsuarioContent.classList.add("d-none");

    console.log(
      "Usuario sin permisos de root - Ocultando funciones administrativas"
    );
  } else {
    // Mostrar correctamente removiendo clases
    if (crearUsuarioTab) crearUsuarioTab.classList.remove("d-none");
    if (crearUsuarioContent) crearUsuarioContent.classList.remove("d-none");

    console.log("Usuario root - Mostrando todas las funciones administrativas");
  }
}

// =================== GESTIÓN DE VENTAS ===================

/**
 * Carga y muestra todas las ventas
 */
async function cargarVentas() {
  try {
    const container = document.getElementById("listarVentas");

    // Mostrar loading
    container.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando ventas...</span>
        </div>
        <p class="mt-2 text-muted">Cargando historial de ventas...</p>
      </div>
    `;

    ventas = await obtenerVentas();
    mostrarVentas(ventas);
    actualizarContadorVentas(ventas.length);
  } catch (error) {
    console.error("Error al cargar ventas:", error);
    document.getElementById("listarVentas").innerHTML = `
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle"></i>
        Error al cargar las ventas. Por favor, intenta nuevamente.
      </div>
    `;
  }
}

/**
 * Muestra las ventas en el contenedor
 */
function mostrarVentas(ventasArray) {
  const container = document.getElementById("listarVentas");

  if (!ventasArray || ventasArray.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-receipt text-muted" style="font-size: 3rem;"></i>
        <h5 class="mt-3 text-muted">No hay ventas registradas</h5>
        <p class="text-muted">Las ventas aparecerán aquí cuando se realicen compras.</p>
      </div>
    `;
    return;
  }

container.innerHTML = ventasArray
  .map(
    (venta) => `
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-0 text-body">
            <i class="bi bi-receipt me-2"></i>
            Venta #${venta.id}
          </h6>
          <small class="text-muted">
            <i class="bi bi-person me-1"></i>${venta.cliente_nombre}
            <i class="bi bi-calendar ms-3 me-1"></i>${new Date(
              venta.fecha
            ).toLocaleDateString("es-AR")}
            <i class="bi bi-clock ms-2 me-1"></i>${new Date(
              venta.fecha
            ).toLocaleTimeString("es-AR")}
          </small>
        </div>
        <div class="text-end">
          <span class="badge bg-success fs-6">$${venta.total}</span>
        </div>
      </div>
      <div class="card-body">
        <h6 class="card-subtitle mb-2 text-muted">Productos comprados:</h6>
        <div class="row g-2">
          ${
            venta.productos?.length
              ? venta.productos
                  .map(
                    (producto) => `
            <div class="col-md-6">
              <div class="d-flex align-items-center p-2 rounded detalle-producto border border-secondary shadow-sm">
<div class="detalle-producto">
  <strong>${producto.nombre}</strong>
  <br>
  <small>
    ${producto.productoVenta.cantidad} × $${producto.productoVenta.precio_unitario} = $${producto.productoVenta.cantidad * producto.productoVenta.precio_unitario}
  </small>
</div>
              </div>
            </div>
          `
                  )
                  .join("")
              : '<p class="text-muted">No hay productos asociados</p>'
          }
        </div>
      </div>
    </div>
  `
  )
  .join("");

}

/**
 * Actualiza el contador de ventas
 */
function actualizarContadorVentas(cantidad) {
  const contador = document.getElementById("contadorVentas");
  if (contador) {
    contador.textContent = cantidad;
  }
}

/**
 * Filtra las ventas según los criterios seleccionados
 */
function filtrarVentas() {
  const filtroFecha = document.getElementById("filtroFecha").value;
  const filtroUsuario = document
    .getElementById("filtroUsuario")
    .value.toLowerCase()
    .trim();

  let ventasFiltradas = [...ventas];

  // Filtrar por fecha
  if (filtroFecha) {
    ventasFiltradas = ventasFiltradas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha).toISOString().split("T")[0];
      return fechaVenta === filtroFecha;
    });
  }

  // Filtrar por nombre del cliente (antes decía usuario_nombre y eso no existe)
  if (filtroUsuario) {
    ventasFiltradas = ventasFiltradas.filter((venta) =>
      venta.cliente_nombre.toLowerCase().includes(filtroUsuario)
    );
  }

  mostrarVentas(ventasFiltradas);
  actualizarContadorVentas(ventasFiltradas.length);
}

/**
 * Limpia todos los filtros
 */
function limpiarFiltros() {
  document.getElementById("filtroFecha").value = "";
  document.getElementById("filtroUsuario").value = "";
  mostrarVentas(ventas);
  actualizarContadorVentas(ventas.length);
}

// Hacer las funciones accesibles globalmente
window.filtrarVentas = filtrarVentas;
window.limpiarFiltros = limpiarFiltros;

// Event listener para el tab de ventas
document.addEventListener("DOMContentLoaded", () => {
  const ventasTab = document.getElementById("detalles-ventas-tab");
  if (ventasTab) {
    ventasTab.addEventListener("click", () => {
      // Cargar ventas solo cuando se hace click en el tab
      if (!ventas.length) {
        cargarVentas();
      }
    });
  }
});
