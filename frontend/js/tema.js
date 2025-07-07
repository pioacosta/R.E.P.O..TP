/*
 * TEMA.JS - Gestión avanzada de temas
 * Control personalizado de temas claro/oscuro
 * Funciones exportables para otros módulos
 */

// Esta función inicializa un botón para alternar entre modo claro y oscuro.
// Se le puede pasar un ID personalizado del botón; por defecto usa "btnToggleModo".
export function initThemeToggle(btnId = "btnToggleModo") {
  const body = document.body;
  const btn = document.getElementById(btnId);
  if (!btn) return; // Si no encuentra el botón, no hace nada.

  // Función interna que aplica el tema visual (claro u oscuro)
  const setTheme = (dark) => {
    // Cambia las clases del body según el tema
    body.classList.toggle("bg-dark", dark);
    body.classList.toggle("bg-light", !dark);
    body.classList.toggle("text-white", dark);

    // Actualiza el texto y el icono del botón
    btn.innerHTML = dark
      ? '<i class="bi bi-sun-fill me-1"></i> Modo claro'
      : '<i class="bi bi-moon-fill me-1"></i> Modo oscuro';

    // Guarda la preferencia del usuario en localStorage
    localStorage.setItem("modo", dark ? "oscuro" : "claro");
  };

  // Al cargar la página, aplica el tema guardado previamente (si existe)
  setTheme(localStorage.getItem("modo") === "oscuro");

  // Al hacer click en el botón, invierte el tema actual
  btn.addEventListener("click", () =>
    setTheme(!body.classList.contains("bg-dark"))
  );
}

// Persistencia del tema claro/oscuro
const temaBtn = document.getElementById("btnTema");
if (temaBtn) {
  const temaActual = localStorage.getItem("tema") || "claro";
  document.body.dataset.tema = temaActual;

  temaBtn.addEventListener("click", () => {
    const nuevoTema =
      document.body.dataset.tema === "claro" ? "oscuro" : "claro";
    document.body.dataset.tema = nuevoTema;
    localStorage.setItem("tema", nuevoTema);
  });
}
