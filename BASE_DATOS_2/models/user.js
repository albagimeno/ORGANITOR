const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        min: 3,
        max: 255
    },
    apellidos: {
        type: String,
        require: true,
        min: 3,
        max: 255
    },
    id_usuario: {
        type: String,
        require: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)