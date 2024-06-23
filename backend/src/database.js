//cadena de conexion del sv a la bd
const mongoose = require('mongoose')

//cadena de conexion
const URI = process.env.MONGODB_URI
            ? process.env.MONGODB_URI
            //(if) si no se encuentra esta variable{
            : 'mongodb+srv://piepo:O6D2moQDl2ULeW0z@clusterarqui.kffpatr.mongodb.net/dbArquiSoft'
            //usa esta}
            //# para esto necesitamos ejecutar mongodb compass y mongod en 
            //C:\Program Files\MongoDB\Server\7.0\bin 
            
mongoose.connect(URI) 
//conectamos mongo a URI 

const connection = mongoose.connection; 
//variable que simbolice conexion a la bd

connection.once('open', ()=>{

    console.log('BASE DE DATOS -: ', URI);
}) 
//una vez que se establece la concexion, se nos hace saber a traves del msj