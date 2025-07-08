const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * Ruta POST /login
 * Permite a un usuario autenticarse enviando sus credenciales.
 * Controlador encargado: authController.login
 */
router.post("/login", authController.login);

module.exports = router;
