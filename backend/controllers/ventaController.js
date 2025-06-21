const Venta = require("../models/venta");

const listarVentas = async (req, res) => {
  const ventas = await Venta.findAll();
  res.json(ventas);
};

const obtenerVentaPorId = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id);
  res.json(venta);
};

const crearVenta = async (req, res) => {
  try {
    const ventaNueva = await Venta.create({
      cliente_nombre: req.body.cliente_nombre,
      total: req.body.total,
      fecha: req.body.fecha,
    });
    res.status(201).json({ venta_id: ventaNueva.id});
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la venta", error });
  }
};

const modificarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    await venta.update({
      cliente_nombre: req.body.cliente_nombre,
      total: req.body.total,
      fecha: req.body.fecha,
    });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar la venta", error });
  }
};

const eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    await venta.destroy();
    res.json({ mensaje: "Venta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la venta", error });
  }
};

module.exports = {
  listarVentas,
  obtenerVentaPorId,
  crearVenta,
  modificarVenta,
  eliminarVenta,
};
