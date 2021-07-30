const { response, request } = require("express");
const { Categoria } = require("../models");
const categoria = require("../models/categoria");


const obtenerCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
                .populate('usuario','nombre')
                .skip(Number(desde))
                .limit(Number(limite)),
    ])
    res.status(200).json({
        total,
        categorias
    })
}


const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params

    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.status(200).json({
        categoria
    })
}


const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
        msg: 'Categoria creada',
        categoria
    });

}


const actualizarCategoria = async (req = request, res = response) => {

    const {id} = req.params
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const categoria = await Categoria.findByIdAndUpdate(id, {nombre, usuario: req.usuario._id}, {new: true} )

    res.status(200).json({
        msg: 'Categoria actualizada',
        categoria
    });
}


const borrarCategoria = async (req = request, res = response) => {

    const {id} = req.params
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true} )

    res.json({
        msg: 'Categoria borrada',
        categoria
    })
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
}