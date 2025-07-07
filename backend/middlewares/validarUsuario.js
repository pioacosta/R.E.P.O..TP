const { body } = require("express-validator");
module.exports = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),

  body("email").isEmail().withMessage("Debe ser un correo válido"),

  body("password")
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol").notEmpty().withMessage("El rol es obligatorio"),
];
