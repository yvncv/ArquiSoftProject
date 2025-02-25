//archivo de anclaje, lectura de app.js
require('dotenv').config() 
//permite acceso a la cadena de conexion de la bd (variable de entorno)

const app = require('./app') 
//leemos el archivo app
require('./database')

//logica para ejecutar el servidor
async function main(){ 
    //funcion asincrona 
    await app.listen(app.get('port')) 
    //esperamos la señal (port)
    console.log('PUERTO -: ', app.get('port')); 
    //mensaje cuando se reciba la señal
}

//ruta para nuestra api de usuarios
app.use('/api/usuarios', require('./routes/usuarios'));

//ruta para nuestra api de cursos
app.use('/api/cursos', require('./routes/cursos'));

//ruta para nuestra api de sesiones
app.use('/api/sesiones', require('./routes/sesiones'));

app.use('/api/semanas', require('./routes/semanas'));

main(); 
//ejecutamos la funcion asincrona de arriba 