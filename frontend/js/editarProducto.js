document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const form = document.getElementById("formEditar");
  const msgDiv = document.getElementById("msgDiv");

  // Verificar que msgDiv existe
  if (!msgDiv) {
    console.error("Elemento msgDiv no encontrado en el HTML");
    alert("Error: Elemento msgDiv no encontrado");
    return;
  }

  if (!id) {
    alert("ID no especificado");
    window.location.href = "index.html";
    return;
  }

  try {
    const resProducto = await fetch(`http://localhost:3000/productos/${id}`);
    if (!resProducto.ok) throw new Error("Error al obtener el producto");

    const producto = await resProducto.json();

    await cargarCategoriasSeleccionadas(producto.categoria_id);

    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("imagenActual").src = producto.imagen;
  } catch (error) {
    console.error(error);
    alert("Error al cargar los datos del producto");
  }

  // Vista previa nueva imagen
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      if (msgDiv) {
        msgDiv.textContent = "Debes iniciar sesión como administrador.";
        msgDiv.className = "alert alert-danger";
        msgDiv.classList.remove("d-none");
      }
      return;
    }

    const formData = new FormData(form);

    try {
      const res = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (msgDiv) {
          msgDiv.textContent = "Producto actualizado correctamente.";
          msgDiv.className = "alert alert-success";
          msgDiv.classList.remove("d-none");
        }
        
        window.location.href = "dashboard.html";
        
      } else {
        if (msgDiv) {
          msgDiv.textContent = data.mensaje || "Error al actualizar el producto.";
          msgDiv.className = "alert alert-danger";
          msgDiv.classList.remove("d-none");
        }
      }
    } catch (error) {
      console.error(error);
      if (msgDiv) {
        msgDiv.textContent = "Error de conexión.";
        msgDiv.className = "alert alert-danger";
        msgDiv.classList.remove("d-none");
      }
    }
  });
});

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