const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if(esMongoID){
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado:true}]
    });

    res.json({
        results: usuarios
    });

}

buscarCategoria = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if(esMongoID){
        const categoria = await Categoria.findById( termino );
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado:true})
                                .populate('usuario','nombre');

    res.json({
        results: categorias
    });
}

buscarProducto = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );

    if(esMongoID){
        const producto = await Producto.findById( termino )
                                .populate('categoria','nombre')
                                .populate('usuario','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre: regex, estado:true})
                                .populate('categoria','nombre')
                                .populate('usuario','nombre');

    res.json({
        results: productos
    });
}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuario(termino, res);
        break;
        case 'categorias':
            buscarCategoria(termino, res);
        break;
        case 'productos':
            buscarProducto(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Falta esta coleccion, contacte al administrador'
            })
        break;
    }
}


module.exports = {
    buscar
}