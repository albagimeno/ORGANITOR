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
        type: Number,
        required: false
    },
},
{
    timestamps: true
})

module.exports = model('Producto', ProductoSchema);
