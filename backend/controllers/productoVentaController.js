const productoVenta = require("../models/productoVenta");

/**
 * Obtiene y devuelve todos los registros de productos en ventas.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const listarProductosVentas = async (req, res) => {
  const productosVentas = await productoVenta.findAll();
  res.json(productosVentas);
};

/**
 * Obtiene y devuelve un productoVenta por su ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del productoVenta a obtener.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const obtenerProductoVentaPorId = async (req, res) => {
  const productoventa = await productoVenta.findByPk(req.params.id);
  res.json(productoventa);
};

/**
 * Crea un nuevo registro productoVenta con los datos recibidos.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.body - Datos para crear el productoVenta.
 * @param {number} req.body.venta_id - ID de la venta asociada.
 * @param {number} req.body.producto_id - ID del producto asociado.
 * @param {number} req.body.cantidad - Cantidad vendida.
 * @param {number} req.body.precio_unitario - Precio unitario de venta.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const crearProductoVenta = async (req, res) => {
  try {
    const nuevoProductoVenta = await productoVenta.create({
      venta_id: req.body.venta_id,
      producto_id: req.body.producto_id,
      cantidad: req.body.cantidad,
      precio_unitario: req.body.precio_unitario,
    });
    res.status(201).json(nuevoProductoVenta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el productoVenta", error });
  }
};

/**
 * Modifica un registro productoVenta existente según ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del productoVenta a modificar.
 * @param {Object} req.body - Nuevos datos para actualizar el productoVenta.
 * @param {number} req.body.venta_id - ID actualizado de la venta.
 * @param {number} req.body.producto_id - ID actualizado del producto.
 * @param {number} req.body.cantidad - Nueva cantidad.
 * @param {number} req.body.precio_unitario - Nuevo precio unitario.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const modificarProductoVenta = async (req, res) => {
  try {
    const productoventa = await productoVenta.findByPk(req.params.id);
    if (!productoventa) {
      return res.status(404).json({ mensaje: "ProductoVenta no encontrado" });
    }
    await productoventa.update({
      venta_id: req.body.venta_id,
      producto_id: req.body.producto_id,
      cantidad: req.body.cantidad,
      precio_unitario: req.body.precio_unitario,
    });
    res.json(productoventa);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al editar el productoVenta", error });
  }
};

/**
 * Elimina un registro productoVenta por su ID.
 * @param {Object} req - Objeto petición HTTP.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - ID del productoVenta a eliminar.
 * @param {Object} res - Objeto respuesta HTTP.
 */
const eliminarProductoVenta = async (req, res) => {
  try {
    const productoventa = await productoVenta.findByPk(req.params.id);
    if (!productoventa) {
      return res.status(404).json({ mensaje: "ProductoVenta no encontrado" });
    }
    await productoventa.destroy();
    res.json({ mensaje: "ProductoVenta eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar el productoVenta", error });
  }
};

module.exports = {
  listarProductosVentas,
  obtenerProductoVentaPorId,
  crearProductoVenta,
  modificarProductoVenta,
  eliminarProductoVenta,
};
