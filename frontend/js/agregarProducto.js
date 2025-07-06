document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("formAgregar");
  const msgDiv = document.getElementById("msgDiv");

  // Cargar categorías
  const select = document.getElementById("categoria_id");
  try {
    const res = await fetch("http://localhost:3000/categorias");
    const categorias = await res.json();
    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
  } catch (err) {
    msgDiv.textContent = "Error al cargar categorías";
    msgDiv.className = "alert alert-danger";
    msgDiv.classList.remove("d-none");
  }

  // Vista previa de imagen
  const imagenInput = document.getElementById("imagen");
  const imagenPreview = document.getElementById("imagenPreview");
  imagenInput.addEventListener("change", function () {
    const file = imagenInput.files[0];
    if (file) {
      imagenPreview.src = URL.createObjectURL(file);
    }
  });

  // Manejo de envío del formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const token = localStorage.getItem("adminToken");
    if (!token) {
      msgDiv.textContent = "Debes iniciar sesión como administrador.";
      msgDiv.className = "alert alert-danger";
      msgDiv.classList.remove("d-none");
      return;
    }

    const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:3000/productos/crear", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        msgDiv.textContent = "Producto agregado correctamente";
        msgDiv.className = "alert alert-success";
        msgDiv.classList.remove("d-none");
        form.reset();
        form.classList.remove("was-validated");
        imagenPreview.src = ""; // Limpiar imagen
        window.location.href = "./dashboard.html";
      } else {
        msgDiv.textContent = data.mensaje || "Error al agregar producto";
        msgDiv.className = "alert alert-danger";
        msgDiv.classList.remove("d-none");
      }
    } catch (err) {
      msgDiv.textContent = "Error de conexión";
      msgDiv.className = "alert alert-danger";
      msgDiv.classList.remove("d-none");
    }
  });
});