const { Router } = require('express')
const router = Router()

//Importacion de las funciones creadas en /controllers
const { mostrarNotaForm,
    crearNota,
    mostrarTodasNotas,
    editarNotaForm,
    actualizarNota,
    borrarNota
} = require('../controllers/notas.controller');

/*LLamada al fichero que contiene la función que permite saber si un usuario
está autenticado o no*/ 
const { autenticado } = require('../helpers/autorizacion')

// Creación de las rutas y la función que tienen asociada.

/* Muestra el formulario para crear una nota, para ello tiene que
estar autenticado */ 
router.get('/notas/nota-nueva', autenticado, mostrarNotaForm)
/* Procesa el formulario para crear una nota, para ello tiene que
estar autenticado */ 
router.post('/notas/nota-nueva', autenticado, crearNota)
/* Muestra las notas creadas por el usuario, para ello tiene que
estar autenticado */ 
router.get('/notas', autenticado, mostrarTodasNotas)
/* Muestra el formulario para editar una nota concreta, para ello tiene que
estar autenticado */ 
router.get('/notas/editar/:id', autenticado, editarNotaForm)
/* Procesa el formulario para editar una nota concreta, para ello tiene que
estar autenticado */ 
router.put('/notas/editar/:id', autenticado, actualizarNota)
/* Elimina una nota concreta, para ello tiene que
estar autenticado */ 
router.delete('/notas/eliminar/:id', autenticado, borrarNota)

module.exports = router 