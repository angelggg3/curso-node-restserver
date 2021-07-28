


const { Router } =require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { 
        esRoleValido,
        emailExiste,
        existeUsuarioPorID,
} = require('../helpers/db-validators');
const { 
        usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete,
        usuariosPatch,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorID ),
        check('rol').custom( esRoleValido ),
        validarCampos
], usuariosPut);

router.post('/',[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe tener minimo 6 caracteres').isLength({min:6}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom( emailExiste ),
        check('rol').custom( esRoleValido ),
        validarCampos,
],usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioPorID ),
        validarCampos
], usuariosDelete);


module.exports = router;