/*
 * ADMIN.JS - Lógica de autenticación de administradores
 * Maneja el login exclusivo para admins
 * Control de acceso al panel administrativo
 */

import { crearProducto, obtenerCategorias } from "./fetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    window.window.location.href = "./dashboard.html";
  }

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
      const data = await crearProducto(formData);
      msgDiv.textContent = "Producto agregado correctamente";
      msgDiv.className = "alert alert-success";
      msgDiv.classList.remove("d-none");
      form.reset();
      form.classList.remove("was-validated");
    } catch (err) {
      msgDiv.textContent = err.message || "Error al agregar producto";
      msgDiv.className = "alert alert-danger";
      msgDiv.classList.remove("d-none");
    }
  });

  // Cargar categorías en el select
  const select = document.getElementById("categoria_id");
  if (select) {
    try {
      const categorias = await obtenerCategorias();
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
