const express = require('express');
require('dotenv').config();
const usuariosRouter = require('./routes/usuarios');
const app = express();

const PORT = process.env.PORT || 3000; // usa mi el puerto que le destine en mi variable de entorno o el puerto 3000

// Middleware para JSON
app.use(express.json());

//rutas de la API
app.use('/usuarios', usuariosRouter)

// Ruta por defecto (404) no econtrado
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});


app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
