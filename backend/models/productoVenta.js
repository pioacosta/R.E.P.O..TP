const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Producto = require("./producto");

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
  },
  {
    tableName: "productos_ventas",
    timestamps: false,
  }
);
ProductoVenta.afterCreate(async (productoVenta, options) => {
  try {
    const producto = await Producto.findByPk(productoVenta.producto_id);
    if (producto) {
      producto.stock -= productoVenta.cantidad;
      await producto.save();
    }
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
  }
});
module.exports = ProductoVenta;