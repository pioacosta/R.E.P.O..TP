const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      //dato de id
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      // nombre de categoria
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "categorias", // nombre de la tabla a la ue hace referencia
    timestamps: false, // desactiva createdAt y updatedAt automáticos
  }
);

module.exports = Categoria;