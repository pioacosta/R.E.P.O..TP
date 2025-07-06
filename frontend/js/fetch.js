/**
 * Módulo centralizado para todas las operaciones de API
 * Contiene todas las funciones de fetch organizadas por entidad
 */

// Configuración base
const API_BASE_URL = "http://localhost:3000";

// Función auxiliar para obtener el token de admin
const getAdminToken = () => localStorage.getItem("adminToken");

// Función auxiliar para manejar errores de fetch
const handleFetchError = async (response, operation) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en ${operation}: ${response.status} - ${errorText}`);
  }
  return response;
};

// =================== PRODUCTOS ===================

/**
 * Obtiene todos los productos
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`);
    await handleFetchError(response, "obtener productos");
    return await response.json();
  } catch (error) {
    console.error("Error al cargar productos:", error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 */
export const obtenerProductoPorId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`);
    await handleFetchError(response, "obtener producto");
    return await response.json();
  } catch (error) {
    console.error(`Error al cargar producto ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo producto
 */
export const crearProducto = async (formData) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE_URL}/productos/crear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    await handleFetchError(response, "crear producto");
    return await response.json();
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

/**
 * Actualiza un producto existente
 */
export const actualizarProducto = async (id, formData) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    await handleFetchError(response, "actualizar producto");
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar producto ${id}:`, error);
    throw error;
  }
};

/**
 * Cambia el estado de un producto (alta/baja)
 */
export const cambiarEstadoProducto = async (id, accion) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE_URL}/productos/${id}/${accion}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await handleFetchError(response, `${accion} producto`);
    return await response.json();
  } catch (error) {
    console.error(`Error al ${accion} producto ${id}:`, error);
    throw error;
  }
};

// =================== CATEGORÍAS ===================

/**
 * Obtiene todas las categorías
 */
export const obtenerCategorias = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    await handleFetchError(response, "obtener categorías");
    return await response.json();
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    throw error;
  }
};

/**
 * Crea una nueva categoría
 */
export const crearCategoria = async (nombre) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });
    await handleFetchError(response, "crear categoría");
    return await response.json();
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
};

// =================== VENTAS ===================

/**
 * Crea una nueva venta
 */
export const crearVenta = async (datosVenta) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ventas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosVenta),
    });
    await handleFetchError(response, "crear venta");
    return await response.json();
  } catch (error) {
    console.error("Error al crear venta:", error);
    throw error;
  }
};

// =================== AUTENTICACIÓN ===================

/**
 * Inicia sesión de administrador
 */
export const loginAdmin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    await handleFetchError(response, "login admin");
    return await response.json();
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario administrador
 */
export const crearUsuarioAdmin = async (datosUsuario) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_BASE_URL}/usuarios/crear-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datosUsuario),
    });
    await handleFetchError(response, "crear usuario admin");
    return await response.json();
  } catch (error) {
    console.error("Error al crear usuario admin:", error);
    throw error;
  }
};

// =================== FUNCIONES DE UTILIDAD ===================

/**
 * Verifica si el token de admin es válido
 */
export const verificarTokenAdmin = async () => {
  try {
    const token = getAdminToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return false;
  }
};

/**
 * Limpia el token de admin del localStorage
 */
export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};
