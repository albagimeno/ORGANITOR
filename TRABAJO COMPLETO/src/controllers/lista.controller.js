const listaCtrl = {};
const async = require('hbs/lib/async');
// Llamada al modelo de producto
const Producto = require('../models/Lista');
// Llamada al modelo de usuario
const Usuario = require('../models/Usuario')

/* Muestra el fichero /views/lista/mostrar-lista.hbs, el cual va solicitar a 
la base de datos todos los productos cuyo usuario  coincida con el id del usuario que está
autenticado en la sesión. */
listaCtrl.mostrarLista = async (req, res) => {

    const lista = await Producto.find({ usuario: req.user.id }).sort({ date: 'desc' }).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('lista/mostrar-lista', { lista, datos_usuario, layout: false });
}

/* Procesa los datos recogidos en el formulario de creación del producto, 
Verifica que los campos obligatorios están rellenos y procesa los errores.
Si no hay errores guarda el producto en la base de datos con el id del usuario
que está autenticado en dicha sesión.
Después de la creación del producto redirige a la ruta /lista */
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

/* Busca en la base de datos el producto con el id que recoge de la URL,
Comprueba que el id del usuario de dicho producto coincide con el id del usuario de la sesión,
si coincide muestra el fichero /views/lista/editar-producto.hbs con los datos 
de ese producto en concreto */
listaCtrl.editarProductoForm = async (req, res) => {
    const producto = await Producto.findById(req.params.id).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();

    if (producto.usuario != req.user.id) {
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    res.render('lista/editar-producto', { producto, datos_usuario, layout: false });
}

/* Procesa los datos recogidos en el formulario de edición del producto, 
entonces el producto se actualiza la base de datos solo en los campos rellenados
en el formulario.
Después de la edición del producto redirige a la ruta /lista */
listaCtrl.actualizarProducto = async (req, res) => {
    const { nombre, cantidad, precio_unidad } = req.body;
    await Producto.findByIdAndUpdate(req.params.id, { nombre, cantidad, precio_unidad }).lean();
    req.flash('mensaje_correcto', 'Producto editado de forma correcta.');
    res.redirect('/lista');
}

/* Busca en la base de datos el producto con el id que recoge de la URL,
si el id del usuario de ese producto coincide con el id del usuario que ha iniciado 
la sesión el producto se borra de la base de datos.
Una vez borrado redirige a la ruta /lista */
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