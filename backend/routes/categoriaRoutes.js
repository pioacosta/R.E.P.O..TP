const express = require("express");
const router = express.Router();
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");
const validarCategoria = require("../middlewares/validarCategoria")
const categoriaControllers = require("../controllers/categoriaController");

router.get("/", categoriaControllers.listarCategorias);
router.get("/:id", categoriaControllers.obtenerCategoriaPorId);
router.post("/",validarCategoria,manejarErroresValidacion, categoriaControllers.crearCategoria);
router.put("/:id", categoriaControllers.modificarCategoria);
router.delete("/:id", categoriaControllers.eliminarCategoria);

module.exports = router;
