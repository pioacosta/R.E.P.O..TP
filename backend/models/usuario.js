const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Modelo Sequelize para la tabla "usuarios".
 * Campos:
 * - id: entero, clave primaria, autoincremental.
 * - nombre: cadena, obligatorio.
 * - email: cadena, obligatorio, único.
 * - password: cadena, obligatorio (se debe almacenar hasheado).
 * - rol: cadena, obligatorio (ejemplo: "admin", "usuario").
 * - creado_en: fecha, fecha de creación (default: ahora).
 * Opciones:
 * - tableName: nombre explícito de la tabla.
 * - timestamps: desactivado (no crea createdAt ni updatedAt automáticos).
 */
const Usuario = sequelize.define(
  "Usuario",
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
    email: {
      // datos de correo
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      // datos de contraseña  queda hashear o encriptar contraseña
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      // datos de tipo
      type: DataTypes.STRING,
      allowNull: false,
    },
    creado_en: {
      // datos de creacion
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuarios", // nombre de la tabla a la ue hace referencia
    timestamps: false, // desactiva createdAt y updatedAt automáticos
  }
);
module.exports = Usuario;
