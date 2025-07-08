const { body } = require("express-validator");
/**
 * Reglas de validación para el campo "nombre" en las solicitudes.
 * Verifica que el campo no esté vacío.
 * Devuelve mensaje personalizado si la validación falla.
 */
module.exports = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
];
