const { Schema, model, Types } = require('mongoose');

const cursoSchema = new Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  grado: { type: String, required: true },
  carrera: { type: String, required: true },
  facultad: { type: String, required: true },
  semestre: { type: Number, required: true, min: 1, max: 10 },
  sesiones: [
    {
      dia: { type: String, required: true },
      hora: { type: String, required: true } // 'HH:mm'
    }
  ],
  participantes: [{ type: Types.ObjectId, ref: 'Usuario', required: true }], // Referencia a Usuario
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Curso', cursoSchema);