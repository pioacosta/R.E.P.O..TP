const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ mensaje: "Credenciales inválidas" });
  }
  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    return res.status(401).json({ mensaje: "Credenciales inválidas" });
  }
  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET || "secreto",
    { expiresIn: "2h" }
  );
  res.json({
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
  });
};

module.exports = { login };
