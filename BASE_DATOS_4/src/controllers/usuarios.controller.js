const usuariosCtrl = {};
const async = require('hbs/lib/async');
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

usuariosCtrl.inicioSesion = (req, res) => {
    res.send('inicio sesion')
}

usuariosCtrl.salir = (req, res) => {
    res.send('sesion cerrada')
}

module.exports = usuariosCtrl;