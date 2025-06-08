const express = require("express");
const router = express.Router();

const productoControllers = require("../controllers/productoController")

router.get("/", productoControllers.listarProductos);
router.get("/:id", productoControllers.obtenerProductoPorId);
router.post("/", productoControllers.crearProducto);
router.put("/:id", productoControllers.modificarProducto);
router.delete("/:id", productoControllers.eliminarProducto);

module.exports = router;