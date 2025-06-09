const sequelize = require('../config/db');

const Producto =require("./producto");
const ProductoVenta =require("./productoVenta");
const Usuario =require("./usuario");
const Venta =require("./venta");
const Categoria =require("./categoria");


// cada producto tiene relacion con una categoria
Producto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  as: 'categoria',
});;

// una categoria tiene relacion con muchos productos
Categoria.hasMany(Producto, {
  foreignKey: 'categoria_id',
  as: 'productos',
});

// un producto puede estar en muchas ventas muchos a muchos a través del modelo ProductoVenta
Producto.belongsToMany(Venta, {
  through: ProductoVenta,
  foreignKey: 'producto_id',
  otherKey: 'venta_id',
  as: 'ventas'
});

//una venta puede incluir muchos productos También usa ProductoVenta como tabla intermedia 
Venta.belongsToMany(Producto, {
  through: ProductoVenta,
  foreignKey: 'venta_id',
  otherKey: 'producto_id',
  as: 'productos'
});

//un registro de productoVenta está vinculado a un producto
ProductoVenta.belongsTo(Producto, { foreignKey: 'producto_id' });

//un registro de productoVenta está vinculado a una venta
ProductoVenta.belongsTo(Venta, { foreignKey: 'venta_id' });

module.exports = {
    sequelize,
    Producto,
    Usuario,
    Venta,
    Categoria
}