const notasCtrl = {};
const async = require('hbs/lib/async');
const Nota = require('../models/Notas');
const Usuario = require('../models/Usuario')
const passport = require('passport')

notasCtrl.mostrarNotaForm = async (req, res) => {
    //console.log(req.user)
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('notas/nota-nueva', { datos_usuario, layout: false });
}

notasCtrl.crearNota = async (req, res) => {
    // console.table(req.body)
    const errores = [];
    const { titulo, descripcion } = req.body;
    if (titulo.length == 0) {
        errores.push({ text: 'El campo de "Título" tiene que estar relleno"' });
    }
    if (descripcion.length == 0) {
        errores.push({ text: 'El campo de "Descripción" tiene que estar relleno"' });
    }
    if (errores.length > 0) {
        res.render('notas/nota-nueva', {
            errores,
            titulo,
            descripcion
        })
    }
    else {
        const nuevaNota = new Nota({ titulo, descripcion });
        nuevaNota.usuario = req.user.id;
        await nuevaNota.save();
        req.flash('mensaje_correcto', 'Nota añadida de forma correcta');
        res.redirect('/notas')
    }

}

notasCtrl.mostrarTodasNotas = async (req, res) => {
    const notas = await Nota.find({ usuario: req.user.id }).sort({
        createdAt: -1
    }).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('notas/mostrar-notas', { notas, datos_usuario, layout: false });
}

notasCtrl.editarNotaForm = async (req, res) => {
    const nota = await Nota.findById(req.params.id).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();

    if (nota.usuario != req.user.id) {
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    res.render('notas/editar-nota', { nota, datos_usuario, layout: false });
}

notasCtrl.actualizarNota = async (req, res) => {
    const { titulo, descripcion } = req.body;
    await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion }).lean();
    req.flash('mensaje_correcto', 'Nota editada de forma correcta');
    res.redirect('/notas');
}

notasCtrl.borrarNota = async (req, res) => {
    const nota = await Nota.findById(req.params.id).lean();
    if (nota.usuario != req.user.id) {
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    await Nota.findByIdAndDelete(req.params.id);
    req.flash('mensaje_correcto', 'Nota eliminada de forma correcta');
    res.redirect('/notas');
}

module.exports = notasCtrl;