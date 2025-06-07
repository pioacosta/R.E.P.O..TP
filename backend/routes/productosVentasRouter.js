const express = require("express");
const router = express.Router();

const productosventasControllers = require("../controllers/productoVentaController")

router.get("/", productosventasControllers.listarProductosVentas);
router.get("/:id", productosventasControllers.obtenerProductoVentaPorId);

module.exports = router