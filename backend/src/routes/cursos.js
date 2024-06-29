const { Router } = require('express');
const router = Router();
const cursoCtrl = require('../controllers/curso.controller.js');

// Asegúrate de que cada una de estas funciones esté definida en cursoCtrl
router.route('/')
    .get(cursoCtrl.getCursos) // Verificar que cursoCtrl.getCursos no es undefined
    .post(cursoCtrl.createCurso); // Verificar que cursoCtrl.createCursos no es undefined

router.route('/:id')
    .get(cursoCtrl.getCursoById) // Verificar que cursoCtrl.getUsu no es undefined
    .delete(cursoCtrl.deleteCurso) // Verificar que cursoCtrl.deleteCurso no es undefined
    .put(cursoCtrl.updateCurso); // Verificar que cursoCtrl.updateCurso no es undefined

module.exports = router;