const Producto = require("../models/producto");

const productospaginados = async (pagina = 1, limite = 10) =>{
  const desde = (pagina -1) * limite; // offset seria decirle a la base de datos desde que registro traer los datos

  const { count, rows } = await Producto.findAndCountAll({
   
    limit: limite,
    offset: desde,
    order: [['id', 'ASC']] // ordenado con id ascendente
  });


  const totalPaginas = Math.ceil(count / limite);

  return {
    totalItems: count,
    totalPaginas,
    paginaActual: pagina,
    productos : rows,
  };
}


module.exports = {
    productospaginados
};