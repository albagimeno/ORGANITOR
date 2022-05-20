const passport = require('passport');
const { serializeUser } = require('passport/lib');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario')

/* Passport nos va a permitir asignar un campo de verificación para el email y otro 
para la contraseña que recoja en el formulario de inicio de sesión. Una vez recogidos esos 
campos los busca en la base de datos, si no coinciden devolverá un error */
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    if (email.length == 0 || password.length == 0) {
        return done(null, false, { message: 'Debe rellenar todos los campos' });
    }
    //confirmar existencia de email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        return done(null, false, { message: 'Usuario  o contraseña incorrectos.' });
    } else {
        if (!usuario.verificado) {
            return done(null, false, { message: 'Debe verificar su cuenta primero.' });
        } else {
            //Confirmar que la contraseña coincide
            const coincide = await usuario.coincidePassword(password);
            if (coincide) {
                return done(null, usuario);
            } else {
                return done(null, false, { message: 'Usuario  o contraseña incorrectos.' })
            }
        }

    }
}));

// Si damos el usuario obtenemos el id
passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
});

// Si damos el id del usuario obtenemos todos los datos del mismo
passport.deserializeUser((_id, done) => {
    Usuario.findById(_id, (err, usuario) => {
        done(err, usuario);
    });
});