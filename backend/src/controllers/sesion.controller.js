const sesionCtrl = {};

// Importa el modelo Sesion y otras dependencias
const Sesion = require('../models/Sesion');
const mongoose = require('mongoose');

// Definir todas las funciones del controlador
sesionCtrl.getSesions = async (req, res) => {
    try {
        const sesions = await Sesion.find();
        res.json(sesions);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las sesiones', error });
    }
};

sesionCtrl.createSesions = async (req, res) => {
    const { tema, fecha, participantes } = req.body;

    if (!tema || !fecha || !participantes) {
        return res.status(400).json({ msg: 'Por favor, proporciona todos los campos requeridos.' });
    }

    try {
        // Verificar si ya existe un sesion con el mismo código
        let sesion = await Sesion.findOne({ tema });
        if (sesion) {
            return res.status(400).json({ msg: 'La sesion ya existe' });
        }

        // Crear un nuevo sesion con los datos proporcionados
        sesion = new Sesion({ tema, fecha, participantes });

        // Guardar el sesion en la base de datos
        await sesion.save();

        // Responder con un mensaje de éxito
        res.json({ message: "La sesion ha sido registrada exitosamente" });

    } catch (err) {
        // Manejar errores internos del servidor
        res.status(500).json({ message: 'Error al registrar la sesion', error: err.message });
    }
};

sesionCtrl.getSes = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const sesion = await Sesion.findById(id);

        if (!sesion) {
            return res.status(404).json({ message: 'Sesion no encontrada' });
        }

        res.json(sesion);
    } catch (error) {
        console.error('Error al obtener la sesion:', error); 
        res.status(500).json({ message: 'Error al obtener la sesion', error: error.message });
    }
};

sesionCtrl.deleteSesion = async (req, res) => {
    try {
        const id = req.params.id;
        await Sesion.findByIdAndDelete(id);
        res.json({ message: "La sesion ha sido eliminada" });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la sesion', error });
    }
};

sesionCtrl.updateSesion = async (req, res) => {
    const { tema, fecha, participantes } = req.body;
    try {
        const id = req.params.id;
        await Sesion.findByIdAndUpdate(id, {
            tema, fecha, participantes
        });
        res.json({ message: "La sesion ha sido actualizada" });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la sesion', error });
    }
};

// Exportar el objeto con todas las funciones
module.exports = sesionCtrl;