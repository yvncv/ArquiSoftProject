const usuarioCtrl = {};

// Importa el modelo Usuario y otras dependencias
const Usuario = require('../models/Usuario');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Definir todas las funciones del controlador
usuarioCtrl.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

usuarioCtrl.createUsuarios = async (req, res) => {
    const { nombre, carrera, ciclo, codigo, correo, password, role } = req.body;
    if (!nombre || !codigo || !password) {
        return res.status(400).json({ msg: 'Por favor, proporciona todos los campos requeridos.' });
    }

    try {
        let usuario = await Usuario.findOne({ codigo });
        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        usuario = new Usuario({ nombre, carrera, ciclo, codigo, correo, password, role });

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();
        res.json({ message: "El usuario ha sido registrado" });
        
        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                codigo: usuario.codigo,
                correo: usuario.correo,
                carrera: usuario.carrera,
                ciclo: usuario.ciclo,
                role: usuario.role,
            }
        };

        jwt.sign(payload, process.env.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar el usuario', err });
    }
};

usuarioCtrl.getUsu = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const usuario = await Usuario.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error); 
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

usuarioCtrl.deleteUsuario = async (req, res) => {
    if (!req.usuario || req.usuario.role !== 'admin') {
        return res.status(401).json({ message: 'No estás autorizado para realizar esta acción' });
    }

    try {
        const id = req.params.id;
        await Usuario.findByIdAndDelete(id);
        res.json({ message: "El usuario ha sido eliminado" });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

usuarioCtrl.updateUsuario = async (req, res) => {
    if (!req.usuario || req.usuario.role !== 'admin') {
        return res.status(401).json({ message: 'No estás autorizado para realizar esta acción' });
    }
    
    const { nombre, carrera, ciclo, codigo, correo, password, role } = req.body;
    try {
        const id = req.params.id;
        await Usuario.findByIdAndUpdate(id, {
            nombre, carrera, ciclo, codigo, correo, password, role
        });
        res.json({ message: "El usuario ha sido actualizado" });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};

usuarioCtrl.iniciarSesion = async (req, res) => {
    const { codigo, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ codigo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                codigo: usuario.codigo,
                correo: usuario.correo,
                carrera: usuario.carrera,
                ciclo: usuario.ciclo,
                role: usuario.role,
            }
        };

        jwt.sign(payload, process.env.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

usuarioCtrl.usuarioLogueado = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Se requiere el token' });
        }

        jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            res.json({ usuario: decoded.usuario });
        });
    } catch (error) {
        console.error('Error al obtener el usuario:', error); 
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

usuarioCtrl.cerrarSesion = async (req, res) => {
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

// Exportar el objeto con todas las funciones
module.exports = usuarioCtrl;