var jwt = require('jsonwebtoken');

//Semilla de token
var SEED = require('../config/config').SEED;


// ========================================
// Verificar token
// ========================================
exports.verificarToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        //Extraer del decoded el usuario
        req.usuario = decoded.usuario;

        next();


    });
}