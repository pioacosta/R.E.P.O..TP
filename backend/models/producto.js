const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Modelo Sequelize para la tabla "productos".
 * Campos:
 * - id: entero, clave primaria, autoincremental.
 * - nombre: cadena, obligatorio.
 * - descripcion: texto, opcional.
 * - precio: decimal, obligatorio.
 * - imagen: cadena, obligatorio (URL o ruta de imagen).
 * - stock: entero, obligatorio (cantidad disponible).
 * - categoria_id: entero, obligatorio, clave foránea a "categorias".
 * - activo: booleano, indica si el producto está activo (default: true).
 * - creado_en: fecha, fecha de creación (default: ahora).
 * Opciones:
 * - tableName: nombre explícito de la tabla.
 * - timestamps: desactivado (no crea createdAt ni updatedAt automáticos).
 */
const Producto = sequelize.define(
  "Producto",
  {
    id: {
      //datos de id
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      // datos de nombre
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categorias",
        key: "id",
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "productos", //nombre de la tabla a la ue hace referencia
    timestamps: false,
  }
);

module.exports = Producto;
