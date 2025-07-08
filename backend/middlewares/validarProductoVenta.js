const { body } = require("express-validator");

/**
 * Reglas de validación para crear o modificar un productoVenta:
 * - "producto_id": debe estar presente y no estar vacío.
 * - "venta_id": debe estar presente y no estar vacío.
 * - "cantidad": debe ser un entero mayor o igual a 1.
 * - "precio_unitario": debe ser un número decimal mayor a 0.
 * Cada regla incluye un mensaje personalizado para cuando la validación falla.
 */
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