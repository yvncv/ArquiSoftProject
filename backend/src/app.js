//configuración del servidor
const express = require('express')
const cors = require('cors') //permite hacer peticiones dsd un sv distinto al del backend
const app = express();

//configuracion: hacemos que app guarde una variable (port), el puerto del sv
app.set('port', process.env.PORT || 8080)

//middlewares (logica que el codigo ejecuta antes de peticiones de las rutas)
app.use(cors(
    {
        origin: 'http://localhost:3000', // Cambia este a tu origen front-end
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true // Permitir el envío de cookies y encabezados HTTP en las solicitudes
    }
))
app.use(express.json())

//rutas (url)
app.get('/', (req, res)=>{
    res.send('Bienvenidos a nuestra API rest');
})

module.exports = app;