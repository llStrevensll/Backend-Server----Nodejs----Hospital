var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//Semilla de token
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuarios');

app.post('/', (req, res) => {

    var body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // Sino existe usuario de BD
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        usuarioDB.password = ':)';
        // Crear token!!
        //payload - data que quiero colocar en el 
        //seed - la semilla
        //fecha de expiracion
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });

    })
});


module.exports = app;