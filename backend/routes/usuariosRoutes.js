const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");

router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);
router.post("/", verificarToken, permitirRoles("root"), usuarioController.crearUsuario);
router.put("/:id", usuarioController.modificarUsuario);
router.delete("/:id", usuarioController.eliminarUsuario);

module.exports = router;
