const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');


class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        // Paths
        this.usuariosPath = '/api/usuarios'
        this.authPath =     '/api/auth'

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
        this.app.use(this.authPath,     require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor correindo en el puerto', this.port);
        })
    }

}


module.exports = Server;