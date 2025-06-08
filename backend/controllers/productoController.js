const Producto = require("../models/producto");

const listarProductos = async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
};

const obtenerProductoPorId = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  res.json(producto);
};

const crearProducto = async (req, res) => {
  try {
    const productoNuevo = await Producto.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: req.body.imagen,
    });
    // 201 es que se creo bien
    res.status(201).json(productoNuevo);
  } catch (error) {
    //500 error interno(?
    res.status(500).json({ mensaje: "Error al editar el producto", error });
  }
};

const modificarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    //si el producto no existe, retorna 404 no encontrado
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });

    await producto.update({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: req.body.imagen,
    });

    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el producto", error });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
  }
};


module.exports = {
  listarProductos,
  obtenerProductoPorId,
  crearProducto,
  modificarProducto,
  eliminarProducto
};
