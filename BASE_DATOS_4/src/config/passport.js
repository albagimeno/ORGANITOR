const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario')


passport.use(new LocalStrategy({
    usuarioCampo: 'email',
    passwordCampo: 'password'
}, async (email, password, done) => {

    //confirmar existencia de email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        return done(null, false, { message: 'Usuario no encontrado' });
    } else {
        //Confirmar que la contraseña coincide
        const coincide = await usuario.coincidePassword(password);
        if (coincide) {
            return done(null, usuario);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' })
        }
    }
}));