const Venta = require("../models/venta");

const listarVentas = async (req, res) => {
  const ventas = await Venta.findAll();
  res.json(ventas);
};

const obtenerVentaPorId = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id);
  res.json(venta);
};

module.exports = {
  listarVentas,
  obtenerVentaPorId
};
