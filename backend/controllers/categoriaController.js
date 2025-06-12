const Categoria = require("../models/categoria");

const listarCategorias = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json(categorias);
};

const obtenerCategoriaPorId = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  res.json(categoria);
};

const crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await Categoria.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la categoría", error });
  }
};

const modificarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    await categoria.update({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
    });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar la categoría", error });
  }
};

const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    await categoria.destroy();
    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la categoría", error });
  }
};

module.exports = {
  listarCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  modificarCategoria,
  eliminarCategoria,
};
