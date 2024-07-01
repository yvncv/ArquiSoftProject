const { Schema, model, Types } = require('mongoose');

const sesionSchema = new Schema({
  tema: { type: String, required: true },
  fecha: { type: Date, required: false },

  participantes: [{ 
    participante: { type: Types.ObjectId, ref:  'Usuario' },
    asistencia: { 
      estado: { type: Types.ObjectId },
      hora: { type: Date, required: false }
    },
    participacion: {
      comentario: { type: String },
      fecha: { type: Date, required: false }  
    }
  }],

}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Sesion', sesionSchema);