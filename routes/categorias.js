const { Router } =require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorID } = require('../helpers/db-validators');
const {
        crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria,
} = require('../controllers/categorias');


const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categorias - publico
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorID ),
    validarCampos
], obtenerCategoria);

// Crear categoria - privado
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Actualizar categoria - privado
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id', 'No existe la categoria con ese id').custom( existeCategoriaPorID ),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - privado - Only admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorID ),
    validarCampos
], borrarCategoria);

module.exports = router