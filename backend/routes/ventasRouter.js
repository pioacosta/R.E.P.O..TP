const express = require("express");
const router = express.Router();

const ventaControllers = require("../controllers/ventaController");

router.get("/", ventaControllers.listarVentas);
router.get("/:id", ventaControllers.obtenerVentaPorId);
router.post("/", ventaControllers.crearVenta);
router.put("/:id", ventaControllers.modificarVenta);
router.delete("/:id", ventaControllers.eliminarVenta);

module.exports = router;
