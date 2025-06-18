const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/storage", express.static("storage"));

// Rutas de la API
const usuariosRouter = require("./routes/usuariosRoutes");
const categoriaRouter = require("./routes/categoriaRoutes");
const productosRouter = require("./routes/productosRoutes");
const ventasRouter = require("./routes/ventasRouter");
const productosVentasRouter = require("./routes/productosVentasRouter");
const authRoutes = require("./routes/authRoutes");

app.use("/usuarios", usuariosRouter);
app.use("/categorias", categoriaRouter);
app.use("/productos", productosRouter);
app.use("/ventas", ventasRouter);
app.use("/productosVentas", productosVentasRouter);
app.use("/auth", authRoutes);

// Ruta por defecto (404)
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Base de datos
const sequelize = require("./config/db");
require("./models");

const { Categoria } = require("./models");

sequelize.sync({ alter: true }).then(async () => {
  console.log("🔄 Base de datos sincronizada con Sequelize.");

  // Crear categorías por defecto si no existen
  const categoriasPorDefecto = ["Limpieza", "Cuidado personal"];
  for (const nombre of categoriasPorDefecto) {
    await Categoria.findOrCreate({ where: { nombre } });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
  });
});
