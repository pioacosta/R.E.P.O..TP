const productoVenta = require("../models/productoVenta");

const listarProductosVentas = async (req, res) => {
  const productosVentas = await productoVenta.findAll();
  res.json(productosVentas);
};

const obtenerProductoVentaPorId = async (req, res) => {
  const productoventa = await productoVenta.findByPk(req.params.id);
  res.json(productoventa);
};

const crearProductoVenta = async (req, res) => {
  try {
    const nuevoProductoVenta = await productoVenta.create({
      venta_id: req.body.venta_id,
      producto_id: req.body.producto_id,
      cantidad: req.body.cantidad,
      precio_unitario: req.body.precio_unitario,
    });
    res.status(201).json(nuevoProductoVenta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el productoVenta", error });
  }
};

const modificarProductoVenta = async (req, res) => {
  try {
    const productoventa = await productoVenta.findByPk(req.params.id);
    if (!productoventa) {
      return res.status(404).json({ mensaje: "ProductoVenta no encontrado" });
    }
    await productoventa.update({
      venta_id: req.body.venta_id,
      producto_id: req.body.producto_id,
      cantidad: req.body.cantidad,
      precio_unitario: req.body.precio_unitario,
    });
    res.json(productoventa);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar el productoVenta", error });
  }
};

const eliminarProductoVenta = async (req, res) => {
  try {
    const productoventa = await productoVenta.findByPk(req.params.id);
    if (!productoventa) {
      return res.status(404).json({ mensaje: "ProductoVenta no encontrado" });
    }
    await productoventa.destroy();
    res.json({ mensaje: "ProductoVenta eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el productoVenta", error });
  }
};

module.exports = {
  listarProductosVentas,
  obtenerProductoVentaPorId,
  crearProductoVenta,
  modificarProductoVenta,
  eliminarProductoVenta,
};
