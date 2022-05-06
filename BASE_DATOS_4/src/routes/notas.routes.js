const { Router } = require('express')
const router = Router()

const { mostrarNotaForm,
    crearNota, 
    mostrarTodasNotas, 
    editarNotaForm, 
    actualizarNota, 
    borrarNota
} = require('../controllers/notas.controller');

// Nueva nota
router.get('/notas/add', mostrarNotaForm)

router.post('/notas/nota-nueva', crearNota)

// Obtener todas las notas
router.get('/notas', mostrarTodasNotas)

// Editar notas
router.get('/notas/editar/:id', editarNotaForm)

router.put('/notas/editar/:id', actualizarNota)

// Borrar notas
router.delete('/notas/editar/:id', borrarNota)




module.exports = router 