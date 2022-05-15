const { Router } = require('express')
const router = Router()

const { mostrarNotaForm,
    crearNota,
    mostrarTodasNotas,
    editarNotaForm,
    actualizarNota,
    borrarNota
} = require('../controllers/notas.controller');

const { autenticado } = require('../helpers/autorizacion')

// Nueva nota
router.get('/notas/nota-nueva', autenticado, mostrarNotaForm)

router.post('/notas/nota-nueva', autenticado, crearNota)

// Obtener todas las notas
router.get('/notas', autenticado, mostrarTodasNotas)

// Editar notas
router.get('/notas/editar/:id', autenticado, editarNotaForm)

router.put('/notas/editar/:id', autenticado, actualizarNota)

// Borrar notas
router.delete('/notas/eliminar/:id', autenticado, borrarNota)




module.exports = router 