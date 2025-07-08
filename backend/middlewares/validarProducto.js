const { body } = require("express-validator");

/**
 * Reglas de validación para crear o modificar un producto:
 * - "nombre": debe estar presente y no estar vacío.
 * - "precio": debe ser un número decimal mayor a 0.
 * - "categoria_id": debe estar presente y no estar vacío.
 * - "descripcion": debe estar presente y no estar vacío.
 * Cada regla incluye un mensaje personalizado para cuando la validación falla.
 */
module.exports = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),

  body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),

  body("categoria_id").notEmpty().withMessage("La categoría es obligatoria"),

  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
];
