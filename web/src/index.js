require('dotenv').config();
const express = require('express')
const portainer = express()

const app = require('./server');
require('./database');


app.listen(app.get('port'), () => {
     console.log('Servidor en el puerto', app.get('port'))
})


// portainer.get('/', (req, res) => res.send('Hello World!'))
portainer.listen(process.env.PORT_PORTAINER, () => console.log(`Portainer escuchando en el puerto ${process.env.PORT_PORTAINER}`))
