const productoVenta = require("../models/productoVenta");


const listarProductosVentas = async (req, res) =>{
    const productosVentas = await productoVenta.findAll();
    res.json(productosVentas);
}

const obtenerProductoVentaPorId = async (req, res) =>{
    const productoventa = await productoVenta.findByPk(req.params.id);
    res.json(productoventa)
}

module.exports = {
    listarProductosVentas,
    obtenerProductoVentaPorId
}