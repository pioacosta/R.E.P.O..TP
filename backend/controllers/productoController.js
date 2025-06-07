const Producto = require("../models/producto");


const listarProductos = async (req, res) =>{
    const productos = await Producto.findAll();
    res.json(productos);
}

const obtenerProductoPorId = async (req, res) =>{
    const producto = await Producto.findByPk(req.params.id);
    res.json(producto)
}

module.exports = {
    listarProductos,
    obtenerProductoPorId
}