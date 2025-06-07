const express = require("express");
const router = express.Router();

const ventaControllers = require("../controllers/ventaController")

router.get("/", ventaControllers.listarVentas);
router.get("/:id", ventaControllers.obtenerVentaPorId);

module.exports = router