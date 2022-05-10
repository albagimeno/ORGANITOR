const listaCtrl = {};
const async = require('hbs/lib/async');
const Nota = require('../models/Lista');


listaCtrl.mostrarLista = (req, res) => {
    res.render('lista/mostrar-lista', { layout: false });
}

listaCtrl.crearProducto = async (req, res) => {
    // console.table(req.body)
    const { nombre, cantidad, precio_unidad } = req.body;
    const nuevoProducto = new Producto({ nombre, cantidad, precio_unidad});
    await nuevoProducto.save();
    req.flash('mensaje_correcto', 'Producto añadido de forma correcta.');
    res.redirect('/lista')
}

listaCtrl.editarProductoForm = async (req, res) => {
    const producto = await Producto.findById(req.params.id).lean();
    res.render('notas/editar-producto', { producto, layout: false });
}

listaCtrl.actualizarProducto = async (req, res) => {
    const { nombre, cantidad, precio_unidad } = req.body;
    await Producto.findByIdAndUpdate(req.params.id, { nombre, cantidad, precio_unidad}).lean();
    req.flash('mensaje_correcto', 'Producto editado de forma correcta.');
    res.redirect('/lista');
}

listaCtrl.borrarProducto = async (req, res) => {
    await Producto.findByIdAndDelete(req.params.id);
    req.flash('mensaje_correcto', 'Producto eliminado de forma correcta.');
    res.redirect('/lista');
}

module.exports = listaCtrl;