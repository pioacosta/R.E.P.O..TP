// Datos simulados de productos (JSON hardcodeado)
const productos = [
  {
    id: 1,
    nombre: "Jabón Líquido",
    precio: 850,
    imagen: "./assets/img/jabon_liquido.png",
    categoria: "Limpieza",
    activo: true,
  },
  {
    id: 2,
    nombre: "Desinfectante",
    precio: 1200,
    imagen: "./assets/img/desinfectante.png",
    categoria: "Limpieza",
    activo: true,
  },
  {
    id: 3,
    nombre: "Shampoo",
    precio: 1500,
    imagen: "./assets/img/shampoo.png",
    categoria: "Cuidado Personal",
    activo: true,
  },
  {
    id: 4,
    nombre: "Cepillo de Dientes",
    precio: 500,
    imagen: "./assets/img/cepillo.png",
    categoria: "Cuidado Personal",
    activo: true,
  },
];

// Cargar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productosContainer");
  const activos = productos.filter((p) => p.activo);

  if (!contenedor) return;

  activos.forEach((prod) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
  <div class="card h-100 shadow-sm">
    <img src="${prod.imagen}" class="card-img-top object-fit-contain" style="height: 200px;" alt="${prod.nombre}">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${prod.nombre}</h5>
      <p class="card-text text-muted">${prod.categoria}</p>
      <p class="card-text fw-bold">$ ${prod.precio}</p>
      <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${prod.id})">
        Agregar al carrito
      </button>
    </div>
  </div>
`;

    contenedor.appendChild(col);
  });
});

// Manejo de carrito en sessionStorage
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
  const existente = carrito.find((p) => p.id === id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  sessionStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`Se agregó "${producto.nombre}" al carrito.`);
}
