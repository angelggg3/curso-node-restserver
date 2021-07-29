const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res= response, next) => {
    
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'Acceso no autorizado, Token no válido'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATE_KEY);

        const usuario = await Usuario.findById(uid);

        if( !usuario ){
            return res.status(401).json({
                msg: 'Acceso no autorizado, Token no válido'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Acceso no autorizado, Token no válido'
            })
        }


        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Acceso no autorizado, Token no válido'
        })
    }

}


module.exports = {
    validarJWT
}