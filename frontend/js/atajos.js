/*
 * ATAJOS.JS - Atajos de teclado del sistema
 * Shortcuts para navegación rápida y accesibilidad
 * Ctrl+Shift+A para acceso admin
 */

//Atajo para acceder al menú de admin (Ctrl + Shift + A)

(() => {
  /** Evita activar el atajo si el usuario está escribiendo */
  const isFormElement = (el) =>
    ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
      if (isFormElement(document.activeElement)) return; // no interrumpir escritura

      e.preventDefault(); // evita seleccionar texto u otro side-effect
      window.location.href = "./admin.html";
    }
  });
})();
