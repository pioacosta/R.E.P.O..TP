const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Modelo Sequelize para la tabla "categorias".
 * Define la estructura de la tabla con los siguientes campos:
 * - id: entero, clave primaria, autoincremental.
 * - nombre: cadena de texto, obligatorio.
 * Opciones:
 * - tableName: nombre explícito de la tabla en la base de datos.
 * - timestamps: desactivados (no crea createdAt ni updatedAt).
 */
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