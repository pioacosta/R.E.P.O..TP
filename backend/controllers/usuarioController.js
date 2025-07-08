const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");


/**
 * Obtiene y devuelve todos los usuarios registrados.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};


/**
 * Obtiene y devuelve un usuario por su ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del usuario a obtener.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const obtenerUsuarioPorId = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.json(usuario);
};


/**
 * Crea un nuevo usuario con los datos recibidos.
 * La contraseña se guarda encriptada.
 * Por defecto, el rol es "admin" si no se especifica otro.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.body - Datos para crear el usuario (nombre, email, password, rol).
 * @param {Object} res - Objeto respuesta HTTP.
 */
const crearUsuario = async (req, res) => {
  const rol = req.body.rol || "admin"
  try {
    // Solo un admin puede crear otro admin
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const nuevoUsuario = await Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: hashedPassword,
      rol: rol,
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el usuario", error });
  }
};

/**
 * Modifica un usuario existente según su ID con los datos recibidos.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del usuario a modificar.
 * @param {Object} req.body - Nuevos datos para el usuario.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const modificarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    await usuario.update({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
      rol: req.body.rol,
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el usuario", error });
  }
};


/**
 * Elimina un usuario según su ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del usuario a eliminar.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    await usuario.destroy();
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
};
