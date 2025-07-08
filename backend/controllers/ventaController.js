const Venta = require("../models/venta");
const ProductoVenta = require("../models/productoVenta");
const Producto = require("../models/producto");
const sequelize = require("../config/db");
const listarVentas = async (req, res) => {
  const ventas = await Venta.findAll();
  res.json(ventas);
};

const obtenerVentaPorId = async (req, res) => {
  const venta = await Venta.findByPk(req.params.id);
  res.json(venta);
};

const crearVenta = async (req, res) => {
  const { cliente_nombre, productos } = req.body;
  // productos = [{ producto_id, cantidad }]

  const t = await sequelize.transaction();

  try {
    const venta = await Venta.create(
      { cliente_nombre, fecha: new Date(), total: 0 },
      { transaction: t }
    );

    let totalVenta = 0;

    for (const item of productos) {
      const producto = await Producto.findByPk(item.producto_id, { transaction: t });

      if (!producto) {
        throw { code: 400, message: `Producto con ID ${item.producto_id} no encontrado.` };
      }

      if (producto.stock < item.cantidad) {
        throw { code: 400, message: `Stock insuficiente para el producto "${producto.nombre}".` };
      }

      await ProductoVenta.create(
        {
          producto_id: producto.id,
          venta_id: venta.id,
          cantidad: item.cantidad,
          precio_unitario: producto.precio,
        },
        { transaction: t }
      );

      producto.stock -= item.cantidad;
      await producto.save({ transaction: t });

      totalVenta += item.cantidad * producto.precio;
    }

    venta.total = totalVenta;
    await venta.save({ transaction: t });

    await t.commit();

    res.status(201).json({ success: true, venta_id: venta.id });
  } catch (error) {
    await t.rollback();

    const statusCode = error.code || 500;
    const mensaje = error.message || "Error inesperado al procesar la venta.";

    console.error(error);
    res.status(statusCode).json({ success: false, mensaje });
  }
};

const modificarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    await venta.update({
      cliente_nombre: req.body.cliente_nombre,
      total: req.body.total,
      fecha: req.body.fecha,
    });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar la venta", error });
  }
};

const eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByPk(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: "Venta no encontrada" });
    }
    await venta.destroy();
    res.json({ mensaje: "Venta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la venta", error });
  }
};

const obtenerDetalleVenta = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findByPk(id, {
      include: {
        model: Producto,
        as: 'productos',
        through: {
          attributes: ['cantidad', 'precio_unitario'],
        },
      },
    });

    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el detalle de la venta' });
  }
};
const obtenerDetallesVentas = async (req, res) => {
  const { id } = req.params;

  try {
    const venta = await Venta.findAll( {
      include: {
        model: Producto,
        as: 'productos',
        through: {
          attributes: ['cantidad', 'precio_unitario'],
        },
      },
    });

    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }

    res.json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el detalle de la venta' });
  }
};


module.exports = {
  listarVentas,
  obtenerVentaPorId,
  crearVenta,
  modificarVenta,
  eliminarVenta,
  obtenerDetalleVenta,
  obtenerDetallesVentas
};
