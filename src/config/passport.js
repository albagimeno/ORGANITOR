const passport = require('passport');
const { serializeUser } = require('passport/lib');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario')


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {

    //confirmar existencia de email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        return done(null, false, { message: 'Usuario  o contraseña incorrectos.' });
    } else {
        //Confirmar que la contraseña coincide
        const coincide = await usuario.coincidePassword(password);
        if (coincide) {
            return done(null, usuario);
        } else {
            return done(null, false, { message: 'Usuario  o contraseña incorrectos.' })
        }
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
});

passport.deserializeUser((_id, done) => {
    Usuario.findById(_id, (err, usuario) => {
        done(err, usuario);
    });
});