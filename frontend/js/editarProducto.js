document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("ID no especificado");
    window.location.href = "index.html";
    return;
  }

  try {
    // Traer el producto primero
    const resProducto = await fetch(`http://localhost:3000/productos/${id}`);
    if (!resProducto.ok) throw new Error("Error al obtener el producto");
    
    const producto = await resProducto.json();

    // Cargar categorías y seleccionar la actual
    await cargarCategoriasSeleccionadas(producto.categoria_id);

    // Rellenar campos del formulario
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("imagenActual").src = producto.imagen;

  } catch (error) {
    console.error(error);
    alert("Error al cargar los datos del producto");
  }

  // Vista previa de nueva imagen
  const inputImagen = document.getElementById("imagen");
  inputImagen.addEventListener("change", () => {
    const file = inputImagen.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("imagenPreview").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});

// Función para cargar categorías en el select y seleccionar la actual
async function cargarCategoriasSeleccionadas(categoriaActualId) {
  try {
    const response = await fetch("http://localhost:3000/categorias");
    if (!response.ok) throw new Error("Error al obtener las categorías");

    const categorias = await response.json();
    const select = document.getElementById("categoria_id");

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });

    select.value = categoriaActualId;

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    alert("Error al cargar las categorías");
  }
}
