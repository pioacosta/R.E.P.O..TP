const mysql = require('mysql2');
require('dotenv').config();



// Configuración de la conexión
const connection = mysql.createConnection({
  host: process.env.DB_HOTS,    // puerto que elegiste
  user: process.env.DB_USER,        // nombre de tu usuario en sql
  password: process.env.DB_PASS, // contraseña de sql
  database: process.env.DB_NAME // nombre de la base de datos que creaste
});

// Intentar conectarse a la base de datos
connection.connect(error => {
  if (error) {
    console.error('Error de conexión:', error);
    return;
  }
  console.log('Conexión a MySQL exitosa!');
});

module.exports = connection;