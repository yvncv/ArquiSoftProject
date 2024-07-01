const semanaCtrl = {};

// Importa el modelo Semana y otras dependencias
const Semana = require('../models/Semana');
const mongoose = require('mongoose');

// Definir todas las funciones del controlador
semanaCtrl.getSemanas = async (req, res) => {
    try {
        const semanas = await Semana.find();
        res.json(semanas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las semanaes', error });
    }
};

semanaCtrl.createSemanas = async (req, res) => {
    const { tema, fecha, participantes } = req.body;

    if (!tema || !fecha || !participantes) {
        return res.status(400).json({ msg: 'Por favor, proporciona todos los campos requeridos.' });
    }

    try {
        // Verificar si ya existe un semana con el mismo código
        let semana = await Semana.findOne({ tema });
        if (semana) {
            return res.status(400).json({ msg: 'La semana ya existe' });
        }

        // Crear un nuevo semana con los datos proporcionados
        semana = new Semana({ tema, fecha, participantes });

        // Guardar el semana en la base de datos
        await semana.save();

        // Responder con un mensaje de éxito
        res.json({ message: "La semana ha sido registrada exitosamente" });

    } catch (err) {
        // Manejar errores internos del servidor
        res.status(500).json({ message: 'Error al registrar la semana', error: err.message });
    }
};

semanaCtrl.getSem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const semana = await Semana.findById(id);

        if (!semana) {
            return res.status(404).json({ message: 'Semana no encontrada' });
        }

        res.json(semana);
    } catch (error) {
        console.error('Error al obtener la semana:', error); 
        res.status(500).json({ message: 'Error al obtener la semana', error: error.message });
    }
};

semanaCtrl.deleteSemana = async (req, res) => {
    try {
        const id = req.params.id;
        await Semana.findByIdAndDelete(id);
        res.json({ message: "La semana ha sido eliminada" });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la semana', error });
    }
};

semanaCtrl.updateSemana = async (req, res) => {
    const { tema, fecha, participantes } = req.body;
    try {
        const id = req.params.id;
        await Semana.findByIdAndUpdate(id, {
            tema, fecha, participantes
        });
        res.json({ message: "La semana ha sido actualizada" });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la semana', error });
    }
};

// Exportar el objeto con todas las funciones
module.exports = semanaCtrl;