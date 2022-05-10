const { Router } = require('express')
const router = Router()

const { mostrarLista,
    crearProducto, 
    editarProductoForm, 
    actualizarProducto, 
    borrarProducto
} = require('../controllers/lista.controller');

// Mostrar lista
router.get('/lista', mostrarLista)

// Crear producto
router.post('/lista', crearProducto)


// Editar producto
router.get('/lista/editar/:id', editarProductoForm)

router.put('/notas/editar/:id', actualizarProducto)

// Borrar notas
router.delete('/lista/eliminar/:id', borrarProducto)


module.exports = router 