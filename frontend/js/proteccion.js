(() => {
  const isAdmin = () => !!localStorage.getItem("adminToken");
  const isAdminPage = window.location.pathname.endsWith("admin.html");
  const hasCustomer = () => !!sessionStorage.getItem("nombreUsuario");

  document.addEventListener("DOMContentLoaded", () => {
    /* ▸ SEGURIDAD: solo redirige si NO es admin, NO es la página admin
       y NO hay sesión de usuario */
    if (!isAdminPage && !isAdmin() && !hasCustomer()) {
      alert("Debes ingresar tu nombre para acceder.");
      window.location.href = "./inicio.html";
      return; // detiene el resto
    }

    /* ▸ UX: si estamos como admin, oculta el botón “Cancelar compra”
       en carrito.html y ticket.html (o cualquier página que lo tenga) */
    if (isAdmin()) {
      document
        .querySelectorAll('a.nav-link.text-danger, a[href*="Cancelar"]')
        .forEach((link) => {
          if (link.textContent.trim().toLowerCase() === "cancelar compra") {
            link.parentElement?.classList.add("d-none"); // oculta <li>
          }
        });
    }
  });
})();
