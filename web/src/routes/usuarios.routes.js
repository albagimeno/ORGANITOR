const { Router } = require('express');
const router = Router();

// Importacion de las funciones creadas en /controllers
const {
    mostrarFormRegistro,
    registro,
    mostrarFormIncSesion,
    inicioSesion,
    mostrarDashboard,
    salir,
    verificarCuenta,
    detectarError404,
    mostrarError404,
} = require('../controllers/usuarios.controller')

/*LLamada al fichero que contiene la función que permite saber si un usuario
está autenticado o no*/ 

const { autenticado } = require('../helpers/autorizacion')

// Creación de las rutas y la función que tienen asociada

// Muestra el formulario de registro
router.get('/registro', mostrarFormRegistro);
// Procesa el formulario de registro
router.post('/registro', registro);
// Muestra el formulario de inicio de sesión
router.get('/inicio_sesion', mostrarFormIncSesion);
// Procesa el formulario de inicio de sesión
router.post('/inicio_sesion', inicioSesion);
/* Muestra la página principal para cada usuario, para ello tiene que
estar autenticado */  
router.get('/dashboard', autenticado, mostrarDashboard);
// Permite cerrar la sesión, el usuario tiene que estar autenticado
router.get('/salir', autenticado, salir)
// Muestra la pagina de verificación
router.get('/verificar/:id', verificarCuenta)

router.get('/404', mostrarError404)
router.get('/*', detectarError404)

module.exports = router;