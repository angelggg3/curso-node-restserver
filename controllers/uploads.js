const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');




const cargarArchivo = async (req = request, res = response) => {

    try {
      const nombre = await subirArchivo(req.files, ['png', 'jpg', 'jpeg'], 'archivos');

      res.json({
        nombre
      })
    } catch (error) {
      console.log(error);
      res.status(400).json({msg:error})  
    }
}

const actualizarImagen = async (req = request, res = response) => {

  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con ese id ${id}`
        });
      }
    break;
    case 'productos':
      modelo = await Producto.findById(id);

      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con ese id ${id}`
        });
      }
    break;
    default:
      return res.status(500).json({msg: 'Coleccion no registrado en el servidor, comuníquese con el administrador'})
  }

  //Eliminar la imagen anterior del usuario o producto
  if( modelo.img ){
    // Hay que borrar la imagen
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

    if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
    }

  }

  const nombre = await subirArchivo(req.files, ['png', 'jpg', 'jpeg'], coleccion);
  modelo.img = nombre;

  await modelo.save();

  
  res.json({
    modelo
  })
}


const mostrarImagen = async (req = request, res = response) => {

  
  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con ese id ${id}`
        });
      }
    break;
    case 'productos':
      modelo = await Producto.findById(id);

      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con ese id ${id}`
        });
      }
    break;
    default:
      return res.status(500).json({msg: 'Coleccion no registrado en el servidor, comuníquese con el administrador'})
  }

  if( modelo.img ){
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

    if(fs.existsSync(pathImagen)){
      return res.sendFile( pathImagen );
    }

  }

  const pathImagen = path.join(__dirname, '../assets/no-Image.jpg');
  res.sendFile( pathImagen );

}

const actualizarImagenCloudinary = async (req = request, res = response) => {

  const { id, coleccion } = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un usuario con ese id ${id}`
        });
      }
    break;
    case 'productos':
      modelo = await Producto.findById(id);

      if( !modelo ) {
        return res.status(400).json({
          msg: `No existe un producto con ese id ${id}`
        });
      }
    break;
    default:
      return res.status(500).json({msg: 'Coleccion no registrado en el servidor, comuníquese con el administrador'})
  }

  //Eliminar la imagen anterior del usuario o producto
  if( modelo.img ){
  
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length-1];
    const [public_id] = nombre.split('.');

    cloudinary.uploader.destroy( public_id );

  }


  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
  modelo.img = secure_url;

  await modelo.save();

  res.json({
    modelo
  })
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}