const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Modelo Sequelize para la tabla intermedia "productos_ventas".
 * Define la relación muchos a muchos entre productos y ventas.
 * Campos:
 * - producto_id: entero, clave primaria compuesta, clave foránea a "productos".
 * - venta_id: entero, clave primaria compuesta, clave foránea a "ventas".
 * - cantidad: entero, cantidad de productos vendidos.
 * - precio_unitario: decimal, precio por unidad en la venta.
 * Opciones:
 * - tableName: nombre explícito de la tabla en la base de datos.
 * - timestamps: desactivado (no crea createdAt ni updatedAt automáticos).
 */
const ProductoVenta = sequelize.define(
  "productoVenta",
  {
    producto_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "productos",
        key: "id",
      },
    },
    venta_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "ventas",
        key: "id",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    tableName: "productos_ventas",
    timestamps: false,
  }
);

module.exports = ProductoVenta;
