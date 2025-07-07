/*
 * INICIO.JS - Lógica de la página principal
 * Maneja el teclado virtual, login de usuarios
 * Control de acceso al sistema
 */

// Variables globales para el teclado virtual y físico
let currentName = "";
let capsLock = false;
let shiftPressed = false; // Para detectar si Shift está presionado

// Función para guardar el nombre
async function guardarNombre() {
  const nombre = currentName.trim();
  if (!nombre) {
    Swal.fire({
      title: "¡Atención!",
      text: "Por favor ingrese su nombre antes de continuar",
      icon: "warning",
      showClass: { popup: "animate__animated animate__shakeX" },
      timer: 2000,
    });
    return;
  }

  sessionStorage.setItem("nombreUsuario", nombre);

  await Swal.fire({
    title: `¡Bienvenido, ${nombre}!`,
    text: "Redirigiendo a la tienda...",
    showClass: { popup: "animate__animated animate__fadeInDown" },
    hideClass: { popup: "animate__animated animate__fadeOutUp" },
    timer: 2500,
    timerProgressBar: true,
    icon: "success",
  });

  window.location.href = "./productos.html";
}

// Función para actualizar el display
function updateDisplay() {
  const display = document.getElementById("displayNombre");
  display.textContent = currentName;

  // Agregar cursor parpadeante
  if (currentName.length === 0) {
    display.innerHTML =
      '<span style="color: #6c757d; font-weight: normal; font-size: 1rem;">Toque las letras o use el teclado para escribir su nombre...</span>';
  } else {
    display.innerHTML =
      currentName + '<span style="animation: blink 1s infinite;">|</span>';
  }
}

// Función para agregar carácter
function addCharacter(char) {
  if (currentName.length < 50) {
    // Límite de 50 caracteres
    const finalChar =
      capsLock || shiftPressed ? char.toUpperCase() : char.toLowerCase();
    currentName += finalChar;
    updateDisplay();

    // Efecto visual en la tecla virtual
    const keyBtn = document.querySelector(`[data-key="${char}"]`);
    if (keyBtn) {
      keyBtn.classList.add("key-pressed");
      setTimeout(() => keyBtn.classList.remove("key-pressed"), 150);
    }
  }
}

// Función para retroceder
function backspace() {
  if (currentName.length > 0) {
    currentName = currentName.slice(0, -1);
    updateDisplay();
  }
}

// Función para limpiar todo
function clearAll() {
  currentName = "";
  updateDisplay();
}

// Función para agregar espacio
function addSpace() {
  if (
    currentName.length > 0 &&
    currentName.length < 50 &&
    !currentName.endsWith(" ")
  ) {
    currentName += " ";
    updateDisplay();
  }
}

// Función para alternar mayúsculas
function toggleCapsLock() {
  capsLock = !capsLock;
  const capsBtn = document.getElementById("capsBtn");
  const allKeys = document.querySelectorAll(".keyboard-btn");

  if (capsLock) {
    capsBtn.classList.add("btn-warning");
    capsBtn.classList.remove("btn-outline-warning");
    allKeys.forEach((key) => {
      key.textContent = key.textContent.toUpperCase();
    });
  } else {
    capsBtn.classList.remove("btn-warning");
    capsBtn.classList.add("btn-outline-warning");
    allKeys.forEach((key) => {
      key.textContent = key.textContent.toLowerCase();
    });
  }
}

// Inicialización del teclado virtual y físico
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar display
  updateDisplay();

  // Bloquear completamente el display del nombre (sin editar manual)
  const display = document.getElementById("displayNombre");
  display.addEventListener("focus", (e) => {
    e.target.blur(); // Quitar focus inmediatamente
  });
  display.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.blur();
  });

  // Event listeners para las teclas de letras virtuales
  document.querySelectorAll(".keyboard-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      addCharacter(key);
    });
  });

  // Event listeners para las acciones especiales del teclado virtual
  document.getElementById("backspaceBtn").addEventListener("click", backspace);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("spaceBtn").addEventListener("click", addSpace);
  document.getElementById("enterBtn").addEventListener("click", guardarNombre);
  document.getElementById("capsBtn").addEventListener("click", toggleCapsLock);

  // Soporte para teclado físico

  // Cuando se presiona una tecla
  document.addEventListener("keydown", (e) => {
    // Si se presiona Shift, activar shift temporal
    if (e.key === "Shift") {
      shiftPressed = true;
    }

    if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
      addCharacter(e.key);
      e.preventDefault();
    }

    if (e.key === " ") {
      addSpace();
      e.preventDefault();
    }

    if (e.key === "Backspace") {
      backspace();
      e.preventDefault();
    }

    if (e.key === "Enter") {
      guardarNombre();
      e.preventDefault();
    }
  });

  // Cuando se suelta la tecla
  document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
      shiftPressed = false;
    }
  });

  // Bloquear paste/copy/cut solo en el display del nombre
  display.addEventListener("paste", (e) => {
    e.preventDefault();
    return false;
  });

  display.addEventListener("copy", (e) => {
    e.preventDefault();
    return false;
  });

  display.addEventListener("cut", (e) => {
    e.preventDefault();
    return false;
  });

  // Bloquea navegación si no hay nombre
  const nombre = sessionStorage.getItem("nombreUsuario");

  // Si no hay nombre, deshabilita los links de la navbar (excepto inicio)
  if (!nombre) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      if (!link.href.endsWith("inicio.html")) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          Swal.fire({
            title: "¡Atención!",
            text: "Debes ingresar tu nombre para continuar",
            icon: "warning",
            showClass: { popup: "animate__animated animate__shakeX" },
          });
        });
      }
    });
  }

  // Si hay nombre y el usuario vuelve a inicio, borra la sesión y avisa
  if (nombre && window.location.pathname.endsWith("inicio.html")) {
    sessionStorage.removeItem("nombreUsuario");
    sessionStorage.removeItem("carrito");
    Swal.fire({
      title: "Sesión cerrada",
      text: "Debes ingresar tu nombre nuevamente",
      icon: "info",
      timer: 2000,
    });
  }
});
