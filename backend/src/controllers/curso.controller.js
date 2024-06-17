const cursoCtrl = {};
const Curso = require('../models/Curso');
cursoCtrl.getCursos = async (req, res) => {
    try {
        const cursos = await Curso.find();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cursos', error });
    }
};

cursoCtrl.createCursos = async (req, res) => {
    const { nombre, codigo, grado, carrera, facultad, semestre, sesiones, participantes } = req.body;
    const newCurso = new Curso({ nombre, codigo, grado, carrera, facultad, semestre, sesiones, participantes });
    try {
        let curso = await Curso.findOne({ codigo });
        if (curso) {
            return res.status(400).json({ msg: 'El curso ya existe' });
        }
        await newCurso.save();
        res.json({ message: "El curso ha sido registrado" });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el curso', err });
    }
};

cursoCtrl.getCur = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const curso = await Curso.findById(id);

        if (!curso) {
            return res.status(404).json({ message: 'Curso no encontrado' });
        }

        res.json(curso);
    } catch (error) {
        console.error('Error al obtener el curso:', error); 
        res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
    }
};

cursoCtrl.deleteCurso = async (req, res) => {
    try {
        const id = req.params.id;
        await Curso.findByIdAndDelete(id);
        res.json({ message: "El curso ha sido eliminado" });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el curso', error });
    }
};

cursoCtrl.updateCurso = async (req, res) => {
    const { nombre, codigo, grado, carrera, facultad, semestre, sesiones, participantes } = req.body;
    try {
        const id = req.params.id;
        await Curso.findByIdAndUpdate(id, {
            nombre, codigo, grado, carrera, facultad, semestre, sesiones, participantes
        });
        res.json({ message: "El curso ha sido actualizado" });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el curso', error });
    }
};

// Exportar el objeto con todas las funciones
module.exports = cursoCtrl;