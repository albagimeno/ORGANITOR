const usuariosCtrl = {};
const async = require('hbs/lib/async');

const passport = require('passport');
const { authenticate } = require('passport/lib');

const Usuario = require('../models/Usuario')


usuariosCtrl.mostrarFormRegistro = (req, res) => {
    res.render('usuarios/registro')
}

usuariosCtrl.registro = async (req, res) => {
    const numeros = /(?=.*?[0-9])/;
    const letras_min = /(?=.*?[a-z])/;
    const letras_mayus = /(?=.*?[A-Z])/;
    const caracteres_esp = /(?=.*?[#?!@$%^&*-_:;/()=?¿º])/;
    const errores = [];
    const { nombre, apellidos, id_usuario, email, password, confirmar_password } = req.body
    //contraseñas coinciden
    if (password != confirmar_password) {
        errores.push({ text: 'Las contraseñas no coinciden.' });
    }
    //contraseña con más de 6 caractéres
    if (password.length < 6) {
        errores.push({ text: 'La contraseña debe tener al menos 6 carácteres.' });
    }
    //contraseña contiene números
    if (password.search(numeros)){
        errores.push({text: 'La contraseña debe cotener mínimo un número.'})
    }
    //contraseña contiene minúculas
    if (password.search(letras_min)){
        errores.push({text: 'La contraseña debe contener mínimo una minúscula.'})
    }
    //contraseña contiene mayúsculas
    if (password.search(letras_mayus)){
        errores.push({text: 'La contraseña debe contener mínimo una mayúscula.'})
    }
    //contraseña contiene caractéres especiales
    if (password.search(caracteres_esp)){
        errores.push({text: 'La contraseña debe contener mínimo un carácter especial.'})
    }
    if (errores.length > 0) {
        res.render('usuarios/registro', {
            errores,
            nombre,
            apellidos,
            id_usuario,
            email,
            password
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
                email,
                password
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