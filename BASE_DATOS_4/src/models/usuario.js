const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    id_usuario: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

UsuarioSchema.methods.encrypPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UsuarioSchema.methods.matchPassword = function (password) {
    return await bcrypt.compare(password, this.password);
}


    module.exports = model('Usuario', UsuarioSchema);
