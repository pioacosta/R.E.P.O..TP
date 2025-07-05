/**
 * Modo Oscuro - Funcionalidad compartida
 * Para dashboard.html, agregarProducto.html y editarProducto.html
 */

// Función para aplicar/quitar el modo oscuro
function aplicarModoOscuro(activar) {
  if (activar) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
}

// Función para alternar entre modo oscuro y claro
function toggleModoOscuro() {
  const esModoOscuro = document.body.classList.contains("dark-mode");
  aplicarModoOscuro(!esModoOscuro);
  actualizarIconoToggle();
}

// Función para actualizar los iconos del botón toggle
function actualizarIconoToggle() {
  const darkIcon = document.getElementById("darkIcon");
  const lightIcon = document.getElementById("lightIcon");

  if (!darkIcon || !lightIcon) return;

  const esModoOscuro = document.body.classList.contains("dark-mode");

  if (esModoOscuro) {
    darkIcon.classList.remove("d-none");
    lightIcon.classList.add("d-none");
  } else {
    darkIcon.classList.add("d-none");
    lightIcon.classList.remove("d-none");
  }
}

// Función para inicializar el modo oscuro al cargar la página
function inicializarModoOscuro() {
  // Verificar la preferencia guardada
  const modoGuardado = localStorage.getItem("darkMode");

  // Si no hay preferencia guardada, usar modo claro por defecto
  if (modoGuardado === "enabled") {
    aplicarModoOscuro(true);
  } else {
    aplicarModoOscuro(false);
  }

  // Actualizar iconos
  actualizarIconoToggle();

  // Agregar event listener al botón toggle
  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleModoOscuro);
  }

  // Mostrar botón de logout si hay token de admin
  const logoutBtn = document.getElementById("logoutBtn");
  const token = localStorage.getItem("adminToken");
  if (logoutBtn) {
    if (token) {
      logoutBtn.classList.remove("d-none");
    } else {
      logoutBtn.classList.add("d-none");
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarModoOscuro);
