const { body } = require("express-validator");

module.exports = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),

  body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),

  body("categoria_id").notEmpty().withMessage("La categoría es obligatoria"),

  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
];
