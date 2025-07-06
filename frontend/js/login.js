import { loginAdmin, logoutAdmin } from "./fetch.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const token = localStorage.getItem("adminToken");

  // Función para manejar la UI
  function toggleAdminUI(isLoggedIn) {
    const loginSection = document.getElementById("login-section");
    const productForm = document.getElementById("productForm");
    const logoutBtn = document.getElementById("logoutBtn");

    if (isLoggedIn) {
      if (loginSection) loginSection.style.display = "none";
      if (productForm) productForm.style.display = "block";
      if (logoutBtn) logoutBtn.classList.remove("d-none");
    } else {
      if (loginSection) loginSection.style.display = "block";
      if (productForm) productForm.style.display = "none";
      if (logoutBtn) logoutBtn.classList.add("d-none");
    }
  }

  // Estado inicial
  toggleAdminUI(!!token);

  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorDiv = document.getElementById("loginError");

    errorDiv.style.display = "none";

    try {
      const data = await loginAdmin(email, password);

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        const username = data.usuario?.nombre ?? email.split("@")[0];
        sessionStorage.setItem("usuario", username);

        // El rol viene en data.usuario.rol según el backend
        const rolUsuario = data.usuario?.rol || "admin";
        sessionStorage.setItem("rol", rolUsuario);

        console.log("Datos del login:", data);
        console.log("Rol guardado:", rolUsuario);

        toggleAdminUI(true);
        window.location.href = "./dashboard.html";
      } else {
        errorDiv.textContent = data.mensaje || "Login incorrecto";
        errorDiv.style.display = "block";
      }
    } catch (err) {
      errorDiv.textContent = err.message || "Error de conexión";
      errorDiv.style.display = "block";
    }
  });
});

window.logoutAdmin = function () {
  logoutAdmin();
  localStorage.clear();
  sessionStorage.clear();
  location.href = "./inicio.html";
};

function salirAdmin() {
  window.location.href = "./inicio.html";
}
