const { body } = require("express-validator");

module.exports = [
  body("cliente_nombre").notEmpty().withMessage("El nombre del cliente es obligatorio"),
];