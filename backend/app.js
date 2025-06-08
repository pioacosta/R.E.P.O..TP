const express = require("express");
const cors = require("cors");
require("dotenv").config(); // primero cargamos las variables de entorno

const app = express();
app.use(cors());
app.use(express.json()); // Middleware para JSON

// Rutas
const usuariosRouter = require("./routes/usuariosRoutes");
const categoriaRouter = require("./routes/categoriaRoutes");
const productosRouter = require("./routes/productosRoutes");
const ventasRouter = require("./routes/ventasRouter");
const productosVentasRouter = require("./routes/productosVentasRouter");

// Rutas de la API
app.use("/usuarios", usuariosRouter);
app.use("/categorias", categoriaRouter);
app.use("/productos", productosRouter);
app.use("/ventas", ventasRouter);
app.use("/productosVentas", productosVentasRouter);

// Ruta por defecto (404)
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Base de datos
const sequelize = require("./config/db");
const Producto = require("./models"); // Importar modelos

// Sincronizar DB y luego arrancar el servidor
sequelize.sync({ alter: true }).then(() => {
  console.log("🔄 Base de datos sincronizada con Sequelize.");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
  });
});
