const Colaborador = require('../models/colaborador');
const Setor = require('../models/setor');
const Cargo = require('../models/cargo');
const Curso = require('../models/curso');
const sequelize = require('../config/db');
const TipoAprovacao = require('../models/tipoAprovacao');
const Op = require('Sequelize').Op;
const SugestaoCurso = require('../models/sugestaoCurso');
const { QueryTypes } = require('sequelize');
const Gestor = require('../models/gestor');
const Instrutor = require('../models/instrutor');
const Frequencia = require('../models/frequencia');
const AvaliacaoCurso = require('../models/avaliacaoCurso');
const AgendaCurso = require('../models/agendaCurso');
const AgendaCursoColaborador = require('../models/agendaCursoColaborador');
const CursoController = require('../controller/CursoController');
const TipoSituacao = require('../models/tipoSituacao');
const RequisicaoCurso = require('../models/requisicaoCurso');
const express = require('express');
const app = express();
const handleBars = require('express-handlebars');
const passport = require('passport');
app.engine('handlebars', handleBars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

function dataEntrada(date) {

    return new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
}

function dataSaida(date) {

    return new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
}

module.exports = {


    async procurar(req, res) {

        let { id } = req.params;

        await Colaborador.findByPk(id, {
            include: [{
                model: Setor,
                where: {
                    setorId: req.user.setorId
                }
            }, {
                model: Cargo,
                where: {
                    cargoId: req.user.cargoId
                }
            }]
        }).then((colaborador) => {

            res.send(colaborador)

        });
    },


    async procuraAtualizar(req, res) {

        let { id } = req.params;

        await Colaborador.findByPk(id, {
            include: [Setor]
        }).then((colaborador) => {

            Setor.findAll().then((setores) => {
                res.render('editarColaborador', { colaborador: colaborador, setores: setores })
            })

        });
    },

    async login(req, res, next) {

        passport.authenticate("local", {

            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next)
    },

    async deletar(req, res) {

        let id = req.params.id;

        Colaborador.update({
            acesso: 4
        }, {
            where: {
                id
            }
        }).then((colaborador) => {
            req.flash("success_msg", "Colaborador Deletado com sucesso!");
            res.redirect('/visualizarColaborador');
        });
    },

    async sugerirCurso(req, res) {

        let { motivo, colaboradorId, nomeCurso } = req.body;

        let erros = [];

        if (motivo.length < 50) {

            erros.push({ texto: "Informe um motivo para realizar o curso com pelo menos 50 caracteres" });
        }

        if (nomeCurso.length == 0) {
            erros.push({ texto: "Informe o nome do curso sugerido" });
        }

        let data = new Date();
        data = dataEntrada(data);

        if (erros.length > 0) {
            res.render('sugerirCurso', { erros: erros });
        } else {
            SugestaoCurso.create({
                colaboradorId,
                data,
                motivo,
                nomeCurso,
                situacao: 2
            }).then((curso) => {
                req.flash("success_msg", "Curso: " + nomeCurso + " sugerido com sucesso!");
                res.redirect('/listagemSugestao');
            })
        }
    }, //fim sugerirCurso

    async listagemSugestoes(req, res) {

        let sugestoes = await sequelize.query(`select tc.nomeCurso, tc.motivo, ts.nome, tc.situacao as situacao from tipoSituacao ts, sugestaoCurso tc where tc.situacao = ts.tipoSituacaoId AND tc.colaboradorId = ${req.user.id} order by data desc;`, { type: QueryTypes.SELECT });

        res.render("sugestaoCurso", { sugestoes: sugestoes });
    }, // listagemSugestoes 

    async listagemRequisicaoCurso(req, res) {
        let requisicoes = await sequelize.query(`select c.nome as curso, rq.dataRequisicao, rq.dataAtualizacao,  rq.situacao as situacao from requisicaoCurso  rq, tipoSituacao ts, curso c where rq.situacao = ts.tipoSituacaoId  and rq.cursoId = c.cursoId and rq.colaboradorId = ${req.user.id} order by rq.dataRequisicao desc;`, { type: QueryTypes.SELECT });
        res.render("requisicoesCurso", { requisicoes: requisicoes });
    }, //fim listagemRequisicaoCurso

    async requisitarCurso(req, res) {

        let { colaboradorId, cursoId } = req.body;
        let data = new Date();
        data = dataEntrada(data);

        await RequisicaoCurso.create({
            colaboradorId,
            cursoId,
            dataRequisicao: data,
            dataAtualizacao: data,
            situacao: 2
        }).then((requisicao) => {
            req.flash("success_msg", "Requisição cadastrada com sucesso!");
            res.redirect("/listagemRequisicaoCurso");
        });
    }, //fim requisitarCurso


    async listagemCursoAtivo(req, res) {
        await Curso.findAll({
            where: {
                situacao: 1
            }
        }).then((cursos) => {
            res.render("requisitarCurso", { cursos: cursos });
        });
    }, //fim listagemCursoAtivo

    async listagemCursoEmAndamento(req, res) {
        let dataAtual = new Date();

        dataAtual = dataEntrada(dataAtual);

        await AgendaCursoColaborador.findAll({

            include: [{
                model: AgendaCurso,
                required: true,
                include: [{
                    model: Curso,
                    required: true
                }, {
                    model: Instrutor,
                    required: true,
                    include: [Colaborador]
                }, {
                    model: Gestor,
                    required: true,
                    include: [{
                        model: Colaborador,
                        required: true
                    }]
                }], //fim do include do AgendaCurso
                where: {
                    dataFinal: {
                        [Op.gte]: dataAtual
                    }
                }

            }], //fim do include do AgendaCursoColaborador
            where: {
                colaboradorId: req.user.id,
                avaliacaoCursoId: {
                    [Op.is]: null
                }
            }

        }).then((agendas) => {
            //res.send(agendas);
            let dataAtual = new Date();

            dataAtual = dataEntrada(dataAtual);
            res.render('colaboradorCursosEmAndamento', { agendas: agendas, dataAtual: dataAtual });
        });


    }, //fim listagemCursoEmAndamento

    async buscarCursoEmAndamento(req, res) {
        let { id } = req.params

        await AgendaCurso.findOne({
            include: [{
                model: Curso,
                required: true
            }, {
                model: Instrutor,
                required: true,
                include: [Colaborador]
            }, {
                model: Gestor,
                required: true,
                include: [{
                    model: Colaborador,
                    required: true
                }]
            }], //fim do include do AgendaCurso
            where: {
                id
            }
        }).then((agenda) => {
            //res.send(agenda);
            res.render('colaboradorCursoEmAndamento', { agenda: agenda });
        });

    }, //fim buscarCursoEmAndamento


    async buscarFrequenciaCursoEmAndamento(req, res) {
        let { id } = req.params;

        await AgendaCurso.findOne({
            include: [{
                model: AgendaCursoColaborador,
                required: true,
                where: {
                    agendaCursoColaboradorId: id
                }
            }, {
                model: Curso,
                required: true
            }, {
                model: Gestor,
                required: true,
                include: [Colaborador]
            }, {
                model: Instrutor,
                required: true,
                include: [Colaborador]
            }]
        }).then(async(agenda) => {
            await Frequencia.findAll({
                where: {
                    agendaCursoColaboradorId: id
                },
                order: [
                    ['dataFrequencia', 'DESC']
                ]
            }).then((frequencias) => {
                res.render('colaboradorFrequenciaCursoEmAndamento', { agenda: agenda, frequencias: frequencias });
            });
        })

    }, //fim buscarFrequenciaCursoEmAndamento

    async listagemCursoFinalizado(req, res) {
        let dataAtual = new Date();

        dataAtual = dataEntrada(dataAtual);

        await AgendaCurso.findAll({
            include: [{
                model: Curso,
                required: true
            }, {
                model: Instrutor,
                required: true,
                include: [Colaborador]
            }, {
                model: Gestor,
                required: true,
                include: [{
                    model: Colaborador,
                    required: true
                }]
            }, {
                model: AgendaCursoColaborador,
                required: true,
                include: [{
                    model: AvaliacaoCurso,
                    required: true,
                    include: [TipoAprovacao]
                }],
                where: {
                    colaboradorId: req.user.id,
                    avaliacaoCursoId: {
                        [Op.not]: null
                    }
                }
            }],
            order: [
                ['dataFinal', 'DESC']
            ]
        }).then((agendas) => {
            //res.send(agendas);
            res.render('colaboradorCursosFinalizados', { agendas: agendas });
        });

    }, // fim listagemCursoFinalizado

    async buscarCursoFinalizado(req, res) {

        let { id } = req.params;

        await AgendaCursoColaborador.findOne({

            include: [{
                model: AvaliacaoCurso,
                required: true,
                include: [TipoAprovacao]
            }, {
                model: AgendaCurso,
                required: true,
                include: [{
                    model: Curso,
                    required: true
                }, {
                    model: Instrutor,
                    required: true,
                    include: [Colaborador]
                }, {
                    model: Gestor,
                    required: true,
                    include: [{
                        model: Colaborador,
                        required: true
                    }]
                }], //fim do include do AgendaCurso

            }], //fim do include do AgendaCursoColaborador
            where: {
                colaboradorId: req.user.id,
                id: id
            }

        }).then(async(agenda) => {
            // res.send(agenda);
            let frequencia = await sequelize.query(`select round((sum(presenca)/sum(horaAula))*100,2) as presenca from frequencia where agendaCursoColaboradorId = ${agenda.dataValues.id};`, { type: QueryTypes.SELECT })
                //res.send(frequencia);
                .then(async(frequencia) => {
                    let frequencias = await sequelize.query(`select  presenca, falta, dataFrequencia,observacao, horaAula  from frequencia where agendaCursoColaboradorId = ${agenda.dataValues.id} order by dataFrequencia DESC;`, { type: QueryTypes.SELECT })
                        .then((frequencias) => {
                            //res.send(frequencias);
                            res.render('colaboradorDesempenhoCurso', { agenda: agenda, frequencia: frequencia, frequencias: frequencias });
                        })

                })

        });

    }, //fim função

    async colaboradorVerAvaliacoes(req, res) {

        let avaliacoes = await sequelize.query("select av.nota, av.autoAvaliacao, av.avaliacaoEmEquipe, av.avaliacaoTecnica, av.avaliacaoComportamental, av.observacao, av.dataAvaliacao, c.nome as gestor from avaliacaoColaborador av inner join gestor g on av.gestorId = g.gestorId inner join colaborador c on c.colaboradorId = g.colaboradorId where av.colaboradorId = " + req.user.id + " order by av.dataAvaliacao DESC;", { type: QueryTypes.SELECT });
        let medias = await sequelize.query(`select round(avg(avc.nota),2) as 'nota', round(avg(avc.avaliacaoEmEquipe),2) as 'avaliacaoEmEquipe', round(avg(avc.avaliacaoTecnica),2) as 'avaliacaoTecnica', round(avg(avc.autoAvaliacao),2) as 'autoAvaliacao', round(avg(avc.avaliacaoComportamental),2) as 'avaliacaoComportamental' from colaborador c inner join avaliacaoColaborador avc on avc.colaboradorId = c.colaboradorId where c.colaboradorId = ${req.user.id};`, { type: QueryTypes.SELECT });
        let avaliacoesAnteriores = await sequelize.query(`select round((nota + autoAvaliacao + avaliacaoEmEquipe + avaliacaoTecnica + avaliacaoComportamental)/5,2) as nota, dataAvaliacao from avaliacaoColaborador where colaboradorId = ${req.user.id} order by dataAvaliacao ASC LIMIT 5;`, { type: QueryTypes.SELECT });

        res.render('colaboradorConsultarDesempenhoPeriodico', { avaliacoes: avaliacoes, medias: medias, avaliacoesAnteriores: avaliacoesAnteriores });
    },

    async colaboradorVerCursosFinalizados(req, res) {

        let cursos = await sequelize.query(` SELECT av.nota, av.observacao, av.situacao, cu.nome, av.dataAvaliacao, frequencia FROM agendaCursoColaborador acc INNER JOIN avaliacaoCurso av ON av.avaliacaoCursoId = acc.avaliacaoCursoId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId INNER JOIN agendaCurso ac ON ac.agendaCursoId = acc.agendaCursoId INNER JOIN curso cu ON cu.cursoId = ac.cursoId INNER JOIN (select round(((sum(presenca)/sum(horaAula))*100),2) as frequencia, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId WHERE c.colaboradorId = ${req.user.id} order by av.dataAvaliacao DESC;`, { type: QueryTypes.SELECT })
            .then(async(cursos) => {
                let cursos2 = await sequelize.query(` SELECT av.nota, av.observacao, av.situacao, cu.nome, av.dataAvaliacao, frequencia FROM agendaCursoColaborador acc INNER JOIN avaliacaoCurso av ON av.avaliacaoCursoId = acc.avaliacaoCursoId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId INNER JOIN agendaCurso ac ON ac.agendaCursoId = acc.agendaCursoId INNER JOIN curso cu ON cu.cursoId = ac.cursoId INNER JOIN (select round(((sum(presenca)/sum(horaAula))*100),2) as frequencia, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId WHERE c.colaboradorId = ${req.user.id} order by av.dataAvaliacao ASC;`, { type: QueryTypes.SELECT });
                let c = cursos2.length;
                res.render('colaboradorConsultarCursosAnteriores', { cursos: cursos, cursos2: cursos2, c: c });
            })




    }
}