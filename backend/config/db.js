// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


// Configuración de la conexión
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', 
    logging: false, 
  }
);

// Verificar conexión
sequelize.authenticate()
  .then(() => console.log('Conexión a MySQL con Sequelize exitosa!'))
  .catch(err => console.error('Error al conectar con Sequelize:', err));

module.exports = sequelize;