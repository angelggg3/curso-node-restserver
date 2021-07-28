const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');



const usuariosGet = async (req = request , res = response) => {

    const { limite = 5, desde = 0} = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({ total, usuarios });
}

const usuariosPut = async (req = request , res = response) => {

    const id = req.params.id;
    const {_id, password, google, ...resto} = req.body;

    if( password ){
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json({ msg: 'Usuario actualizado', usuario });
}

const usuariosPost = async (req = request , res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    await usuario.save(); // <----- Guardar en DB

    res.json({ msg: 'Usuario creado', usuario });
}

const usuariosPatch = (req = request , res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = async (req = request , res = response) => {

    const id = req.params.id;

    //Eliminar fisicamente
    //const usuario = await Usuario.findByIdAndDelete( id );

    // Eliminar por estado
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({ msg: 'Usuario eliminado', usuario });
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}