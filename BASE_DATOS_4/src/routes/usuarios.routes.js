const { Router } = require('express');
const router = Router();

const {
    mostrarFormRegistro,
    registro,
    mostrarFormIncSesion,
    inicioSesion,
    salir
} = require('../controllers/usuarios.controller')


router.get('/registro', mostrarFormRegistro);
router.post('/registro', registro);
router.get('/inicio_sesion', mostrarFormIncSesion);
router.post('/inicio_sesion', inicioSesion);
router.get('/salir', salir)






module.exports = router;