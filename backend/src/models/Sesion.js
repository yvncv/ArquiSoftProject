const { Schema, model, Types } = require('mongoose');

const sesionSchema = new Schema({
  tema: { type: String, required: true },
  fecha: { type: Date, required: false },

  participantes: [{ 
    participante: { type: Types.ObjectId, ref:  'Usuario' },
    asistencia: { 
      estado: { type: String, required: false },
      hora: { type: Date, required: false }
    },
    participacion: {
      comentario: { type: String, required: false },
      fecha: { type: Date, required: false }  
    }
  }],

}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Sesion', sesionSchema);