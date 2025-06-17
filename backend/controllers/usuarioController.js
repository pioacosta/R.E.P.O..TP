const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

const listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

const obtenerUsuarioPorId = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.json(usuario);
};

const crearUsuario = async (req, res) => {
  try {
    // Solo un admin puede crear otro admin
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const nuevoUsuario = await Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: hashedPassword,
      rol: req.body.rol,
    });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el usuario", error });
  }
};

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
