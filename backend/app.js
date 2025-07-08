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

const { Categoria, Producto, Usuario } = require("./models");
const bcrypt = require("bcryptjs");

sequelize.sync({ alter: true }).then(async () => {
  console.log("🔄 Base de datos sincronizada con Sequelize.");


const categoriasPorDefecto = ["Limpieza", "Cuidado personal"];
for (const nombre of categoriasPorDefecto) {
  await Categoria.findOrCreate({ where: { nombre } });
}


// Crear productos si no existen
const cantidadProductos = await Producto.count();
  if (cantidadProductos === 0) {
    const limpieza = await Categoria.findOne({ where: { nombre: "Limpieza" } });
    const cuidado = await Categoria.findOne({ where: { nombre: "Cuidado personal" } });

    await Producto.bulkCreate([
      {
        nombre: "Desinfectante cif",
        descripcion: "Para una limpieza profunda en toda la casa.",
        precio: 450.00,
        imagen: "http://localhost:3000/storage/img/desinfectante.png",
        stock: 30,
        categoria_id: limpieza.id,
      },
      {
        nombre: "Shampoo Nutritivo",
        descripcion: "Con vitamina E para cabello seco.",
        precio: 750.50,
        imagen: "http://localhost:3000/storage/img/shampoo.png",
        stock: 20,
        categoria_id: cuidado.id,
      },
      {
        nombre: "Jabón Líquido Antibacterial",
        descripcion: "Elimina el 99.9% de las bacterias.",
        precio: 520.00,
        imagen: "http://localhost:3000/storage/img/jabon_liquido.png",
        stock: 40,
        categoria_id: cuidado.id,
      },
      {
        nombre: "Cepillo de Dientes",
        descripcion: "Ideal para los dientes.",
        precio: 300.00,
        imagen: "http://localhost:3000/storage/img/cepillo.png",
        stock: 25,
        categoria_id: limpieza.id,
      },
    ]);

    console.log("🛒 Productos precargados exitosamente.");
  }

// Crear usuario root si no hay usuarios
const cantidadUsuarios = await Usuario.count();
if (cantidadUsuarios === 0) {
  const passwordHash = await bcrypt.hash("root123", 10);
  await Usuario.create({
    nombre: "root",
    email: "root@root.com",
    password: passwordHash,
    rol: "root",
  });
  console.log("👤 Usuario root creado exitosamente.");
}
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
  });
});
