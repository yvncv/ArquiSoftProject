const { Schema, model, Types } = require('mongoose');

const asistenciaSchema = new Schema({
  participante: { type: Types.ObjectId, ref: 'Usuario', required: true },
  sesion: { type: Types.ObjectId, ref: 'Sesion', required: true },
  fecha: { type: Date, required: true },
  estado: { type: String, enum: ['Presente', 'Ausente', 'Tarde', 'Justificado'], required: true },
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Asistencia', asistenciaSchema);