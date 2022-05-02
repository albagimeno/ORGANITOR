const router = require('express').Router()
const User = require('../models/user')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const schemaRegister = Joi.object({
    nombre: Joi.string().min(3).max(255).required(),
    apellidos: Joi.string().min(3).max(255).required(),
    id_usuario: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

// Esquema del login
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

// LOGIN
router.post('/login', async (req, res) => {
    // Validaciones de login
    const { error } = schemaLogin.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    // Validaciond e existencia
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' })

    // Validacion de password en la base de datos
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).json({ error: 'Constraseña invalida' })

    // Creando token
    const token = jwt.sign({
        nombre: user.nombre,
        id: user._id
    }, process.env.TOKEN_SECRET)

    // Colocando el token en el header y el cuerpo de la respuesta
    // res.header('auth-token', token).json
    // ({
    //     error: null,
    //     data: { token },
    //     message: 'Bienvenido'
    // })
    res.header('auth-token', token).redirect(`./perfil_usuario/index.html?id=${user._id}`)
    
})


// REGISTER
router.post('/register', async (req, res) => {

    const { error } = schemaRegister.validate(req.body)

    if (error) {
        return res.status(400).json(
            { error: error.details[0].message }
        )
    }

    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist) {
        return res.status(400).json(
            { error: 'Email ya registrado' }
        )
    }

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        id_usuario: req.body.id_usuario,
        email: req.body.email,
        password: password
    });
    try {
        const savedUser = await user.save()
            // res.json({
            //     error: null,
            //     data: savedUser
            // })
            res.redirect('./inicio_sesion.html');
            //res.app.use(express.static(path.join(__dirname, './inicio_sesion.html')));
        } catch (error) {
            res.status(400).json({ error })
        
    }
    
    
})

module.exports = router