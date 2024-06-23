const { Schema, model, Types } = require('mongoose');

const cursoSchema = new Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  grado: { type: String, required: true },
  carrera: { type: String, required: true },
  facultad: { type: String, required: true },
  semestre: { type: Number, required: true, min: 1, max: 10 },
  sesiones: [{ type: Types.ObjectId, ref: 'Sesion' }],
  participantes: [{ type: Types.ObjectId, ref: 'Usuario' }],
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Curso', cursoSchema);