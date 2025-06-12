const express = require("express");
const router = express.Router();

const productosventasControllers = require("../controllers/productoVentaController");

router.get("/", productosventasControllers.listarProductosVentas);
router.get("/:id", productosventasControllers.obtenerProductoVentaPorId);
router.post("/", productosventasControllers.crearProductoVenta);
router.put("/:id", productosventasControllers.modificarProductoVenta);
router.delete("/:id", productosventasControllers.eliminarProductoVenta);

module.exports = router;
