/*
 * PROTECCION.JS - Middleware de seguridad para páginas
 * Verifica autenticación y controla acceso
 * Protege rutas administrativas
 */

(() => {
  // ===== FUNCIONES AUXILIARES =====
  const showAlert = (type, title, text, confirmText, callback) => {
    if (typeof Swal !== "undefined") {
      // Usar SweetAlert2 si está disponible
      const iconColors = {
        error: "#dc3545",
        warning: "#0d6efd",
        success: "#198754",
        info: "#0dcaf0",
      };

      Swal.fire({
        icon: type,
        title: title,
        text: text,
        confirmButtonText: confirmText,
        confirmButtonColor: iconColors[type] || "#0d6efd",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        if (callback) callback();
      });
    } else {
      // Fallback a alert básico si SweetAlert2 no está disponible
      alert(`${title}: ${text}`);
      if (callback) callback();
    }
  };

  // ===== FUNCIONES DE DETECCIÓN =====
  const isAdmin = () => !!localStorage.getItem("adminToken");
  const hasCustomer = () => !!sessionStorage.getItem("nombreUsuario");

  // Detectar páginas por URL
  const currentPage = window.location.pathname;
  const isAdminLoginPage = currentPage.endsWith("admin.html");
  const isDashboardPage = currentPage.endsWith("dashboard.html");
  const isInicioPage = currentPage.endsWith("inicio.html");
  const isProductosPage = currentPage.endsWith("productos.html");
  const isCarritoPage = currentPage.endsWith("carrito.html");
  const isTicketPage = currentPage.endsWith("ticket.html");
  const isAgregarProductoPage = currentPage.endsWith("agregarProducto.html");
  const isEditarProductoPage = currentPage.endsWith("editarProducto.html");

  document.addEventListener("DOMContentLoaded", () => {
    // ===== PROTECCIÓN 1: DASHBOARD SIN LOGIN ADMIN =====
    if (
      (isDashboardPage || isAgregarProductoPage || isEditarProductoPage) &&
      !isAdmin()
    ) {
      showAlert(
        "error",
        "Acceso Denegado",
        "Debes iniciar sesión como administrador para acceder al dashboard.",
        "Ir al Login",
        () => (window.location.href = "./admin.html")
      );
      return;
    }

    // ===== PROTECCIÓN 2: ADMIN YA LOGUEADO INTENTA VOLVER AL LOGIN =====
    if (isAdminLoginPage && isAdmin()) {
      // Redirigir silenciosamente al dashboard (ya está logueado)
      showAlert(
        "info",
        "Ya estás autenticado",
        "Redirigiendo al panel de administración...",
        "Continuar",
        () => (window.location.href = "./dashboard.html")
      );
      return;
    }

    // ===== PROTECCIÓN 3: PÁGINAS DE USUARIO SIN SESIÓN =====
    // Solo aplica a páginas que requieren nombre de usuario
    if (
      (isProductosPage || isCarritoPage || isTicketPage) &&
      !isAdmin() &&
      !hasCustomer()
    ) {
      showAlert(
        "warning",
        "¡Hola!",
        "Debes ingresar tu nombre para acceder a la tienda.",
        "Ir al Inicio",
        () => (window.location.href = "./inicio.html")
      );
      return;
    }

    // ===== UX MEJORAS: OCULTAR ELEMENTOS SEGÚN CONTEXTO =====

    // Si estamos como admin, ocultar "Cancelar compra" en navbar
    if (isAdmin()) {
      document.querySelectorAll("a.nav-link").forEach((link) => {
        if (link.textContent.trim().toLowerCase().includes("cancelar compra")) {
          link.parentElement?.classList.add("d-none");
        }
      });
    }

    // ===== DEBUGGING (solo en desarrollo) =====
    console.log("🔒 Protección activa:", {
      página: currentPage,
      esAdmin: isAdmin(),
      tieneUsuario: hasCustomer(),
      usuario: sessionStorage.getItem("nombreUsuario"),
    });
  });
})();
