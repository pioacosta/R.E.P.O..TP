const jwt = require("jsonwebtoken");

/**
 * Middleware que verifica la validez del token JWT en el encabezado Authorization.
 * Extrae el token, lo verifica y, si es válido, agrega los datos del usuario a la petición.
 * Responde con error 401 si no hay token, o 403 si el token es inválido.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} res - Objeto respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET || "secreto", (err, user) => {
    if (err) return res.status(403).json({ mensaje: "Token inválido" });
    req.user = user;
    next();
  });
};


/**
 * Middleware que permite el acceso solo a usuarios con roles especificados.
 * Verifica si el rol del usuario (agregado en req.user) está entre los roles permitidos.
 * Responde con error 403 si el usuario no tiene permisos.
 * @param {...string} rolesPermitidos - Lista de roles autorizados.
 * @returns {Function} Middleware para control de acceso por roles.
 */
const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: "No tenés permisos" });
    }
    next();
  };
};

module.exports = { verificarToken, permitirRoles };
