const Producto = require("../models/producto");

const listarProductos = async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
};

const productospaginados = async (page = 1, limit = 10) =>{
  const offset = (page -1) * limit; // offset seria decirle a la base de datos desde que registro traer los datos

  const { cotador, rows } = await Producto.findAndCountAll({
    where: {
      activo: true  // filtra todos los productos por los que esten activos
    },
  })

}


const obtenerProductoPorId = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  res.json(producto);
};

const crearProducto = async (req, res) => {
  try {

    const img = req.file;
    const imgURL = `${req.protocol}://${req.get('host')}/storage/img/${img.filename}`

    const productoNuevo = await Producto.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: imgURL, // nombre del archivo subido
      categoria_id: req.body.categoria_id,
      stock: req.body.stock
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: productoNuevo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
};

const modificarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    //si el producto no existe, retorna 404 no encontrado
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });

    const img = req.file;
    const imgURL = `${req.protocol}://${req.get('host')}/storage/img/${img.filename}`
    

    await producto.update({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      imagen: imgURL,
      categoria_id: req.body.categoria_id,
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
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    await producto.destroy();
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el producto", error });
  }
};

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
  obtenerProductoPorId,
  crearProducto,
  modificarProducto,
  eliminarProducto,
  darDeBajaProducto,
  darDeAltaProducto,
};
