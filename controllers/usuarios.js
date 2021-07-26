const { response, request } = require('express');



const usuariosGet = (req = request , res = response) => {

    const { q , nombre = 'No name' , apikey } = req.query;

    res.json({
        ok: true,
        msg: 'get API - Controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPut = (req = request , res = response) => {

    const id = req.params.id;

    res.json({
        ok: true,
        msg: 'put API - Controlador',
        id
    });
}

const usuariosPost = (req = request , res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg: 'post API - Controlador',
        nombre,
        edad
    });
}

const usuariosPatch = (req = request , res = response) => {
    res.json({
        ok: true,
        msg: 'patch API - Controlador'
    });
}

const usuariosDelete = (req = request , res = response) => {
    res.json({
        ok: true,
        msg: 'delete API - Controlador'
    });
}



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete
}