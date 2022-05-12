const listaCtrl = {};
const async = require('hbs/lib/async');
const Producto = require('../models/Lista');
const Usuario = require('../models/Usuario')


listaCtrl.mostrarLista = async (req, res) => {

    const lista = await Producto.find({ usuario: req.user.id }).sort({ date: 'desc' }).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('lista/mostrar-lista', { lista, datos_usuario, layout: false });
}

listaCtrl.crearProducto = async (req, res) => {
    // console.table(req.body)
    const errores = [];
    const { nombre, cantidad, precio_unidad } = req.body;
    const nuevoProducto = new Producto({ nombre, cantidad, precio_unidad });
    if (nombre.length == 0) {
        errores.push({ text: 'El campo de "Producto" tiene que estar relleno"' });
    }
    if (cantidad.length == 0) {
        errores.push({ text: 'El campo de "Cantidad" tiene que estar relleno"' });
    }
    if (errores.length > 0) {
        res.render('lista/mostrar-lista', {
            errores,
            nombre,
            cantidad,
            precio_unidad
        })
    }
    else {
        nuevoProducto.usuario = req.user.id;
        await nuevoProducto.save();
        req.flash('mensaje_correcto', 'Producto añadido de forma correcta.');
        res.redirect('/lista')
    }
}
listaCtrl.editarProductoForm = async (req, res) => {
    const producto = await Producto.findById(req.params.id).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();

    if (producto.usuario != req.user.id) {
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    res.render('lista/editar-producto', { producto, datos_usuario, layout: false });
}

listaCtrl.actualizarProducto = async (req, res) => {
    const { nombre, cantidad, precio_unidad } = req.body;
    await Producto.findByIdAndUpdate(req.params.id, { nombre, cantidad, precio_unidad }).lean();
    req.flash('mensaje_correcto', 'Producto editado de forma correcta.');
    res.redirect('/lista');
}

listaCtrl.borrarProducto = async (req, res) => {
    const producto = await Producto.findById(req.params.id).lean();
    if (producto.usuario != req.user.id) {
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/lista')
    }
    await Producto.findByIdAndDelete(req.params.id);
    req.flash('mensaje_correcto', 'Producto eliminado de forma correcta.');
    res.redirect('/lista');
}

module.exports = listaCtrl;