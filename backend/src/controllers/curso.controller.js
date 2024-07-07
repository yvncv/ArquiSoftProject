const Curso = require("../models/Curso");
const Sesion = require("../models/Sesion");
const Semana = require("../models/Semana");
const Usuario = require("../models/Usuario");
const mongoose = require("mongoose");

const cursoCtrl = {};

// Obtener todos los cursos
cursoCtrl.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los cursos", error: error.message });
  }
};

// Crear un nuevo curso
cursoCtrl.createCurso = async (req, res) => {
  const { nombre, codigo, grado, carrera, facultad, ciclo, semestre, grupos } = req.body;

  // Verificar si todos los campos obligatorios están presentes
  if (!nombre || !codigo || !grado || !carrera || !facultad || !ciclo || !semestre || !grupos) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  let fechaInicio;
  if (semestre === "2024-I") {
    fechaInicio = new Date("2024-03-25");
  } else if (semestre === "2024-II") {
    fechaInicio = new Date("2024-08-26");
  } else {
    return res.status(400).json({ message: "Semestre no válido" });
  }

  try {
    // Verificar si ya existe un curso con el mismo código
    const cursoExistente = await Curso.findOne({ codigo });
    if (cursoExistente) {
      return res.status(400).json({ message: "El curso con este código ya existe" });
    }

    // Mapear participantes a sus IDs y validar su existencia
    const participantesIds = await Promise.all(
      grupos.flatMap((grupo) => grupo.participantes)
        .map(async (participanteId) => {
          const usuario = await Usuario.findById(participanteId);
          if (!usuario) {
            throw new Error(`Usuario con ID ${participanteId} no encontrado`);
          }
          return participanteId;
        })
    );

    // Crear el nuevo curso
    const newCurso = new Curso({
      nombre,
      codigo,
      grado,
      carrera,
      facultad,
      ciclo,
      semestre,
      grupos,
    });

    // Crear semanas y sesiones automáticamente
    const semanas = [];
    let fechaInicioSemana = new Date(fechaInicio);

    for (let i = 0; i < 18; i++) {
      const fechaFinSemana = new Date(fechaInicioSemana);
      fechaFinSemana.setDate(fechaInicioSemana.getDate() + 6);

      const sesiones = [];
      for (const grupo of grupos) {
        for (const horario of grupo.horario) {
          const [hora, minuto] = horario.hora.split(":").map(Number);
          const diaSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(horario.dia);

          const fechaSesion = new Date(fechaInicioSemana);
          fechaSesion.setDate(fechaInicioSemana.getDate() + diaSemana);
          fechaSesion.setHours(hora, minuto);

          const sesion = new Sesion({
            tema: `Sesión ${i + 1} - ${horario.dia} ${horario.hora}`,
            fecha: fechaSesion,
            participantes: grupo.participantes.map(participante => ({
              participante: participante
            }))
          });

          await sesion.save();
          sesiones.push(sesion._id);
        }
      }

      const semana = new Semana({
        sesiones,
        fecha: {
          inicio: fechaInicioSemana,
          fin: fechaFinSemana,
        },
      });

      await semana.save();
      semanas.push(semana._id);

      fechaInicioSemana.setDate(fechaInicioSemana.getDate() + 7);
    }

    newCurso.grupos.forEach(grupo => {
      grupo.semanas = semanas;
    });

    await newCurso.save();

    // Devolver respuesta con éxito
    res.json({ message: "El curso ha sido registrado", data: newCurso });
  } catch (error) {
    // Capturar y manejar errores
    console.error("Error al crear el curso:", error);
    res.status(500).json({ message: "Error al registrar el curso, intente nuevamente", error: error.message });
  }
};




// Obtener un curso específico por ID
cursoCtrl.getCursoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const curso = await Curso.findById(id);

    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    res.json({ message: "Curso obtenido correctamente", data: curso });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el curso", error: error.message });
  }
};

// Actualizar un curso por ID
cursoCtrl.updateCurso = async (req, res) => {
  const { nombre, codigo, grado, carrera, facultad, ciclo, semestre, grupos } =
    req.body;
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updatedCurso = await Curso.findByIdAndUpdate(
      id,
      {
        nombre,
        codigo,
        grado,
        carrera,
        facultad,
        ciclo,
        semestre,
        grupos,
      },
      { new: true }
    );

    if (!updatedCurso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    res.json({ message: "El curso ha sido actualizado", data: updatedCurso });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el curso", error: error.message });
  }
};

// Eliminar un curso por ID
cursoCtrl.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const curso = await Curso.findByIdAndDelete(id);

    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    res.json({ message: "El curso ha sido eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el curso", error: error.message });
  }
};

module.exports = cursoCtrl;
