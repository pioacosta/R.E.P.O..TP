const express = require("express");
const router = express.Router();


const categoriaControllers = require("../controllers/categoriaController");

router.get('/', categoriaControllers.listarCategorias)
router.get('/:id', categoriaControllers.obtenerCategoriaPorId)


module.exports = router;