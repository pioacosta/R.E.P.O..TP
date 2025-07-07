const { body } = require("express-validator");

module.exports = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
];
