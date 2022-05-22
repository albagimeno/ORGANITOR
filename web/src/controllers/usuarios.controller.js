const usuariosCtrl = {};
const async = require('hbs/lib/async');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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
    //comprobación de que todos los campos hayan sido rellenados
    if (nombre.length == 0 || apellidos.length == 0 || email.length == 0 || id_usuario.length == 0 ||
        password.length == 0 || confirmar_password.length == 0) {
        errores.push({ text: 'Todos los campos deben estar rellenados.' })
    }
    if (password.length != 0 || confirmar_password.length != 0) {
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
        const emailUsuario = await Usuario.findOne({ "email": email });
        const id_usuarioUsuario = await Usuario.findOne({ "id_usuario": id_usuario });
        if (emailUsuario) {
            errores.push({ text: 'El email indicado ya está en uso.' });
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
            errores.push({ text: 'El usuario indicado ya está en uso.' });
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
            const correctos = []
            const nuevoUsuario = new Usuario({ nombre, apellidos, id_usuario, email, password });
            nuevoUsuario.password = await nuevoUsuario.encriptarPassword(password);
            await nuevoUsuario.save();

            const tokenVerificacion = nuevoUsuario.generarTokenVerificacion(nuevoUsuario);
            const ruta = `https://organitor.es/verificar/${tokenVerificacion}`
            transporter.sendMail({
                from: '"Bienvenida a Organitor" <noreply@organitor.com>',
                to: email,
                subject: 'Verificación de cuenta',
                html: `
                <p>Queremos darle la bienvenida al proyecto de Alba e Ismael, esperamos que lo disfrute</p>
                <p>Pulse en <a href = '${ruta}'>aquí</a> para confirmar su cuenta.</p>
                <br>
                <p>Saludos</p>
                <p>Soporte de Organitor</p>`
            });
            correctos.push({ text: `Correo enviado a ${email}` });
            correctos.push({ text: 'Usuario creado de forma correcta, revise su correo electrónico para verificar su cuenta.' });
            res.render('usuarios/inicio_sesion', { correctos })

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
    badRequestMessage: 'Debe rellenar todos los campos',
    failureFlash: true,
});

/* Muestra el fichero /views/usuarios/index.hbs el cuál va mostrar el presupuesto de la 
lista de compra y la cantidad de notas de ese usuario */
usuariosCtrl.mostrarDashboard = async (req, res) => {
    const datos_usuario = await Usuario.findById(req.user.id).lean();
    const lista = await Producto.find({ usuario: req.user.id }).sort({ date: 'desc' }).lean();
    const notas = await Nota.find({ usuario: req.user.id }).sort({ createdAt: -1 }).lean();
    var suma = 0;
    for (var i in lista) {
        if ((lista[i].precio_unidad) === null) {
            suma += 0;
        } else {
            suma += parseFloat(lista[i].precio_unidad) * (lista[i].cantidad)
        }

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

// Configuración del correo, creación de la comunicación con el servidor de correo
const transporter = nodemailer.createTransport({
    host: "smtp.servidor-correo.net",
    port: "587",
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USUARIO_EMAIL, // your domain email address
        pass: process.env.PASSWORD_EMAIL // your password
    }
});

// Verifica que la conexión con el servidor de crreo es correcta
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Servidor de correos preparado");
    }
});

// Verifica la cuenta del usuario tras que éste acceda al enlace de su correo.
usuariosCtrl.verificarCuenta = async (req, res) => {
    if (!req.params.id) {
        req.flash('mensaje_error', 'Verificación no encontrada');
        res.redirect('/inicio_sesion');
    } else {

        const verificacion = jwt.verify(
            req.params.id,
            process.env.TOKEN_VERIFICACION_USUARIO
        );

        const usuario = await Usuario.findOne({ "_id": verificacion.ID });
        if (!usuario) {
            req.flash('mensaje_error', 'Usuario no encontrado.');
            res.redirect('/inicio_sesion');
        } else {
            usuario.verificado = true;
            await usuario.save();
            req.flash('mensaje_correcto', 'Usuario verificado de forma correcta');
            res.redirect('/inicio_sesion');
        }
    }
}

// Permite detectar si la ruta indicada existe.
usuariosCtrl.detectarError404 = (req, res) => {
    res.status(404).redirect('/404');
}
/* En caso de que la ruta no exista, redirige al usuario a
una página de error concreta. */
usuariosCtrl.mostrarError404 = (req, res) => {
    res.render('partials/error404')
}

module.exports = usuariosCtrl;