const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');

const cursoCtrl = {};

// Obtener todos los cursos
cursoCtrl.getCursos = async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json({ message: 'Cursos obtenidos correctamente', data: cursos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos', error: error.message });
    }
};

// Crear un nuevo curso
cursoCtrl.createCursos = async (req, res) => {
    const { nombre, codigo, grado, carrera, facultad, ciclo, semestre, sesiones, participantes } = req.body;
    
    if (!nombre || !codigo || !grado || !carrera || !facultad || !ciclo|| !semestre || !sesiones || !participantes) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    try {
      // Verificar si ya existe un curso con el mismo código
      let cursoExistente = await Curso.findOne({ codigo });
      if (cursoExistente) {
        return res.status(400).json({ message: 'El curso con este código ya existe' });
      }
      
      // Verificar si todos los participantes son IDs válidos de usuarios
      const participantesIds = await Promise.all(participantes.map(async (participanteId) => {
        const usuario = await Usuario.findById(participanteId);
        if (!usuario) {
          throw new Error(`Usuario con ID ${participanteId} no encontrado`);
        }
        return participanteId;
      }));
  
      const newCurso = new Curso({ nombre, codigo, grado, carrera, facultad, ciclo, semestre, sesiones, participantes: participantesIds });
      await newCurso.save();
      
      res.json({ message: "El curso ha sido registrado", data: newCurso });
    } catch (error) {
      console.error('Error al crear el curso:', error);
      res.status(500).json({ message: 'Error al registrar el curso, intente nuevamente', error: error.message });
    }
  };
  

// Obtener un curso específico por ID
cursoCtrl.getCursoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const curso = await Curso.findById(id);

        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        res.json({ message: 'Curso obtenido correctamente', data: curso });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
    }
};

// Actualizar un curso por ID
cursoCtrl.updateCurso = async (req, res) => {
    const { nombre, codigo, grado, carrera, facultad, ciclo, semestre, sesiones, participantes } = req.body;
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const updatedCurso = await Curso.findByIdAndUpdate(id, {
            nombre, codigo, grado, carrera, facultad, ciclo, semestre, sesiones, participantes
        }, { new: true });

        if (!updatedCurso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        res.json({ message: "El curso ha sido actualizado", data: updatedCurso });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el curso', error: error.message });
    }
};

// Eliminar un curso por ID
cursoCtrl.deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const curso = await Curso.findByIdAndDelete(id);

        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        res.json({ message: "El curso ha sido eliminado" });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el curso', error: error.message });
    }
};

module.exports = cursoCtrl;
