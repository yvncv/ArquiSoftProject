const { Schema, model, Types } = require('mongoose');

const sesionSchema = new Schema({
  tema: { type: String, required: true },
  fecha: { type: Date, required: false },

  participantes: [{ 
    participante: { type: Types.ObjectId, ref:  'Usuario' },
    asistencia: { 
      estado: { type: Types.ObjectId },
      hora: { type: Types.DateTime, required: false }
    },
    participacion: {
      comentario: { type: String },
      fecha: { type: Types.DateTime, required: false }  
    }
  }],

}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Sesion', sesionSchema);