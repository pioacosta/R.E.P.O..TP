const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Modelo Sequelize para la tabla "ventas".
 * Campos:
 * - id: entero, clave primaria, autoincremental.
 * - cliente_nombre: cadena, obligatorio (nombre del cliente).
 * - fecha: fecha, fecha de la venta (default: ahora).
 * - total: decimal, total de la venta.
 * Opciones:
 * - tableName: nombre explícito de la tabla.
 * - timestamps: desactivado (no crea createdAt ni updatedAt automáticos).
 */
const Venta = sequelize.define("Venta", {
  id: {
    //datos de id
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cliente_nombre: {
    // datos de nombre
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  total:{
    type: DataTypes.DECIMAL
  }
},  {
    tableName: "ventas", // nombre de la tabla a la ue hace referencia
    timestamps: false, // desactiva createdAt y updatedAt automáticos
  }
);

module.exports = Venta;
