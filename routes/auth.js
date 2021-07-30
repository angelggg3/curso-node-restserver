const { Router } =require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'Ingrese una contraseña').not().isEmpty(),
    
    validarCampos
], login);


router.post('/google',[
    check('id_token', 'El id_token es necesarion').not().isEmpty(),
    validarCampos
], googleSignIn);

module.exports = router