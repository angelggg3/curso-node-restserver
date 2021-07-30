const { Router } =require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');
const { existeProductoPorID, existeCategoriaPorID } = require('../helpers/db-validators');
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
} = require('../controllers/productos');


const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerProductos);

// Obtener una categorias - publico
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos
], obtenerProducto);

// Crear categoria - privado
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','El id de la categoria no es valido').isMongoId(),
    check('categoria', 'No existe la categoria con ese id').custom( existeCategoriaPorID ),
    validarCampos,
], crearProducto);

// Actualizar categoria - privado
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id', 'No existe la categoria con ese id').custom( existeProductoPorID ),
    check('categoria','El id de la categoria no es valido').isMongoId(),
    check('categoria', 'No existe la categoria con ese id').custom( existeCategoriaPorID ),
    validarCampos
], actualizarProducto);

// Borrar una categoria - privado - Only admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorID ),
    validarCampos
], borrarProducto);

module.exports = router