let currentName = "";
let capsLock = false;
let shiftPressed = false;

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

function updateDisplay() {
  const display = document.getElementById("displayNombre");
  if (currentName.length === 0) {
    display.innerHTML =
      '<span style="color: #6c757d; font-weight: normal; font-size: 1rem;">Toque las letras o use el teclado para escribir su nombre...</span>';
  } else {
    display.innerHTML =
      currentName + '<span style="animation: blink 1s infinite;">|</span>';
  }
}

function addCharacter(char) {
  if (currentName.length < 50) {
    const finalChar =
      capsLock || shiftPressed ? char.toUpperCase() : char.toLowerCase();
    currentName += finalChar;
    updateDisplay();
  }
}

function backspace() {
  if (currentName.length > 0) {
    currentName = currentName.slice(0, -1);
    updateDisplay();
  }
}

function clearAll() {
  currentName = "";
  updateDisplay();
}

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

document.addEventListener("DOMContentLoaded", () => {
  updateDisplay();

  const display = document.getElementById("displayNombre");
  display.addEventListener("focus", (e) => e.target.blur());
  display.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.blur();
  });

  // Teclado virtual
  document.querySelectorAll(".keyboard-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-key");
      addCharacter(key);

      btn.classList.add("key-pressed");
      setTimeout(() => btn.classList.remove("key-pressed"), 150);
    });
  });

  document.getElementById("backspaceBtn").addEventListener("click", backspace);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("spaceBtn").addEventListener("click", addSpace);
  document.getElementById("enterBtn").addEventListener("click", guardarNombre);
  document.getElementById("capsBtn").addEventListener("click", toggleCapsLock);

  // Teclado físico
  document.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
      shiftPressed = true;
    }

    if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
      addCharacter(e.key);
      e.preventDefault();
    } else if (e.key === "Backspace") {
      backspace();
      e.preventDefault();
    } else if (e.key === " ") {
      addSpace();
      e.preventDefault();
    } else if (e.key === "Enter") {
      guardarNombre();
      e.preventDefault();
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
      shiftPressed = false;
    }
  });

  // Evita pegar/cortar/copiar en el display
  ["paste", "copy", "cut"].forEach((evt) => {
    display.addEventListener(evt, (e) => e.preventDefault());
  });

  const nombre = sessionStorage.getItem("nombreUsuario");

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

  if (nombre && window.location.pathname.endsWith("inicio.html")) {
    sessionStorage.removeItem("nombreUsuario");
    Swal.fire({
      title: "Sesión cerrada",
      text: "Debes ingresar tu nombre nuevamente",
      icon: "info",
      timer: 2000,
    });
  }
});
