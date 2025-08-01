/*
 * CARRITO.JS - Lógica del carrito de compras
 * Maneja productos en el carrito, cantidades y checkout
 * Procesa la finalización de compras
 */

import { crearVenta } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("finalizarCompra")
    .addEventListener("click", registrarVentas);

  const productosCarrito = obtenerCarrito();
  renderizarProductos(productosCarrito);
});

async function registrarVentas(e) {
  e.preventDefault();

  const productos = obtenerCarrito();

  if (productos.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }
  const confirmar = confirm("¿Confirmás que querés finalizar la compra?");
  if (!confirmar) return;
  const productosParaEnviar = productos.map((p) => ({
    producto_id: p.id,
    cantidad: p.cantidad || 1,
  }));

  const venta = {
    cliente_nombre: sessionStorage.getItem("nombreUsuario"),
    productos: productosParaEnviar,
  };

  try {
    const data = await crearVenta(venta);
    console.log("Venta guardada:", data);

    confirmarCompra();
  } catch (error) {
    console.log("Error al crear la venta:", error);
  }
}

function guardarCarrito(carrito) {
  sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerCarrito() {
  return JSON.parse(sessionStorage.getItem("carrito")) || [];
}

function renderizarProductos(lista) {
  calcularTotal(lista);
  const contenedor = document.getElementById("carritoContainer");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-light text-center shadow-sm rounded-4 w-75 mx-auto my-4 p-4">
        🛒 <strong>No se encontraron productos en el carrito.</strong>
      </div>`;
    return;
  }

  // Generar el HTML de cada producto
  lista.forEach((prod) => {
    const fila = document.createElement("div");
    fila.className = "mb-3 carrito-item";

    fila.innerHTML = `
      <div class="card shadow-sm">
        <div class="row g-0 align-items-center">
          <div class="col-12 col-sm-3 col-md-4 text-center p-2 p-sm-3 border-end">
            <img src="${
              prod.imagen
            }" class="img-fluid object-fit-contain mx-auto" style="max-height: 80px;" alt="${
      prod.nombre
    }">
          </div>
          <div class="col-12 col-sm-9 col-md-8 p-2 p-sm-3">
            <h5 class="card-title mb-1 text-center text-sm-start">${
              prod.nombre
            }</h5>
            <p class="card-text text-muted mb-1 text-center text-sm-start">${
              prod.categoria || ""
            }</p>
            <p class="card-text fw-bold mb-3 text-center text-sm-start">$ ${parseFloat(
              prod.precio
            ).toFixed(2)}</p>
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-2">
              <button class="btn btn-outline-secondary btn-sm btn-disminuir" data-id="${
                prod.id
              }">-</button>
              <input type="number" min="1" max="100" value="${
                prod.cantidad || 1
              }" class="form-control form-control-sm text-center cantidad-input" data-id="${
      prod.id
    }" style="width: 60px;">
              <button class="btn btn-outline-secondary btn-sm btn-aumentar" data-id="${
                prod.id
              }">+</button>
              <button class="btn btn-danger btn-sm ms-sm-auto btn-eliminar" data-id="${
                prod.id
              }">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(fila);
  });

  // asignar listeners a los botones una vez que están en el DOM
  contenedor
    .querySelectorAll(".btn-eliminar")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        eliminarDelCarrito(Number(btn.dataset.id))
      )
    );

  contenedor
    .querySelectorAll(".btn-aumentar")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        aumentarCantidad(Number(btn.dataset.id))
      )
    );

  contenedor
    .querySelectorAll(".btn-disminuir")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        disminuirCantidad(Number(btn.dataset.id))
      )
    );
}

function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito(carrito);
  renderizarProductos(carrito);
}

function aumentarCantidad(id) {
  const carrito = obtenerCarrito();
  const producto = carrito.find((p) => p.id === id);
  if (producto && producto.cantidad < 100) {
    producto.cantidad += 1;
    guardarCarrito(carrito);
    renderizarProductos(carrito);
    calcularTotal(carrito);
  }
}

function disminuirCantidad(id) {
  const carrito = obtenerCarrito();
  const producto = carrito.find((p) => p.id === id);
  if (producto && producto.cantidad > 1) {
    producto.cantidad -= 1;
    guardarCarrito(carrito);
    renderizarProductos(carrito);
    calcularTotal(carrito);
  }
}

function calcularTotal(lista) {
  const textTotal = document.getElementById("totalCarrito");

  const total = lista.reduce((acc, prod) => {
    return acc + prod.precio * (prod.cantidad || 1);
  }, 0);

  textTotal.innerHTML = `$${total.toFixed(2)}`;
}

function vaciarCarrito() {
  sessionStorage.removeItem("carrito");
}

function confirmarCompra() {
  const ticket = obtenerCarrito();
  if (ticket.length === 0) {
    alert("No hay productos en tu carrito!");
    return;
  } else {
    sessionStorage.setItem("ticket", JSON.stringify(ticket));
    vaciarCarrito();
    window.location.href = "ticket.html";
  }
}

function mostrarAlerta() {
  const alerta = document.getElementById("alertaProducto");
  alerta.classList.remove("d-none");
  setTimeout(() => alerta.classList.add("d-none"), 2000);
}

function agregarProducto(id) {
  mostrarAlerta("Producto añadido");
}

function eliminarProducto(id) {
  confirmarAccion("¿Eliminar este producto?", () => {
    carrito = carrito.filter((p) => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarAlerta("Producto eliminado", "danger");
  });
}
