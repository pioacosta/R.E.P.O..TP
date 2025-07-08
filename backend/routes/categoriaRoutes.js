const express = require("express");
const router = express.Router();
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");
const validarCategoria = require("../middlewares/validarCategoria");
const categoriaControllers = require("../controllers/categoriaController");

/**
 * Rutas para la gestión de categorías.
 * 
 * GET    /           - Listar todas las categorías.
 * GET    /:id        - Obtener una categoría por su ID.
 * POST   /           - Crear una nueva categoría (valida datos antes).
 * PUT    /:id        - Modificar una categoría existente por ID.
 * DELETE /:id        - Eliminar una categoría por ID.
 * 
 * Middleware:
 * - validarCategoria: valida los datos enviados en POST.
 * - manejarErroresValidacion: maneja errores de validación y responde.
 */
router.get("/", categoriaControllers.listarCategorias);
router.get("/:id", categoriaControllers.obtenerCategoriaPorId);
router.post(
  "/",
  validarCategoria,
  manejarErroresValidacion,
  categoriaControllers.crearCategoria
);
router.put("/:id", categoriaControllers.modificarCategoria);
router.delete("/:id", categoriaControllers.eliminarCategoria);

module.exports = router;
