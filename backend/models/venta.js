const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
