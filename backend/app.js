const express = require("express");
const cors = require("cors");
require("dotenv").config();

/**
 * Configuración principal del servidor Express.
 * 
 * Middlewares:
 * - cors: para habilitar CORS.
 * - express.json: para parsear JSON en requests.
 * - express.static: sirve archivos estáticos del frontend y carpeta "storage".
 * 
 * Rutas montadas:
 * - /usuarios         -> usuariosRouter
 * - /categorias       -> categoriaRouter
 * - /productos        -> productosRouter
 * - /ventas           -> ventasRouter
 * - /productosVentas  -> productosVentasRouter
 * - /auth             -> authRoutes
 * - /img              -> sirve imágenes estáticas desde "storage/img"
 * 
 * Manejo de rutas no encontradas:
 * - Devuelve 404 con mensaje "Página no encontrada".
 * 
 * Base de datos:
 * - Sincroniza modelos Sequelize con la BD (alter true).
 * - Crea categorías por defecto si no existen ("Limpieza", "Cuidado personal").
 * 
 * Servidor:
 * - Escucha en puerto definido por env o 3000.
 * - Muestra URL al iniciar.
 */

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
app.use('/img', express.static('storage/img'));



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
