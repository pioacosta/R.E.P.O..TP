const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");

router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);
router.post("/crear-admin", verificarToken, permitirRoles("root"), usuarioController.crearUsuario);
router.put("/:id",verificarToken, permitirRoles("root"), usuarioController.modificarUsuario);
router.delete("/:id",verificarToken, permitirRoles("root"), usuarioController.eliminarUsuario);

module.exports = router;
