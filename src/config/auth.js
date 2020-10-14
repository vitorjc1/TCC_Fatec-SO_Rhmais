const localStrategy = require('passport-local').Strategy
const db = require('./db');
require('../models/colaborador');
const Colaborador = require('../models/colaborador');

module.exports = function(passport) {

    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, async(email, senha, done) => {

        await Colaborador.findOne({ where: { email: email } }).then((colaborador) => {



            if (!colaborador) {
                return done(null, false, { message: "Esta conta nao existe!" })
            } else {

                if (colaborador.acesso == 4) {
                    return done(null, false, { message: "Colaborador Inativo!" });
                }

                if (colaborador.senha === senha) {
                    return done(null, colaborador);
                } else {
                    return done(null, false, { message: "Senha incorreta!" });
                }


            }
        })
    }))


    passport.serializeUser((colaborador, done) => {

        done(null, colaborador.id);
    })

    passport.deserializeUser((id, done) => {

        Colaborador.findByPk(id).then((usuario) => {
            done(null, usuario);
        })
    })
}