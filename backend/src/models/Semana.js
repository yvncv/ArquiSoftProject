const { Schema, model, Types } = require('mongoose');

const semanaSchema = new Schema({
    sesiones: [{ type: Types.ObjectId, ref:  'Sesion' }],
    fecha: { 
        inicio: { type: Types.Datetime, required: true },
        fin: { type: Types.Datetime, required: true }
    }
}, {
  versionKey: false,
  timestamps: true,
});

module.exports = model('Semana', semanaSchema);