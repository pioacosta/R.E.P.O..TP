const express = require("express");
const router = express.Router();

const usuarioControllers = require("../controllers/ususarioController");

router.get("/", usuarioControllers.listarUsuarios);
router.get("/:id", usuarioControllers.obtenerUsuarioPorId);

module.exports = router;
