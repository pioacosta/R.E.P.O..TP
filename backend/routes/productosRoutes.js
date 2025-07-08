const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const validarProducto = require("../middlewares/validarProducto");
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");

const productoControllers = require("../controllers/productoController");

const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");


/**
 * Rutas para la gestión de productos.
 * 
 * GET    /              - Listar todos los productos.
 * GET    /pagina        - Listar productos paginados.
 * GET    /:id           - Obtener un producto por su ID.
 * POST   /crear         - Crear un producto (requiere token, roles root/admin, validación y subida de imagen).
 * PUT    /:id           - Modificar un producto (requiere token, roles root/admin, validación y posible nueva imagen).
 * DELETE /:id           - Eliminar un producto (requiere token y rol root).
 * PATCH  /:id/baja      - Dar de baja lógica a un producto (requiere token, roles root/admin).
 * PATCH  /:id/alta      - Dar de alta lógica a un producto (no requiere autenticación).
 * 
 * Middlewares usados:
 * - verificarToken: valida JWT.
 * - permitirRoles: controla acceso por rol.
 * - upload.single("imagen"): maneja subida de imagen.
 * - validarProducto: valida datos del producto.
 * - manejarErroresValidacion: maneja errores de validación.
 */



// Listar productos
router.get("/", productoControllers.listarProductos);
router.get("/pagina", productoControllers.productospaginados);

// Obtener un producto por ID
router.get("/:id", productoControllers.obtenerProductoPorId);

// Crear un producto con validación y subida de imagen
router.post(
  "/crear",
  verificarToken, permitirRoles("root", "admin"),
  upload.single("imagen"),
  validarProducto,
  manejarErroresValidacion,
  productoControllers.crearProducto
);

// Modificar un producto con validación y nueva imagen
router.put(
  "/:id",
  upload.single("imagen"),
  verificarToken, permitirRoles("root", "admin"),
  validarProducto,
  manejarErroresValidacion,
  productoControllers.modificarProducto
);

// Eliminar un producto
router.delete("/:id",verificarToken, permitirRoles("root"), productoControllers.eliminarProducto);

// Baja lógica
router.patch("/:id/baja",verificarToken, permitirRoles("root","admin"), productoControllers.darDeBajaProducto);

// Alta lógica
router.patch("/:id/alta", productoControllers.darDeAltaProducto);

module.exports = router;
