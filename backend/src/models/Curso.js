const { Schema, model, Types } = require("mongoose");

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

const cursoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    codigo: { type: String, required: true, unique: true },
    grado: { type: String, required: true },
    carrera: { type: String, required: true, enum: [] }, // Cambiado a un solo String en lugar de un arreglo
    facultad: { type: String, required: true },
    ciclo: { type: Number, required: false, min: 1, max: 10 },
    semestre: { type: String, required: true },
    grupos: [
      { 
        grupo: { type: Number, required: false}, //los enumera segun los grupos creados en un curso desde el 1
        tipoGrupo: { type: String, required: true },
        horario: [{ dia: { type: String }, hora: { type: String } }],
        participantes: [{ type: Types.ObjectId, ref: "Usuario", required: false }],
        semanas: [{ type: Types.ObjectId, ref: "Semana", required: false}]
      }
    ],
    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

cursoSchema.path("facultad").validate(function (value) {
  return Object.keys(carrerasPorFacultad).includes(value);
}, "Facultad no válida");

cursoSchema.pre("validate", function (next) {
  if (this.facultad && carrerasPorFacultad[this.facultad]) {
    this.schema.path("carrera").enum = carrerasPorFacultad[this.facultad];
  }
  next();
});

module.exports = model("Curso", cursoSchema);