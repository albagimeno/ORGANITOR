const usuariosCtrl = {};
const async = require('hbs/lib/async');

// Llamada a la configuración del fichero /config/passport.js
const passport = require('passport');
const { authenticate } = require('passport/lib');

// Llamada al modelo de usuario
const Usuario = require('../models/Usuario');
// Llamada al modelo de producto
const Producto = require('../models/Lista');
// Llamada al modelo de nota
const Nota = require('../models/Notas');

// Muestra el fichero /views/usuarios/registro.hbs
usuariosCtrl.mostrarFormRegistro = (req, res) => {
    res.render('usuarios/registro')
}

/* Procesa los datos recogidos en el registro, verifica la seguridad de la contraseña
Comprueba que el email y el ID de usuario no esté en uso.
Si el correo y ID no existe, crea el usuario y lo guarda en la base de datos 
a la vez que encripta la contraseña.
 */
usuariosCtrl.registro = async (req, res) => {
    const numeros = /(?=.*?[0-9])/;
    const letras_min = /(?=.*?[a-z])/;
    const letras_mayus = /(?=.*?[A-Z])/;
    const caracteres_esp = /(?=.*?[#?!@$%^&*=])/;
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
    if (password.search(numeros)) {
        errores.push({ text: 'La contraseña debe cotener mínimo un número.' })
    }
    //contraseña contiene minúculas
    if (password.search(letras_min)) {
        errores.push({ text: 'La contraseña debe contener mínimo una minúscula.' })
    }
    //contraseña contiene mayúsculas
    if (password.search(letras_mayus)) {
        errores.push({ text: 'La contraseña debe contener mínimo una mayúscula.' })
    }
    //contraseña contiene caractéres especiales
    if (password.search(caracteres_esp)) {
        errores.push({ text: 'La contraseña debe contener mínimo un carácter especial.' })
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
        const emailUsuario = await Usuario.find({ "email": email });
        const id_usuarioUsuario = await Usuario.findOne({ id_usuario: id_usuario });
        if (emailUsuario) {
            errores.push({text: 'El email indicado ya está en uso.'});
            res.render('usuarios/registro', {
                errores,
                nombre,
                apellidos,
                id_usuario,
                email,
                password,
                confirmar_password
            })
        }
        if (id_usuarioUsuario) {
            errores.push({text: 'El usuario indicado ya está en uso.'});
            res.render('usuarios/registro', {
                errores,
                nombre,
                apellidos,
                id_usuario,
                email,
                password,
                confirmar_password
            })
        } 
        else {
            const nuevoUsuario = new Usuario({ nombre, apellidos, id_usuario, email, password });
            nuevoUsuario.password = await nuevoUsuario.encriptarPassword(password);
            await nuevoUsuario.save();
            req.flash('mensaje_correcto', 'Usuario creado de forma correcta.');
            res.redirect('/inicio_sesion')
        }
    }

}

// Muestra el fichero /views/usuarios/inicio_sesion.hbs
usuariosCtrl.mostrarFormIncSesion = (req, res) => {
    res.render('usuarios/inicio_sesion')
}

/* Hace uso del módulo passport.
Lleva  acabo la comprobación configurada en /config/passport.js,
si los datos coinciden con la base de datos,
redirige a la ruta /dashboard, si falla redirige la ruta /registro */ 
usuariosCtrl.inicioSesion = passport.authenticate('local', {
    failureRedirect: '/inicio_sesion',
    successRedirect: '/dashboard',
    failureFlash: true
});

/* Muestra el fichero /views/usuarios/index.hbs el cuál va mostrar el presupuesto de la 
lista de compra y la cantidad de notas de ese usuario */
usuariosCtrl.mostrarDashboard = async (req, res) => {
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    const lista = await Producto.find({ usuario: req.user.id }).sort({ date: 'desc' }).lean();
    const notas = await Nota.find({ usuario: req.user.id }).sort({ createdAt: -1 }).lean();
    var suma = 0;
    for (var i in lista) {
        suma += parseFloat(lista[i].precio_unidad) * (lista[i].cantidad)
    }
    var cant_notas = 0;
    for (var j in notas) {
        cant_notas += 1;
    }
    res.render('usuarios/index', { datos_usuario, suma, cant_notas, layout: false })
}

// Permite al usuario cerrar la sesión y redirije a /inicio_sesion
usuariosCtrl.salir = (req, res) => {
    req.logout();
    req.flash('mensaje_correcto', 'Tu sesión ha sido cerrada.');
    res.redirect('/inicio_sesion');
}

module.exports = usuariosCtrl;