const { validationResult } = require("express-validator");


/**
 * Middleware que maneja los errores generados por las validaciones con express-validator.
 * Si existen errores, responde con estado 400 y un array con los detalles.
 * Si no hay errores, continúa al siguiente middleware o controlador.
 * 
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} res - Objeto respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
function manejarErroresValidacion(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
}

module.exports = manejarErroresValidacion;
