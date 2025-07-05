const express = require("express");
const router = express.Router();
const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");
const ventaControllers = require("../controllers/ventaController");

router.get("/", ventaControllers.listarVentas);
router.get("/:id", ventaControllers.obtenerVentaPorId);
router.post("/", ventaControllers.crearVenta);
router.put("/:id", ventaControllers.modificarVenta);
router.delete("/:id",verificarToken, permitirRoles("root"), ventaControllers.eliminarVenta);

module.exports = router;
