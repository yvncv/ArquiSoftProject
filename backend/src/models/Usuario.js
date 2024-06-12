const {Schema, model} = require('mongoose')

const usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    carrera: { type: String, required: true },
    ciclo: { type: String, required: true },
    codigo: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true}
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = model('Usuario', usuarioSchema)