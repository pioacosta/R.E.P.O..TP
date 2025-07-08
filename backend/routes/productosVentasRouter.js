const express = require("express");
const router = express.Router();
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");
const validarProductoVenta = require("../middlewares/validarProductoVenta")
const productosventasControllers = require("../controllers/productoVentaController");


/**
 * Rutas para la gestión de productosVentas (relación entre productos y ventas).
 * 
 * GET    /           - Listar todos los registros de productosVentas.
 * GET    /:id        - Obtener un registro de productoVenta por ID.
 * POST   /           - Crear un nuevo productoVenta (con validación y manejo de errores).
 * PUT    /:id        - Modificar un productoVenta existente por ID.
 * DELETE /:id        - Eliminar un productoVenta por ID.
 * 
 * Middleware:
 * - validarProductoVenta: valida los datos enviados en POST.
 * - manejarErroresValidacion: maneja errores de validación y responde.
 */



router.get("/", productosventasControllers.listarProductosVentas);
router.get("/:id", productosventasControllers.obtenerProductoVentaPorId);
router.post("/",validarProductoVenta, manejarErroresValidacion, productosventasControllers.crearProductoVenta);
router.put("/:id", productosventasControllers.modificarProductoVenta);
router.delete("/:id", productosventasControllers.eliminarProductoVenta);

module.exports = router;
