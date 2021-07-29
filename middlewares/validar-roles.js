const { response, request } = require("express")

const esAdminRole = ( req = request, res = response, next ) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Error al validar el token, contacte al administrador'
        })
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `Acceso no autorizado, el usuario ${nombre} no tiene permiso de admistrador`
        })
    }

    next();
    
}

const tieneRole = ( ...roles ) => {
    return (req = request, res = response, next) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Error al validar el token, contacte al administrador'
            })
        }

        if( !roles.includes( req.usuario.rol)){
            return res.status(401).json({
                msg: `Acceso no autorizado, no tienes permiso de ${roles}`
            })
        }


        next();

    }
}

module.exports = {
    esAdminRole,
    tieneRole
}