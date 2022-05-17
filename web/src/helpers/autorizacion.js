const helpers = {};

/* Verifica que usuario esté autenticado en la ruta a la cual
se ha asignado esta función, en caso de no estarlo redirige al usuario a
la página de inicio de sesión */ 
helpers.autenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('mensaje_error', 'Debe iniciar sesión para acceder.')
    res.redirect('/inicio_sesion');
}

module.exports = helpers;