
const express = require("express");
const exphbs = require('express-handlebars');
const _handlebars = require('handlebars');
const path = require('path');
const morgan = require("morgan");
const methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// const cors = require('cors');

// Inicializaciones

const app = express();
require('./config/passport');

// Ajustes

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs.engine({
    //defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', 'hbs');

// Middlewares

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRETO,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// var corsOptions = {
//     origin: 'organitor.es', // Aqui debemos reemplazar el * por el dominio de nuestro front
//     optionsSuccessStatus: 200 // Es necesario para navegadores antiguos o algunos SmartTVs
// }
// app.use(cors(corsOptions));

// app.use(cors())

app.use(flash());

// Variables globales

app.use((req, res, next) => {
    res.locals.mensaje_correcto = req.flash('mensaje_correcto');
    res.locals.mensaje_error = req.flash('mensaje_error');
    res.locals.error = req.flash('error');
    res.locals.usuario = req.user || null;
    next();
});

// Ficheros estáticos

app.use(express.static(path.join(__dirname, 'public')));

// Rutas

app.use(require('./routes/index.routes'));
app.use(require('./routes/notas.routes'));
app.use(require('./routes/lista.routes'));
app.use(require('./routes/usuarios.routes'));

module.exports = app;