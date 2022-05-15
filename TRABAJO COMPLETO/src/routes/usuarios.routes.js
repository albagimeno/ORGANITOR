const { Router } = require('express');
const router = Router();

const {
    mostrarFormRegistro,
    registro,
    mostrarFormIncSesion,
    inicioSesion,
    mostrarDashboard,
    salir
} = require('../controllers/usuarios.controller')

const { autenticado } = require('../helpers/autorizacion')

router.get('/registro', mostrarFormRegistro);
router.post('/registro', registro);
router.get('/inicio_sesion', mostrarFormIncSesion);
router.post('/inicio_sesion', inicioSesion);
router.get('/dashboard', autenticado, mostrarDashboard);
router.get('/salir', autenticado, salir)






module.exports = router;