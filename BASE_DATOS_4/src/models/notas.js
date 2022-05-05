const {Schema, model} = require('mongoose');
const NotaSchema = new Schema ({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

model('Nota', NotaSchema);
