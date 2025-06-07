const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { //datos de id
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { // datos de nombre
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: { // datos de tipo
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: { // datos de correo
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    contraseña: { // datos de contraseña  queda hashear o encriptar contraseña
      type: DataTypes.STRING,
      allowNull: false,
    },
    creado_en: { // datos de creacion
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "usuarios", // nombre real de la tabla
    timestamps: false, // desactiva createdAt y updatedAt automáticos
  }
);
module.exports = Usuario;