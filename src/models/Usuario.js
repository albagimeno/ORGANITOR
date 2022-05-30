const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    id_usuario: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificado: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

/* Encripta la contraseña de la base de datos */ 
UsuarioSchema.methods.encriptarPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/* Comprueba que la contraseña que se pasa por parámetro
coindice que con la de la base de datos */
UsuarioSchema.methods.coincidePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

/* Permite crear un token cifrado con una frase secreta 
y el id del usuario, de esta forma se crea un token único.*/
UsuarioSchema.methods.generarTokenVerificacion =  usuario => {
    const tokenVerificacion = jwt.sign(
        { ID: usuario._id },
        process.env.TOKEN_VERIFICACION_USUARIO,
        { expiresIn: "7d" }
    )
    return tokenVerificacion;
};

module.exports = model('Usuario', UsuarioSchema);
