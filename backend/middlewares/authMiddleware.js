const jwt = require("jsonwebtoken");

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

const soloAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ mensaje: "Solo administradores" });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };
