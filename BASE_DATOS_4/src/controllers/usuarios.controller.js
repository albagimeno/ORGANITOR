const usuariosCtrl = {};
const async = require('hbs/lib/async');

const passport = require('passport');
const { authenticate } = require('passport/lib');

const Usuario = require('../models/Usuario')


usuariosCtrl.mostrarFormRegistro = (req, res) => {
    res.render('usuarios/registro')
}

usuariosCtrl.registro = async (req, res) => {
    const errores = [];
    const { nombre, apellidos, id_usuario, email, password, confirmar_password } = req.body
    if (password != confirmar_password) {
        errores.push({ text: 'Las contraseñas no coinciden.' });
    }
    if (password.length < 6) {
        errores.push({ text: 'La contraseña debe tener al menos 6 caracteres.' });
    }
    if (errores.length > 0) {
        res.render('usuarios/registro', {
            errores,
            nombre,
            apellidos,
            id_usuario,
            email
        })
    }
    else {
        const emailUsuario = await Usuario.findOne({ email: email });
        if (emailUsuario) {
            req.flash('mensaje_error', 'El email indicado ya está en uso.');
            // res.redirect('/registro')
            res.render('usuarios/registro', {
                errores,
                nombre,
                apellidos,
                id_usuario,
                email
            })
        } else {
            const nuevoUsuario = new Usuario({ nombre, apellidos, id_usuario, email, password });
            nuevoUsuario.password = await nuevoUsuario.encriptarPassword(password);
            await nuevoUsuario.save();
            req.flash('mensaje_correcto', 'Usuario creado de forma correcta.');
            res.redirect('/inicio_sesion')
        }
    }

}

usuariosCtrl.mostrarFormIncSesion = (req, res) => {
    res.render('usuarios/inicio_sesion')
}

usuariosCtrl.inicioSesion = passport.authenticate('local', {
    failureRedirect: '/registro',
    successRedirect: '/dashboard',
    failureFlash: true
});

usuariosCtrl.mostrarDashboard = async(req, res) => {
    console.log(req.user.id)
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    res.render('usuarios/index', {datos_usuario, layout:false})
}

usuariosCtrl.salir = (req, res) => {
    req.logout();
    req.flash('mensaje_correcto', 'Tu sesión ha sido cerrada.');
    res.redirect('/inicio_sesion');
}


// const datos_usuario = Usuario.find({id: req.user.id}).lean()
module.exports = usuariosCtrl;