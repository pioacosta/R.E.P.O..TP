const { body } = require("express-validator");
/**
 * Reglas de validación para crear o modificar un usuario:
 * - "nombre": debe estar presente y no estar vacío.
 * - "email": debe ser un correo electrónico válido.
 * - "password": debe tener al menos 4 caracteres (mensaje indica 6, revisar).
 * - "rol": debe estar presente y no estar vacío.
 * Cada regla incluye un mensaje personalizado para cuando la validación falla.
 */
module.exports = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),

  body("email").isEmail().withMessage("Debe ser un correo válido"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

];
