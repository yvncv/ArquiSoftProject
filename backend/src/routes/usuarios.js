const { Router } = require('express');
const router = Router();
const usuarioCtrl = require('../controllers/usuario.controller.js');

// Asegúrate de que cada una de estas funciones esté definida en usuarioCtrl
router.route('/')
    .get(usuarioCtrl.getUsuarios) // Verificar que usuarioCtrl.getUsuarios no es undefined
    .post(usuarioCtrl.createUsuarios); // Verificar que usuarioCtrl.createUsuarios no es undefined

router.route('/:id')
    .get(usuarioCtrl.getUsu) // Verificar que usuarioCtrl.getUsu no es undefined
    .delete(usuarioCtrl.deleteUsuario) // Verificar que usuarioCtrl.deleteUsuario no es undefined
    .put(usuarioCtrl.updateUsuario); // Verificar que usuarioCtrl.updateUsuario no es undefined

// Ruta de inicio de sesión
router.post('/login', usuarioCtrl.iniciarSesion);

// Ruta para obtener el usuario logueado basado en el token
router.get('/login/:token', usuarioCtrl.usuarioLogueado);

// Ruta para cerrar sesión
router.post('/logout', usuarioCtrl.cerrarSesion);

module.exports = router;