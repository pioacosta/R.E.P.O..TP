document.addEventListener("DOMContentLoaded", async () => {
  const filtroCategoria = document.getElementById("filtroCategoria");

  try {
    // 🟦 Cargar categorías dinámicamente
    const resCat = await fetch("http://localhost:3000/categorias");
    const categorias = await resCat.json();

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.nombre;
      option.textContent = cat.nombre;
      filtroCategoria.appendChild(option);
    });

    // 🟦 Cargar productos
    const resProd = await fetch("http://localhost:3000/productos");
    const productos = await resProd.json();
    const activos = productos.filter((p) => p.activo !== false);

    // Guardar para filtrado global
    window.todosLosProductos = activos;

    // Asociar nombre de categoría al producto
    activos.forEach((prod) => {
      const cat = categorias.find((c) => c.id === prod.categoria_id);
      prod.categoria = cat ? cat.nombre : "Sin categoría";
    });

    // Mostrar productos
    renderizarProductos(activos);

    // Eventos de búsqueda y filtro
    document
      .getElementById("buscador")
      .addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
    document
      .getElementById("filtroPrecio")
      .addEventListener("change", aplicarFiltros);
  } catch (error) {
    console.error("Error al cargar datos:", error);
    document.getElementById("productosContainer").innerHTML =
      "<p class='text-danger text-center'>Error al cargar productos o categorías.</p>";
  }
});

const cargarProductos = async () => {
  const resProd = await fetch("http://localhost:3000/productos");
  const productos = await resProd.json();
  const activos = productos.filter((p) => p.activo !== false);
  return activos;
};

function agregarAlCarrito(id) {
  const cantidadInput = document.querySelector(
    `.cantidad-input[data-id="${id}"]`
  );
  const raw = cantidadInput?.value.trim();
  const cantidad = parseInt(raw);

  if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
    mostrarAlertaProducto(id, "Cantidad inválida (1-100)", "danger");
    return;
  }

  const producto = window.todosLosProductos.find((p) => p.id === id);
  if (!producto) {
    mostrarAlertaProducto(id, "Producto no encontrado", "danger");
    return;
  }

  const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  const existente = carrito.find((p) => p.id === id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarAlertaProducto(
    id,
    `${producto.nombre} (x${cantidad}) agregado`,
    "success"
  );
}

// Nueva función para mostrar alertas específicas de cada producto
function mostrarAlertaProducto(productoId, mensaje, tipo = "success") {
  const alertaContainer = document.getElementById(
    `alerta-producto-${productoId}`
  );

  if (!alertaContainer) return;

  // Actualizar el contenido de la alerta
  const alertaDiv = alertaContainer.querySelector(".alert");
  const iconos = {
    success: "✓",
    danger: "⚠",
    warning: "⚠",
    info: "ℹ",
  };

  alertaDiv.className = `alert alert-${tipo} mx-2 mb-0 text-center shadow-sm border-0`;
  alertaDiv.style.fontSize = "0.9rem";
  alertaDiv.style.padding = "0.75rem";
  alertaDiv.style.borderRadius = "0.5rem";
  alertaDiv.innerHTML = `<strong>${iconos[tipo] || ""} ${mensaje}</strong>`;

  // Si ya hay una alerta visible, cancelar su timeout
  if (alertaContainer.timeoutId) {
    clearTimeout(alertaContainer.timeoutId);
  }

  // Mostrar la alerta con animación suave
  alertaContainer.style.display = "block";
  alertaContainer.style.opacity = "0";
  alertaContainer.style.transform = "translateY(-15px) scale(0.9)";
  alertaContainer.style.transition =
    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  // Forzar el reflow antes de la animación
  alertaContainer.offsetHeight;

  alertaContainer.style.opacity = "1";
  alertaContainer.style.transform = "translateY(0) scale(1)";

  // Ocultar después de 3.5 segundos con animación suave
  alertaContainer.timeoutId = setTimeout(() => {
    alertaContainer.style.opacity = "0";
    alertaContainer.style.transform = "translateY(-15px) scale(0.9)";
    setTimeout(() => {
      alertaContainer.style.display = "none";
      delete alertaContainer.timeoutId;
    }, 400);
  }, 3500);
}

function renderizarProductos(lista) {
  const contenedor = document.getElementById("productosContainer");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML =
      "<p class='text-center'>No se encontraron productos.</p>";
    return;
  }

  lista.forEach((prod) => {
    console.log(prod.imagen);

    const col = document.createElement("div");
    col.className =
      "col-6 col-sm-4 col-md-3 col-lg-4 col-xl-3 mb-4 producto-card-container";

    col.innerHTML = `
      <div class="card h-100 shadow-sm d-flex flex-column position-relative">
        <img src="${
          prod.imagen
        }" class="card-img-top object-fit-contain" style="height: 200px;" alt="${
      prod.nombre
    }">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text text-muted">${prod.categoria || ""}</p>
          <p class="card-text fw-bold">$ ${parseFloat(prod.precio).toFixed(
            2
          )}</p>
          <div class="input-group mt-auto">
            <input type="number" class="cantidad-input" data-id="${
              prod.id
            }" value="1" min="1" max="100">
            <button class="btn btn-success" onclick="agregarAlCarrito(${
              prod.id
            })">Agregar</button>
          </div>
        </div>
        <!-- Contenedor de alerta específico para este producto -->
        <div id="alerta-producto-${
          prod.id
        }" class="position-absolute w-100" style="bottom: -50px; z-index: 10; display: none;">
          <div class="alert alert-success mx-2 mb-0 text-center shadow-sm" style="font-size: 0.9rem; padding: 0.5rem;">
            <strong>¡Producto agregado!</strong>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });
}

function aplicarFiltros() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const precio = document.getElementById("filtroPrecio").value;

  let filtrados = window.todosLosProductos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  // Ordenar por precio si se seleccionó una opción
  if (precio === "asc") {
    filtrados.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
  } else if (precio === "desc") {
    filtrados.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
  }

  renderizarProductos(filtrados);
}

async function cargarCategorias() {
  try {
    const response = await fetch("http://localhost:3000/categorias");
    const categorias = await response.json();

    const select = document.getElementById("filtroCategoria");

    // Agrega una opción por cada categoría recibida
    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.nombre;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}
