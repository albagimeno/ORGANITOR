
var express = require("express");
var exphbs = require('express-handlebars');
const path = require('path');


// Inicializaciones
const app = express();

// Ajustes
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    //defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
//app.set('view options', { layout: 'index' });

// Middlewares

// Variables globales
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.render('index', {layout:false});
});

// Ficheros estáticos


module.exports = app;