document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("productForm");
  const msgDiv = document.getElementById("productMsg");

  if (!form) return;

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

  // Cargar categorías en el select
  const select = document.getElementById("categoria_id");
  if (select) {
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
  }
});
