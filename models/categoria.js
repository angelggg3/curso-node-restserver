const { Schema, model } = require('mongoose');

const CategoriaShema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Es obligatorio quien crea la categoria']
    }
});

CategoriaShema.methods.toJSON = function(){
    const {__v, estado, ...categoria} = this.toObject();
    return categoria;
}



module.exports = model('Categoria', CategoriaShema);