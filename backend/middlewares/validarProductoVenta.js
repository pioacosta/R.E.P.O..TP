const { body } = require("express-validator");

module.exports = [
  body("producto_id")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio"),
  body("venta_id")
    .notEmpty()
    .withMessage("El ID de la venta es obligatorio"),
  body("cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser al menos 1"),
  body("precio_unitario")
    .isFloat({ gt: 0 })
    .withMessage("El precio unitario debe ser mayor a 0"),
];