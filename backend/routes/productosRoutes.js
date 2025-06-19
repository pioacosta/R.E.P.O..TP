const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const validarProducto = require("../middlewares/validarProducto");
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");

const productoControllers = require("../controllers/productoController");

// Listar productos
router.get("/", productoControllers.listarProductos);

// Obtener un producto por ID
router.get("/:id", productoControllers.obtenerProductoPorId);

// Crear un producto con validación y subida de imagen
router.post(
  "/crear",
  upload.single("imagen"),
  validarProducto,
  manejarErroresValidacion,
  productoControllers.crearProducto
);

// Modificar un producto con validación y nueva imagen
router.put(
  "/:id",
  upload.single("imagen"),
  validarProducto,
  manejarErroresValidacion,
  productoControllers.modificarProducto
);

// Eliminar un producto
router.delete("/:id", productoControllers.eliminarProducto);

// Baja lógica
router.patch("/:id/baja", productoControllers.darDeBajaProducto);

// Alta lógica
router.patch("/:id/alta", productoControllers.darDeAltaProducto);

module.exports = router;
