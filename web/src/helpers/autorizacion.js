const helpers = {};
helpers.autenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('mensaje_error', 'Debe iniciar sesión para acceder.')
    res.redirect('/inicio_sesion');
}

module.exports = helpers;