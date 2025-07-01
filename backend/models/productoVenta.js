const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
