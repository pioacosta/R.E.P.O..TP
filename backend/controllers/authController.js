const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Controlador para login de usuario.
 * Valida credenciales, genera un token JWT y responde con el token y datos del usuario.
 * 
 * @param {Object} req - Objeto de la petición HTTP.
 * @param {Object} req.body - Datos enviados en el cuerpo de la petición.
 * @param {string} req.body.email - Email del usuario que intenta iniciar sesión.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * 
 * @returns {JSON} Respuesta con token JWT y datos del usuario si el login es correcto,
 *                 o error 401 con mensaje si las credenciales son inválidas.
 */
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
