const notasCtrl = {};
const async = require('hbs/lib/async');
const Nota = require('../models/Notas');
const passport = require('passport')

notasCtrl.mostrarNotaForm = (req, res) => {
    //console.log(req.user)
    res.render('notas/nota-nueva', { layout: false });
}

notasCtrl.crearNota = async (req, res) => {
    // console.table(req.body)
    const { titulo, descripcion } = req.body;
    const nuevaNota = new Nota({ titulo, descripcion });
    nuevaNota.usuario = req.user.id;
    await nuevaNota.save();
    req.flash('mensaje_correcto', 'Nota añadida de forma correcta');
    res.redirect('/notas')
}

notasCtrl.mostrarTodasNotas = async (req, res) => {
    const notas = await Nota.find({usuario: req.user.id}).sort({date: 'desc'}).lean();
    res.render('notas/mostrar-notas', { notas, layout: false });
}

notasCtrl.editarNotaForm = async (req, res) => {
    const nota = await Nota.findById(req.params.id).lean();
    if (nota.usuario != req.user.id){
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    res.render('notas/editar-nota', { nota, layout: false });
}

notasCtrl.actualizarNota = async (req, res) => {
    const { titulo, descripcion } = req.body;
    await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion}).lean();
    req.flash('mensaje_correcto', 'Nota editada de forma correcta');
    res.redirect('/notas');
}

notasCtrl.borrarNota = async (req, res) => {
    if (nota.usuario != req.user.id){
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    await Nota.findByIdAndDelete(req.params.id);
    req.flash('mensaje_correcto', 'Nota eliminada de forma correcta');
    res.redirect('/notas');
}

module.exports = notasCtrl;