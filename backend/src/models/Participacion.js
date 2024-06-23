const { Schema, model, Types } = require('mongoose');

const participacionSchema = new Schema({
  participante: { type: Types.ObjectId, ref: 'Usuario', required: true },
  sesion: { type: Types.ObjectId, ref: 'Sesion', required: true },
  fecha: { type: Date, required: true },
  comentario: { type: String, required: true },
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Participacion', participacionSchema);