document.addEventListener("DOMContentLoaded", async () => {
  const filtroCategoria = document.getElementById("filtroCategoria");

  try {
    // 🟦 Cargar categorías dinámicamente
    const resCat = await fetch("http://localhost:3000/categorias");
    const categorias = await resCat.json();

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.categoria;
      option.textContent = cat.categoria;
      filtroCategoria.appendChild(option);
    });

    // 🟦 Cargar productos
    const response = await fetch("http://localhost:3000/productos");
    const productos = await response.json();

    // Filtrar productos activos
    const activos = productos.filter((p) => p.activo !== false);

    // Guardar globalmente para filtros
    window.todosLosProductos = activos;

    // Mostrar productos
    renderizarProductos(activos);

    // Eventos de filtros
    document
      .getElementById("buscador")
      .addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
  } catch (error) {
    console.error("Error al cargar datos:", error);
    document.getElementById("productosContainer").innerHTML =
      "<p class='text-danger text-center'>Error al cargar productos o categorías.</p>";
  }
});

function agregarCantidad(id) {
  const input = document.querySelector(`.cantidad-input[data-id="${id}"]`);
  const raw = input.value.trim();
  const cantidad = parseInt(raw);

  if (isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
    alert("Por favor, ingresá una cantidad válida entre 1 y 100.");
    input.focus();
    return;
  }

  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  const existente = carrito.find((p) => p.id === id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ id, cantidad });
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarAlerta();
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
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm d-flex flex-column">
        <img src="${
          prod.imagen
        }" class="card-img-top object-fit-contain" style="height: 200px;" alt="${
      prod.nombre
    }">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text text-muted">${prod.categoria || ""}</p>
          <p class="card-text fw-bold">$ ${prod.precio}</p>
          <div class="input-group mt-auto">
            <input type="number" min="1" max="100" value="1" class="form-control cantidad-input" data-id="${
              prod.id
            }">
            <button class="btn btn-primary" onclick="agregarCantidad(${
              prod.id
            })">Agregar</button>
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

  const filtrados = window.todosLosProductos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  renderizarProductos(filtrados);
}
