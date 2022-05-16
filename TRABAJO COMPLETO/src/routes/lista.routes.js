const { Router } = require('express')
const router = Router()

//Importacion de las funciones creadas en /controllers
const { mostrarLista,
    crearProducto,
    editarProductoForm,
    actualizarProducto,
    borrarProducto
} = require('../controllers/lista.controller');

/*LLamada al fichero que contiene la función que permite saber si un usuario
está autenticado o no*/ 
const { autenticado } = require('../helpers/autorizacion');

// Creación de las rutas y la función que tienen asociada.

/* Muestra la lista de productos creados por el usuario, para ello tiene que
estar autenticado, también muestra el formulario de creación de producto*/
router.get('/lista', autenticado, mostrarLista)
/* Procesa el formulario para crear un producto, para ello tiene que
estar autenticado */ 
router.post('/producto-nuevo', autenticado, crearProducto)
/* Muestra el formulario para editar un producto concreto, para ello tiene que
estar autenticado */
router.get('/lista/editar/:id', autenticado, editarProductoForm)
/* Procesa el formulario para editar un producto concreto, para ello tiene que
estar autenticado */ 
router.put('/lista/editar/:id', autenticado, actualizarProducto)
/* Elimina un producto concreto, para ello tiene que
estar autenticado */ 
router.delete('/lista/eliminar/:id', autenticado, borrarProducto)

module.exports = router 