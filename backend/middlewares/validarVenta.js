const { body } = require("express-validator");

/**
 * Regla de validación para crear o modificar una venta:
 * - "cliente_nombre": debe estar presente y no estar vacío.
 * Incluye mensaje personalizado en caso de que la validación falle.
 */
module.exports = [
  body("cliente_nombre")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
];
