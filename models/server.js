const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConection } = require('../database/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        // Paths
        this.path = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));


        // Conectar base de datos
        this.conectarDB()

        /// Middlewares
        this.middlewares();

        ///Rutas de la aplicacion
        this.routes();
    }


    async conectarDB(){
        await dbConection();
    }

    middlewares(){

        //Cors
        this.app.use( cors() );

        // Lectura y parse del body
        this.app.use( express.json() );

        ///Directorio Publico
        this.app.use( express.static('public') );
    }


    routes(){
        this.app.use(this.path.auth,        require('../routes/auth'));
        this.app.use(this.path.buscar,      require('../routes/buscar'));
        this.app.use(this.path.categorias,  require('../routes/categorias'));
        this.app.use(this.path.productos,   require('../routes/productos'));
        this.app.use(this.path.usuarios,    require('../routes/usuarios'));
        this.app.use(this.path.uploads,     require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor correindo en el puerto', this.port);
        })
    }

}


module.exports = Server;