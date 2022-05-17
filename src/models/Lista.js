const { Schema, model } = require('mongoose');
const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio_unidad: {
        type: Number,
        required: false
    },
    usuario: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

module.exports = model('Producto', ProductoSchema);
