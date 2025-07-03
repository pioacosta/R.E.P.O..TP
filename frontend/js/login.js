document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const productForm = document.getElementById("productForm");

  const token = localStorage.getItem("adminToken");

  if (!token) {
    if (productForm) productForm.style.display = "none";
    if (logoutBtn) logoutBtn.classList.add("d-none");
  } else {
    if (loginForm)
      document.getElementById("login-section").style.display = "none";
    if (productForm) productForm.style.display = "block";
    if (logoutBtn) logoutBtn.classList.remove("d-none");
  }

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
        document.getElementById("login-section").style.display = "none";
        if (productForm) productForm.style.display = "block";
        if (logoutBtn) logoutBtn.classList.remove("d-none");
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
  localStorage.clear(); // elimina token y cualquier otra clave
  sessionStorage.clear(); // borra nombreUsuario, etc.
  location.href = "./inicio.html";
};
