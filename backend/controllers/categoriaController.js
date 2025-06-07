const Categoria =  require("../models/categoria");

const listarCategorias = async(req, res) => {
    const categorias = await Categoria.findAll();
    res.json(categorias);
};

const obtenerCategoriaPorId = async (req, res) => {
    const categoria = await Categoria.findByPk(req.params.id);
    res.json(categoria);
}


module.exports = {
    listarCategorias,
    obtenerCategoriaPorId
}