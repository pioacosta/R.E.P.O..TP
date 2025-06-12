const express = require("express");
const router = express.Router();

const categoriaControllers = require("../controllers/categoriaController");

router.get("/", categoriaControllers.listarCategorias);
router.get("/:id", categoriaControllers.obtenerCategoriaPorId);
router.post("/", categoriaControllers.crearCategoria);
router.put("/:id", categoriaControllers.modificarCategoria);
router.delete("/:id", categoriaControllers.eliminarCategoria);

module.exports = router;
