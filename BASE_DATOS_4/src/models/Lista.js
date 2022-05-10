const {Schema, model} = require('mongoose');
const ProductoSchema = new Schema ({
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: String,
        required: true
    },
precio_unidad: {
        type: String,
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
