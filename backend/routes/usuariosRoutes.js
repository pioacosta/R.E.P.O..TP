const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { verificarToken, permitirRoles } = require("../middlewares/authMiddleware");
const manejarErroresValidacion = require("../middlewares/manejarErroresValidacion");
const validarUsuario = require("../middlewares/validarUsuario")

/**
 * Rutas para la gestión de usuarios.
 * 
 * GET    /             - Listar todos los usuarios.
 * GET    /:id          - Obtener un usuario por ID.
 * POST   /crear-admin  - Crear un usuario con rol admin (requiere token y rol root, validación y manejo de errores).
 * PUT    /:id          - Modificar un usuario por ID (requiere token y rol root).
 * DELETE /:id          - Eliminar un usuario por ID (requiere token y rol root).
 * 
 * Middlewares usados:
 * - verificarToken: valida JWT.
 * - permitirRoles: controla acceso por rol.
 * - validarUsuario: valida datos del usuario.
 * - manejarErroresValidacion: maneja errores de validación.
 */

router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);
router.post("/crear-admin", verificarToken, permitirRoles("root"),...validarUsuario, manejarErroresValidacion, usuarioController.crearUsuario);
router.put("/:id",verificarToken, permitirRoles("root"), usuarioController.modificarUsuario);
router.delete("/:id",verificarToken, permitirRoles("root"), usuarioController.eliminarUsuario);

module.exports = router;
