const Usuario = require("../models/usuario");

const listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

const obtenerUsuarioPorId = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.json(usuario);
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
};
