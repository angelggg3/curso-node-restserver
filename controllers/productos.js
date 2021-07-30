const { response, request } = require("express");
const { Producto, Categoria } = require('../models')


const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
                .populate('usuario','nombre')
                .populate('categoria','nombre')
                .skip(Number(desde))
                .limit(Number(limite)),
    ])
    res.status(200).json({
        total,
        productos
    })
}

const obtenerProducto = async (req = request, res = response) => {
    
    const { id } = req.params

    const producto = await Producto.findById(id)
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.status(200).json({
        producto
    })

}

const crearProducto = async (req = request, res = response) => {

    let {nombre, categoria, _id, usuario, estado, ...resto  } = req.body;
    nombre = nombre.toUpperCase();
    categoria = categoria.toUpperCase();

    const productoDB = await Producto.findOne({nombre});
    const categoriaDB = await Categoria.findById(categoria);

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }
    
    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria: categoriaDB._id,
        ...resto
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json({
        msg: 'Producto creado',
        producto
    });
}

const actualizarProducto = async (req = request, res = response) => {

    const {id} = req.params
    let {nombre, categoria, _id, usuario, estado, ...resto  } = req.body;
    nombre = nombre.toUpperCase();
    categoria = categoria.toUpperCase();


    const productoDB = await Producto.findOne({nombre});
    const categoriaDB = await Categoria.findById(categoria);

    if(!productoDB){
        return res.status(400).json({
            msg: `El producto ${nombre}, no existe`
        })
    }

    const producto = await Producto.findByIdAndUpdate(id,
        {
            nombre,
            usuario: req.usuario._id,
            categoria: categoriaDB._id,
            ...resto
        },{new: true} )

    res.status(200).json({
        msg: 'Producto actualizado',
        producto
    });
}

const borrarProducto = async (req = request, res = response) => {
    const {id} = req.params
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new:true} )

    res.json({
        msg: 'Producto borrado',
        producto
    })
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
}