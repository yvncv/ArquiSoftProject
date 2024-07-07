const { Router } = require('express');
const router = Router();
const sesionCtrl = require('../controllers/sesion.controller.js');

// Asegúrate de que cada una de estas funciones esté definida en sesionCtrl
router.route('/')
    .get(sesionCtrl.getSesions) // Verificar que sesionCtrl.getSesions no es undefined
    .post(sesionCtrl.createSesions); // Verificar que sesionCtrl.createSesions no es undefined

router.route('/:id')
    .get(sesionCtrl.getSes) // Verificar que sesionCtrl.getUsu no es undefined
    .delete(sesionCtrl.deleteSesion) // Verificar que sesionCtrl.deleteSesion no es undefined
    .put(sesionCtrl.updateSesion); // Verificar que sesionCtrl.updateSesion no es undefined

module.exports = router;