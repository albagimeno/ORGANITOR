const { Router } = require('express')
const router = Router();

// Importacion de las funciones creadas en /controllers
const { mostrarIndex } = require('../controllers/index.controller');

// Creación de las rutas y la función que tienen asociada.

// Muestra la página de presentación de la web
router.get('/', mostrarIndex);

module.exports = router;