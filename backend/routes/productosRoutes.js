const express = require("express");
const router = express.Router();

const productoControllers = require("../controllers/productoController")

router.get("/", productoControllers.listarProductos);
router.get("/:id", productoControllers.obtenerProductoPorId);

module.exports = router;