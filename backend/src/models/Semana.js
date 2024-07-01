const { Schema, model, Types } = require('mongoose');

const semanaSchema = new Schema({
    sesiones: [{ type: Types.ObjectId, ref:  'Sesion' }],
    fecha: { 
        inicio: { type: Date, required: true },
        fin: { type: Date, required: true }
    }
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Semana', semanaSchema);