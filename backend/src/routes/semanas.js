const { Router } = require('express');
const router = Router();
const semanaCtrl = require('../controllers/semana.controller.js');

// Asegúrate de que cada una de estas funciones esté definida en semanaCtrl
router.route('/')
    .get(semanaCtrl.getSemanas) // Verificar que semanaCtrl.getSemanas no es undefined
    .post(semanaCtrl.createSemanas); // Verificar que semanaCtrl.createSemanas no es undefined

router.route('/:id')
    .get(semanaCtrl.getSem) // Verificar que semanaCtrl.getUsu no es undefined
    .delete(semanaCtrl.deleteSemana) // Verificar que semanaCtrl.deleteSemana no es undefined
    .put(semanaCtrl.updateSemana); // Verificar que semanaCtrl.updateSemana no es undefined

module.exports = router;