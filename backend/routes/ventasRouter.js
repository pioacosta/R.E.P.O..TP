const express = require("express");
const router = express.Router();
const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");
const ventaControllers = require("../controllers/ventaController");
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");
const validarVenta = require("../middlewares/validarVenta")


router.get("/", ventaControllers.listarVentas);
router.get("/detalles/:id", ventaControllers.obtenerDetalleVenta);
router.get("/:id", ventaControllers.obtenerVentaPorId);
router.post("/",validarVenta, manejarErroresValidacion, ventaControllers.crearVenta);
router.put("/:id", ventaControllers.modificarVenta);
router.delete("/:id",verificarToken, permitirRoles("root"), ventaControllers.eliminarVenta);

module.exports = router;
