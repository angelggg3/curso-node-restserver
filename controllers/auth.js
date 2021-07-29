const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

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

module.exports = {
    login
}