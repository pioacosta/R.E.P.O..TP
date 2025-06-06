const express = require('express');
const conexion = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // usa mi el puerto que le destine en mi variable de entorno o el puerto 3000

// Middleware para JSON
app.use(express.json());

// Ruta para obtener productos_ventas
app.get('/administradores', (req, res) => {
  conexion.query('SELECT * FROM ventas', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error en la base de datos');
    }
    res.status(200).json(results);
  });
});

// Ruta por defecto (404) no econtrado
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});


app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
