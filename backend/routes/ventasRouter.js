const express = require("express");
const router = express.Router();
const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");
const ventaControllers = require("../controllers/ventaController");
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");
const validarVenta = require("../middlewares/validarVenta")

/**
 * Rutas para la gestión de ventas.
 * 
 * GET    /              - Listar todas las ventas.
 * GET    /detalles/:id  - Obtener detalle de una venta específica con productos.
 * GET    /detalles      - Obtener detalles de todas las ventas con productos.
 * GET    /:id           - Obtener una venta por ID.
 * POST   /              - Crear una nueva venta (valida datos y maneja errores).
 * PUT    /:id           - Modificar una venta por ID.
 * DELETE /:id           - Eliminar una venta por ID (requiere token y rol root).
 * 
 * Middlewares usados:
 * - validarVenta: valida datos de la venta.
 * - manejarErroresValidacion: maneja errores de validación.
 * - verificarToken: valida JWT.
 * - permitirRoles: controla acceso por rol.
 */

router.get("/", ventaControllers.listarVentas);
router.get("/detalles/:id", ventaControllers.obtenerDetalleVenta);
router.get("/detalles", ventaControllers.obtenerDetallesVentas);
router.get("/:id", ventaControllers.obtenerVentaPorId);
router.post("/",validarVenta, manejarErroresValidacion, ventaControllers.crearVenta);
router.put("/:id", ventaControllers.modificarVenta);
router.delete("/:id",verificarToken, permitirRoles("root"), ventaControllers.eliminarVenta);

module.exports = router;
