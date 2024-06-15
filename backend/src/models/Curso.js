const {Schema, model} = require('mongoose')
const Usuario = require('../models/Usuario')

const usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    codigo: { type: String, required: true },
    grado: { type: String, required: true },
    carrera: { type: String, required: true },
    facultad: { type: String, required: true },
    semestre: { type: String, required: true },
    sesiones: [{ type: String, required: true }],
    participantes: [{ type: String, required: true }],
    // nombre, codigo, grado, carrera, facultad, seestre, sesiones, participantes
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = model('Curso', cursoSchema)