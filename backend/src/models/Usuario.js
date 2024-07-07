const { Schema, model } = require("mongoose");

// Definimos las carreras posibles para cada facultad
const carrerasPorFacultad = {
  ingenieria: [
    "Informática",
    "Civil",
    "Industrial",
    "Electrónica",
    "Mecatrónica",
  ],
  derecho: ["Derecho"],
  arquitectura: ["Arquitectura"],
  cienciasEconomicas: [
    "Economía",
    "Administración de Empresas",
    "Contabilidad",
  ],
  psicologia: ["Psicología"],
  lenguasModernas: ["Traducción e Interpretación", "Idiomas Modernos"],
  medicina: ["Medicina"],
  biologiaHumana: ["Biología", "Biomedicina"],
};

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    facultad: { type: String, required: false },
    carrera: {
      type: String,
      required: false,
      enum: [],
    },
    ciclo: { type: String, required: false },
    codigo: { type: String, required: true },
    correo: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

usuarioSchema.path("facultad").set(function (newFacultad) {
  this.set("carrera", {
    type: String,
    required: true,
    enum: carrerasPorFacultad[newFacultad],
  });
  return newFacultad;
});

module.exports = model("Usuario", usuarioSchema);
