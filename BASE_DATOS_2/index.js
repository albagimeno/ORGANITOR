const express = require('express')
const authRoutes = require('./routes/auth.js')
const mongoose = require('mongoose')
const dashboardRoutes = require('./routes/dashboard')
const verifyToken = require('./routes/validate-token')
const cors = require('cors')
const path = require('path');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.k0cqw.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
//const uri = `mongodb://0.0.0.0:27017/proyecto_final`
mongoose
  .connect(uri,
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }
  )
  .then(() => {
    console.log('Conectado a la base de datos')
  })
  .catch((e) => {
    console.log('Database error', e)
  })

var corsOptions = {
  origin: '*', // Aqui debemos reemplazar el * por el dominio del cliente
  optionsSuccessStatus: 200 // Es necesario para navegadores antiguos o algunos SmartTVs
}

const app = express()

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/api/user', authRoutes)
app.use('', authRoutes)
//app.use('/api/dashboard', verifyToken, dashboardRoutes)
app.use(express.static(path.join(__dirname, './public')));


app.get('/', (req, res) => {
  res.json({ mensaje: 'My Auth Api Rest' })
})

const PORT = process.env.PORT || 8002
app.listen(PORT, () => {
  console.log(`Tu servidor está corriendo en el puerto: ${PORT}`)
})
