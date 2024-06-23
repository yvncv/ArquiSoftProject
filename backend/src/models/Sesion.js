const { Schema, model, Types } = require('mongoose');

const sesionSchema = new Schema({
  codigo: { type: String, required: true, unique: true },
  tema: { type: String, required: true },
  fecha: { type: Date, required: true },
  participaciones: [{ type: Types.ObjectId, ref: 'Participacion' }],
  asistencia: [{ type: Types.ObjectId, ref: 'Asistencia' }],
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Sesion', sesionSchema);