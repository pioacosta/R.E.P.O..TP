const Categoria = require("../models/categoria");


/**
 * Obtiene y devuelve todas las categorías.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const listarCategorias = async (req, res) => {
  const categorias = await Categoria.findAll();
  res.json(categorias);
};


/**
 * Busca y devuelve una categoría específica según el ID recibido en los parámetros de la petición.
 * @param {string} id - ID de la categoría a buscar.
 */
const obtenerCategoriaPorId = async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);
  res.json(categoria);
};

/**
 * Recibe datos (nombre y descripción) para crear una nueva categoría y la guarda en la base de datos.
 * Devuelve la categoría creada o un error en caso de fallo.
 * @param {string} nombre - Nombre de la nueva categoría.
 * @param {string} descripcion - Descripción de la nueva categoría.
 */
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


/**
 * Busca una categoría por ID, actualiza sus datos (nombre y descripción) con la información recibida y devuelve la categoría modificada.
 * Maneja errores si no encuentra la categoría o falla la actualización.
 * @param {string} id - ID de la categoría a modificar.
 * @param {string} nombre - Nuevo nombre de la categoría.
 * @param {string} descripcion - Nueva descripción de la categoría.
 */
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


/**
 * Elimina una categoría según el ID proporcionado.
 * Responde con mensaje de éxito o error si no existe o no se pudo eliminar.
 * @param {string} id - ID de la categoría a eliminar.
 */
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
