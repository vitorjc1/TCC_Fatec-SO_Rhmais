const Curso = require('../models/curso');
const Op = require('Sequelize').Op;
const express = require('express');
const app = express();
const handleBars = require('express-handlebars');
const passport = require('passport');
app.engine('handlebars', handleBars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


module.exports = {

    listagem(req, res, next) {
        Curso.findAll({
            where: {
                situacao: 1
            },
            order: [
                ['nome', 'ASC']
            ]
        }).then((cursos) => {
            res.render('cursos', { cursos: cursos })
        });

    },

    buscarCurso(req, res) {
        let { busca } = req.body;
        Curso.findAll({
            where: {
                situacao: 1,
                nome: {
                    [Op.substring]: busca
                }
            },
            order: [
                ['nome', 'ASC']
            ]
        }).then((cursos) => {
            res.render('cursos', { cursos: cursos });
        });
    },

    async cadastrar(req, res) {

        let { cargaHoraria, descricao, nome, valor } = req.body;

        let erros = [];

        if (nome.length < 3) {
            erros.push({ texto: "Informe o nome do curso." });
        }


        if (valor == 0) {
            erros.push({ texto: "Informe um valor valido para o curso." });

        }
        if (cargaHoraria == 0) {
            erros.push({ texto: "Informe uma carga horaia valida para o curso." });

        }

        if (erros.length > 0) {
            res.render('cadastrarCurso', { erros: erros });
        } else {
            await Curso.create({
                nome: nome,
                valor: valor,
                cargaHoraria: cargaHoraria,
                descricao: descricao,
                situacao: 1
            }).then((curso) => {
                req.flash("success_msg", "Curso: " + nome + " cadastrado com sucesso!");
                res.redirect('/listarCursoCadastrado/' + curso.dataValues.id);
            }).catch((err) => {
                console.log('erro ao cadastrar curso: ' + err);
            })
        }
    }, // fim cadastrar


    async listarCursoCadastrado(req, res) {
        let { id } = req.params;

        Curso.findAll({
            where: {
                id
            }
        }).then((cursos) => {
            res.render('cursos', { cursos: cursos })
        });

    }, // fim listarCursoCadastrado

    async procurar(req, res) {

        let { id } = req.params;

        await Curso.findByPk(id).then((curso) => {
            res.render("editarCurso", { curso: curso });
        })
    },

    async atualizar(req, res) {

        let { nome, descricao, valor } = req.body;

        let erros = [];

        let sucesso = [];

        if (nome.length < 3) {
            erros.push({ texto: "Informe o nome do curso." });
        }


        if (valor.length == 0) {
            erros.push({ texto: "Informe um valor valido para o curso." });

        }

        if (erros.length > 0) {
            await Curso.findByPk(req.body.id).then((curso) => {
                res.render('editarCurso', { erros: erros, curso: curso });
            })


        } else {
            await Curso.update({
                nome,
                descricao,
                valor
            }, {
                where: {
                    id: req.body.id
                }
            }).then(() => {
                req.flash("success_msg", "Curso: " + nome + " cadastrado com sucesso!");
                res.redirect('/listarCursoCadastrado/' + req.body.id);
            })
        }



    }, //fim funcao atualizar

    async desabilitarCurso(req, res) {

        let { id } = req.params;

        Curso.update({
            situacao: 0
        }, {
            where: {
                id: id
            }
        }).then(() => {
            req.flash("success_msg", "Curso: " + nome + " excluído com sucesso!");
            res.redirect('/visualizarCurso');
        })
    },



}