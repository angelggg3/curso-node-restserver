const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const {correo, password} = req.body;

    try {

        // Verificar si el correo existe en nustra DB
        const usuario = await Usuario.findOne({ correo });
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto'
            })
        }

        // Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrecto'
            })
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrio un error hable con el administrador'
        })
    }

}


const googleSignIn = async ( req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const {correo, nombre, img} = await googleVerify( id_token);

        let usuario = await Usuario.findOne({correo});

        if( !usuario ){
            const data = {
                nombre,
                correo,
                password:'ByGoogleSignIn',
                img,
                google: true,
            };
            usuario = new Usuario(data);
            await usuario.save();
        }

        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Cuenta existente o bloqueada, hable con el administrador'
            });
        }

         // Generar JWT
         const token = await generarJWT(usuario.id);

        
        res.json({
            msg: 'Ingreso con Google Sign In',
            usuario,
            token
        })

    } catch (error) {
        
        res.status(400).json({
            msg: 'Token de google no válido'
        })

    }
}

module.exports = {
    login,
    googleSignIn,
}