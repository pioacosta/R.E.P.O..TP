const express = require("express");
const router = express.Router();

const usuarioControllers = require("../controllers/ususarioController");

router.get("/", usuarioControllers.listarUsuarios);
router.get("/:id", usuarioControllers.obtenerUsuarioPorId);
router.post("/", usuarioControllers.crearUsuario);
router.put("/:id", usuarioControllers.modificarUsuario);
router.delete("/:id", usuarioControllers.eliminarUsuario);

module.exports = router;
