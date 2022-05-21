const notasCtrl = {};
const async = require('hbs/lib/async');
// Llamada al modelo de nota
const Nota = require('../models/Notas');
// Llamada al modelo de usuario
const Usuario = require('../models/Usuario')


// Muestra el fichero /views/notas/nota-nueva.hbs
notasCtrl.mostrarNotaForm = async (req, res) => {
    //console.log(req.user)
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('notas/nota-nueva', { datos_usuario, layout: false });
}

/* Procesa los datos recogidos en el formulario de creación de la nota, 
Verifica que ambos campos están rellenos y procesa los errores.
Si no hay errores guarda la nota en la base de datos con el id del usuario
que está autenticado en dicha sesión.
Después de la creación de la nota redirige a la ruta /notas
 */

notasCtrl.crearNota = async (req, res) => {
    // console.table(req.body)
    const errores = [];
    const { titulo, descripcion } = req.body;
    if (titulo.length == 0) {
        errores.push({ text: 'El campo de "Título" tiene que estar relleno' });
    }
    if (descripcion.length == 0) {
        errores.push({ text: 'El campo de "Descripción" tiene que estar relleno' });
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

/* Muestra el fichero /views/notas/mostrar-notas.hbs, el cual va solicitar a 
la base de datos todas las notas que coincidan con el id del usuario que está
autenticado en la sesión. */
notasCtrl.mostrarTodasNotas = async (req, res) => {
    const notas = await Nota.find({ usuario: req.user.id }).sort({
        createdAt: -1
    }).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('notas/mostrar-notas', { notas, datos_usuario, layout: false });
}

/* Busca en la base de datos la nota con el id que recoge de la URL,
Comprueba que el id del usuario de dicha nota coincide con el id del usuario de la sesión,
si coincide muestra el fichero /views/notas/editar-nota.hbs con los datos 
de esa nota en concreto */
notasCtrl.editarNotaForm = async (req, res) => {
    const nota = await Nota.findById(req.params.id).lean();
    const datos_usuario = await Usuario.findById(req.user.id).lean();

    if (nota.usuario != req.user.id) {
        req.flash('mensaje_error', 'No autorizado.')
        return res.redirect('/notas')
    }
    res.render('notas/editar-nota', { nota, datos_usuario, layout: false });
}

/* Procesa los datos recogidos en el formulario de edición de la nota, 
entonces la nota se actualiza la base de datos solo en los campos rellenados
en el formulario.
Después de la edición de la nota redirige a la ruta /notas */
notasCtrl.actualizarNota = async (req, res) => {
    const { titulo, descripcion } = req.body;
    await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion }).lean();
    req.flash('mensaje_correcto', 'Nota editada de forma correcta');
    res.redirect('/notas');
}

/* Busca en la base de datos la nota con el id que recoge de la URL,
si el id del usuario de esa nota coincide con el id del usuario que ha iniciado 
la sesión la nota se borra de la base de datos.
Una vez borrada redirige a la ruta /notas */

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