const notasCtrl = {};
const async = require('hbs/lib/async');
const Nota = require('../models/Notas');


notasCtrl.mostrarNotaForm = (req, res) => {
    res.render('notas/nota-nueva', { layout: false });
}

notasCtrl.crearNota = async (req, res) => {
    // console.table(req.body)
    const { titulo, descripcion } = req.body;
    const nuevaNota = new Nota({ titulo, descripcion });
    await nuevaNota.save();
    res.send('nota nueva')
}

notasCtrl.mostrarTodasNotas = async (req, res) => {
    const notas = await Nota.find().lean();;
    res.render('notas/mostrar-notas', { notas, layout: false });
}

notasCtrl.editarNotaForm = (req, res) => {
    res.send('formulario nota');
}

notasCtrl.actualizarNota = (req, res) => {
    res.send('editar notas');
}

notasCtrl.borrarNota = (req, res) => {
    res.send('borrar notas');
}

module.exports = notasCtrl;