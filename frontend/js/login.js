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
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        const username = data.nombre ?? email.split("@")[0];
        sessionStorage.setItem("usuario", username);
        toggleAdminUI(true);
      } else {
        errorDiv.textContent = data.mensaje || "Login incorrecto";
        errorDiv.style.display = "block";
      }
    } catch (err) {
      errorDiv.textContent = "Error de conexión";
      errorDiv.style.display = "block";
    }
  });
});

window.logoutAdmin = function () {
  localStorage.clear();
  sessionStorage.clear();
  location.href = "./inicio.html";
};

function salirAdmin() {
  window.location.href = "./inicio.html";
}
