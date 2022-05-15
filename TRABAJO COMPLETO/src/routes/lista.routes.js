const { Router } = require('express')
const router = Router()

const { mostrarLista,
    crearProducto,
    editarProductoForm,
    actualizarProducto,
    borrarProducto
} = require('../controllers/lista.controller');
const { autenticado } = require('../helpers/autorizacion');

// Mostrar lista
router.get('/lista', autenticado, mostrarLista)

// Crear producto
router.post('/producto-nuevo', autenticado, crearProducto)


// Editar producto
router.get('/lista/editar/:id', autenticado, editarProductoForm)

router.put('/lista/editar/:id', autenticado, actualizarProducto)

// Borrar producto
router.delete('/lista/eliminar/:id', autenticado, borrarProducto)


module.exports = router 