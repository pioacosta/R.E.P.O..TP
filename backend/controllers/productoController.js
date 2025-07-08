const Producto = require("../models/producto");
const path = require("path");
const fs = require("fs");

/**
 * Obtiene y devuelve la lista completa de productos.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const listarProductos = async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
};

/**
 * Obtiene productos activos paginados según parámetros query (page y limit).
 * Devuelve productos, página actual, total de páginas y total de productos.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.query - Parámetros query con page y limit opcionales.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const productospaginados = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    const { count, rows } = await Producto.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    const totalPaginas = Math.ceil(count / limit);

    res.json({
      productos: rows,
      paginaActual: page,
      totalPaginas: totalPaginas,
      totalProductos: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtener productos paginados",
      error: error.message,
    });
  }
};


/**
 * Obtiene un producto específico por su ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del producto a obtener.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const obtenerProductoPorId = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  res.json(producto);
};

/**
 * Crea un nuevo producto con los datos recibidos y la imagen subida.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.body - Datos del producto (nombre, descripción, precio, categoria_id, stock).
 * @param {Object} req.file - Archivo de imagen subido.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const crearProducto = async (req, res) => {
  try {
    const img = req.file;
    const imgURL = `${req.protocol}://${req.get("host")}/storage/img/${
      img.filename
    }`;

    const productoNuevo = await Producto.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: imgURL, // nombre del archivo subido
      categoria_id: req.body.categoria_id,
      stock: req.body.stock,
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: productoNuevo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al crear producto", error: error.message });
  }
};

/**
 * Modifica un producto existente identificado por ID.
 * Actualiza datos y reemplaza imagen si se sube una nueva (elimina la anterior).
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del producto a modificar.
 * @param {Object} req.body - Nuevos datos del producto.
 * @param {Object} [req.file] - Archivo de imagen nuevo opcional.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const modificarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });

    let imgURL = producto.imagen;

    if (req.file) {
      const rutaImagenAnterior = path.resolve(__dirname, "../storage/img", path.basename(producto.imagen));

      try {
        if (fs.existsSync(rutaImagenAnterior)) {
          fs.unlinkSync(rutaImagenAnterior);
          
        } 
      } catch (err) {
        console.error(" Error al intentar eliminar la imagen anterior:", err);
      }

      imgURL = `${req.protocol}://${req.get("host")}/storage/img/${req.file.filename}`;
    }

    await producto.update({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: imgURL,
      categoria_id: req.body.categoria_id,
      stock: req.body.stock,
    });

    res.json({ mensaje: "Producto actualizado correctamente", producto });
  } catch (error) {
    console.error(" Error al modificar el producto:", error);
    res.status(500).json({ mensaje: "Error al editar el producto", error });
  }
};


/**
 * Elimina un producto por su ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del producto a eliminar.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    await producto.destroy();
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el producto", error });
  }
};


/**
 * Cambia el estado activo/inactivo de un producto (dar de baja o activar).
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del producto a modificar el estado.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const darDeBajaProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    producto.activo = !producto.activo;
    await producto.save();
    res.json({ mensaje: "Producto dado de baja correctamente", producto });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al dar de baja el producto", error });
  }
};


/**
 * Da de alta (activa) un producto.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del producto a activar.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const darDeAltaProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    producto.activo = true;
    await producto.save();
    res.json({ mensaje: "Producto dado de alta correctamente", producto });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al dar de alta el producto", error });
  }
};

module.exports = {
  listarProductos,
  productospaginados,
  obtenerProductoPorId,
  crearProducto,
  modificarProducto,
  eliminarProducto,
  darDeBajaProducto,
  darDeAltaProducto,
};
