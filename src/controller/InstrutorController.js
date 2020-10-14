const Colaborador = require('../models/colaborador');
const Setor = require('../models/setor');
const Op = require('Sequelize').Op;
const Cargo = require('../models/cargo');
const Instrutor = require('../models/instrutor');
const AvaliacaoCurso = require('../models/avaliacaoCurso');
const Frequencia = require('../models/frequencia');
const Curso = require('../models/curso');
const RequisicaoCurso = require('../models/requisicaoCurso');
const CursoController = require('../controller/CursoController');
const SugestaoCurso = require('../models/sugestaoCurso');
const AgendaCurso = require('../models/agendaCurso');
const Gestor = require('../models/gestor');
const AgendaCursoColaborador = require('../models/agendaCursoColaborador');
const express = require('express');
const app = express();
const sequelize = require('../config/db');
const { QueryTypes } = require('sequelize');
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

function FormataStringData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    let x = ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);

    return new Date(x);
}

module.exports = {

    async listagemDeAvaliacao(req, res) {

        await Instrutor.findOne({
            where: {
                colaboradorId: req.user.id
            }
        }).then(async(instrutor) => {
            let agendas = await sequelize.query(`SELECT distinct ac.agendaCursoId, ac.dataInicio, ac.dataFinal, c.nome as curso, c.cargaHoraria, ac.local, IF(SUM(f.horaAula) = c.cargaHoraria, TRUE, FALSE) AS situacao FROM agendaCursoColaborador acc INNER JOIN agendaCurso ac ON acc.agendaCursoId = ac.agendaCursoId left JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId INNER JOIN curso c ON c.cursoId = ac.cursoId where ac.instrutorId = ${instrutor.dataValues.id} and acc.avaliacaoCursoId is null and ac.dataInicio < date_sub(now(), INTERVAL -4 hour) GROUP BY acc.agendaCursoColaboradorId;`, { type: QueryTypes.SELECT })
                .then((agendas) => {

                    //res.send(agendas);
                    res.render('instrutorListagemAgenda', { agendas: agendas });
                })
        })

    }, //fim listagemDeAvaliacao

    async historicoAgenda(req, res) {
        let dataAtual = new Date();

        dataAtual = dataEntrada(dataAtual);
        await Instrutor.findOne({
            include: [{
                model: Colaborador,
                required: true
            }],
            where: {
                colaboradorId: req.user.id
            }
        }).then(async(instrutor) => {
            await AgendaCurso.findAll({
                include: [{
                        model: Curso,
                        required: true
                    },
                    {
                        model: Instrutor,
                        required: true,
                        include: [{
                            model: Colaborador,
                            required: true,
                            where: {
                                id: req.user.id
                            }
                        }]
                    }, {
                        model: AgendaCursoColaborador,
                        required: true,
                        where: {
                            avaliacaoCursoId: {
                                [Op.not]: null
                            },
                        }
                    }
                ],
                where: {
                    instrutorId: instrutor.dataValues.id,
                }
            }).then((agendas) => {
                console.log(instrutor)
                res.render('instrutorHistoricoAgenda', { agendas: agendas });
            })
        })
    },

    async detalheAgenda(req, res) {

        let { id } = req.params;

        await AgendaCurso.findOne({
            include: [{
                model: Curso,
                required: true
            }, {
                model: Instrutor,
                required: true,
                include: [{
                    model: Colaborador,
                    required: true,
                    where: {
                        id: req.user.id
                    }
                }]
            }, {
                model: Gestor,
                required: true,
                include: [Colaborador]
            }],
            where: {
                id: id
            }

        }).then(async(agenda) => {

            let avaliacoes = await sequelize.query(`SELECT acc.agendaCursoColaboradorId, c.nome, av.nota, av.observacao, round(SUM(presenca)/SUM(horaAula) * 100,2) as porcentagem, ts.nome as situacao FROM agendaCursoColaborador acc INNER JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId INNER JOIN avaliacaoCurso av ON av.avaliacaoCursoId = acc.avaliacaoCursoId INNER JOIN tipoAprovacao ts ON ts.tipoAprovacaoId = av.situacao WHERE acc.agendaCursoId = ${id} GROUP BY acc.agendaCursoColaboradorId;`, { type: QueryTypes.SELECT });

            res.render('instrutorDetalheAgenda', { avaliacoes: avaliacoes, id: id, agenda: agenda });

        });

    },

    async buscarAvaliacaoCurso(req, res) {

        let { id } = req.params;

        await Instrutor.findOne({
            where: {
                colaboradorId: req.user.id
            }
        }).then(async(instrutor) => {
            await AgendaCurso.findOne({
                include: [Curso],
                where: {
                    id,
                    instrutorId: instrutor.dataValues.id
                }
            }).then(async(agenda) => {

                let flag = -1;
                let dataAtual = new Date();
                dataAtual = dataEntrada(dataAtual);
                let dataFinal = new Date(agenda.dataValues.dataFinal);
                dataFinal = dataEntrada(dataFinal);

                let horaTotalCurso = await sequelize.query(`SELECT SUM(horaAula) AS horaAula FROM agendaCursoColaborador acc INNER JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId WHERE acc.agendaCursoId = ${agenda.dataValues.id} AND acc.avaliacaoCursoId is null GROUP BY acc.agendaCursoColaboradorId LIMIT 1;`, { type: QueryTypes.SELECT });
                horaTotalCurso = horaTotalCurso[0];
                horaTotalCurso = parseInt(horaTotalCurso.horaAula);

                //res.send(agenda.dataValues.curso.dataValues);

                if (horaTotalCurso == agenda.dataValues.curso.dataValues.cargaHoraria) {
                    flag = 1;
                } else {
                    flag = 0;
                }

                let avaliacoes = await sequelize.query(`SELECT SUM(presenca) as presenca, SUM(horaAula) AS qtd, acc.agendaCursoColaboradorId, c.nome FROM agendaCursoColaborador acc INNER JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId WHERE acc.agendaCursoId = ${id} AND acc.avaliacaoCursoId is null GROUP BY acc.agendaCursoColaboradorId;`, { type: QueryTypes.SELECT });
                let frequencias = [];

                for (i = 0; i < avaliacoes.length; i++) {

                    let porcentagem = (avaliacoes[i].presenca / avaliacoes[i].qtd) * 100;

                    frequencias.push({ id: avaliacoes[i].agendaCursoColaboradorId, nome: avaliacoes[i].nome, porcentagem: porcentagem });
                }

                res.render("instrutorAvaliacaoCurso", { instrutor: instrutor, agenda: agenda, frequencias: frequencias, flag: flag });
            })
        })
    }, // fim buscarAvaliacaCurso

    async avaliarColaborador(req, res) {

        let { curso, idAgenda, nota, observacao } = req.body;
        const { idAgendaCursoColaborador } = req.body;
        let situacao = 0;
        let colaboradores = 0;

        let dataAtual = new Date();
        dataAtual = dataEntrada(dataAtual);

        if (Array.isArray(idAgendaCursoColaborador)) {
            for (i = 0; i < idAgendaCursoColaborador.length; i++) {
                if ((nota[i] == "" || nota[i] == null)) {} else {
                    if (nota[i] >= 5) {
                        situacao = 1;
                    } else {
                        situacao = 0;
                    }
                    await AvaliacaoCurso.create({
                        nota: nota[i],
                        observacao: observacao[i],
                        situacao,
                        dataAvaliacao: dataAtual
                    }).then(async(avaliacao) => {
                        colaboradores++;
                        await AgendaCursoColaborador.update({
                            avaliacaoCursoId: avaliacao.dataValues.id
                        }, {
                            where: {
                                id: idAgendaCursoColaborador[i]
                            }
                        });
                    });

                }
            } //fim for
        } else {
            if ((nota == "" || nota == null)) {

            } else {
                if (nota >= 5) {
                    situacao = 1;
                } else {
                    situacao = 0;
                }
                await AvaliacaoCurso.create({
                    nota,
                    observacao,
                    situacao,
                    dataAvaliacao: dataAtual
                }).then(async(avaliacao) => {
                    colaboradores++;
                    await AgendaCursoColaborador.update({
                        avaliacaoCursoId: avaliacao.dataValues.id
                    }, {
                        where: {
                            id: idAgendaCursoColaborador
                        }
                    });
                });

            }
        } //fim else 

        if (colaboradores > 0) {
            if (colaboradores == 1) {
                req.flash("success_msg", `Curso:  ${curso},  ${colaboradores} colaborador avaliado com sucesso!`);
                res.redirect('/avaliarCurso');
            } else {
                req.flash("success_msg", `Curso:  ${curso},  ${colaboradores} colaboradores avaliados com sucesso!`);
                res.redirect('/avaliarCurso');
            }
        } else {
            console.log("entrou aqui");
            req.flash("success_msg", `Curso:  ${curso},  nenhum colaborador foi avaliado neste curso!\n Para avaliar algum colaborador necessário preencher os campos (nota, prenseça e observação)!`);
            res.redirect('/avaliarCurso');
        }

    }, //fim avaliarColaborador


    async formularioDeFrequencia(req, res) {
        let { id } = req.params;

        await AgendaCurso.findOne({
            include: [{
                model: Curso,
                required: true
            }, {
                model: Instrutor,
                required: true,
                include: [{
                    model: Colaborador,
                    required: true,
                }]
            }, {
                model: AgendaCursoColaborador,
                required: true,
                include: [Colaborador]
            }],
            where: {
                id: id
            }

        }).then(async(agenda) => {

            let qtdfrequencia = await sequelize.query(`SELECT SUM(horaAula) AS qtd FROM agendaCursoColaborador acc INNER JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId WHERE acc.agendaCursoId = ${id} GROUP BY acc.agendaCursoColaboradorId LIMIT 1;`, { type: QueryTypes.SELECT });
            if (qtdfrequencia.length > 0) {
                qtdfrequencia = qtdfrequencia[0].qtd;
            } else {
                qtdfrequencia = 0;
            }

            let horasRestantes = parseInt(agenda.dataValues.curso.dataValues.cargaHoraria) - parseInt(qtdfrequencia);

            res.render('instrutorAdicionarFrequencia', { agenda: agenda, horasRestantes: horasRestantes, qtdfrequencia: qtdfrequencia });
        })
    }, //fim formularioDeFrequencia

    async adicionarFrenquencia(req, res) {
        let erros = [];
        let colaboradores = 0;
        let { curso, agendaId, dataFrequencia, horaAula, presenca, observacao, cargaHoraria } = req.body;
        const { agendaCursoColaboradorId } = req.body;

        dataFrequencia = FormataStringData(dataFrequencia.toString());
        console.log(dataFrequencia);

        if (Array.isArray(agendaCursoColaboradorId)) {
            for (i = 0; i < agendaCursoColaboradorId.length; i++) {
                presenca[i] = parseInt(presenca[i], 10);
            }
        } else {
            presenca = parseInt(presenca, 10);
        }

        let qtdfrequencia = await sequelize.query(`select  sum(horaAula) as qtd from agendaCursoColaborador acc inner join frequencia f 	on f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId where acc.agendaCursoColaboradorId = ${agendaCursoColaboradorId[0]} group by acc.agendaCursoColaboradorId;`, { type: QueryTypes.SELECT });
        if (qtdfrequencia.length > 0) {
            console.log(qtdfrequencia[0].qtd);
            if ((parseInt(qtdfrequencia[0].qtd) + parseInt(horaAula)) > cargaHoraria) {
                erros.push({ texto: `A quantidade de horas ministrada escolhida para o campo: Hora Aula, ultrapassa a carga horária do curso: ${curso}!` });
            }
        }

        if (Array.isArray(agendaCursoColaboradorId)) {
            for (i = 0; i < agendaCursoColaboradorId.length; i++) {
                if ((presenca[i]) > horaAula) {
                    erros.push({ texto: "Algum colaborador possui o campo presença maior que o campo: Hora Aula!" });
                    break;
                }
            }
        } else {
            if ((presenca) > horaAula) {
                erros.push({ texto: "Algum colaborador possui o campo presença maior que o campo: Hora Aula!" });
            }
        }

        if (erros.length > 0) {

            await AgendaCurso.findOne({
                include: [{
                    model: Curso,
                    required: true
                }, {
                    model: Instrutor,
                    required: true,
                    include: [{
                        model: Colaborador,
                        required: true,
                    }]
                }, {
                    model: AgendaCursoColaborador,
                    required: true,
                    include: [Colaborador]
                }],
                where: {
                    id: agendaId
                }

            }).then(async(agenda) => {

                let qtdfrequencia = await sequelize.query(`SELECT SUM(horaAula) AS qtd FROM agendaCursoColaborador acc INNER JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId WHERE acc.agendaCursoId = ${agenda.dataValues.id} GROUP BY acc.agendaCursoColaboradorId LIMIT 1;`, { type: QueryTypes.SELECT });
                if (qtdfrequencia.length > 0) {
                    qtdfrequencia = qtdfrequencia[0].qtd;
                } else {
                    qtdfrequencia = 0;
                }

                let horasRestantes = parseInt(agenda.dataValues.curso.dataValues.cargaHoraria) - parseInt(qtdfrequencia);
                res.render('instrutorAdicionarFrequencia', { agenda: agenda, erros: erros, horasRestantes: horasRestantes, qtdfrequencia: qtdfrequencia });
            });
        } else {

            if (Array.isArray(agendaCursoColaboradorId)) {
                for (i = 0; i < agendaCursoColaboradorId.length; i++) {
                    let faltas = horaAula - presenca[i];
                    await Frequencia.create({
                        presenca: presenca[i],
                        falta: faltas,
                        dataFrequencia,
                        observacao: observacao[i],
                        horaAula,
                        agendaCursoColaboradorId: agendaCursoColaboradorId[i]
                    }).then(() => {
                        colaboradores++;
                    }).catch((err) => {
                        res.send(err);
                    });

                }
            } else {
                let faltas = horaAula - presenca;
                await Frequencia.create({
                    presenca: presenca,
                    falta: faltas,
                    dataFrequencia,
                    observacao,
                    horaAula,
                    agendaCursoColaboradorId: agendaCursoColaboradorId
                }).then(() => {
                    colaboradores++;
                })

            }

            if (colaboradores == 1) {
                req.flash("success_msg", `Curso:  ${curso}  foi registrado a frequência de ${colaboradores} colaborador!`);
                res.redirect('/avaliarCurso');
            } else {
                req.flash("success_msg", `Curso:  ${curso}  foi registrado a frequência de ${colaboradores} colaboradores !`);
                res.redirect('/avaliarCurso');
            }

        } // fim else 



    }, // fim adicionarFrenquencia

    async frequenciasRegistradas(req, res) {

        let { id } = req.params;

        let chamadas = await sequelize.query(`select * from frequencia f inner join agendaCursoColaborador ac ON ac.agendaCursoColaboradorId = f.agendaCursoColaboradorId where ac.agendaCursoId = ${id} group by f.dataFrequencia order by f.dataFrequencia DESC;`, { type: QueryTypes.SELECT });

        // res.send(chamadas);
        res.render('instrutorFrequenciasRegistradas', { chamadas: chamadas, id: id });
    },

    async alterarFrequencia(req, res) {

        let { frequenciaId, id } = req.params;

        let presencas = await sequelize.query(`select * from frequencia f inner join agendaCursoColaborador ac ON ac.agendaCursoColaboradorId = f.agendaCursoColaboradorId INNER JOIN colaborador c ON ac.colaboradorId = c.colaboradorId where ac.agendaCursoId = ${id} AND f.dataFrequencia = (select dataFrequencia from frequencia where frequenciaId = ${frequenciaId});`, { type: QueryTypes.SELECT });

        let curso = await sequelize.query(`select c.cargaHoraria, c.nome from agendaCurso ac INNER JOIN curso c WHERE ac.cursoId = c.cursoId AND ac.agendaCursoId = ${id};`, { type: QueryTypes.SELECT });

        //res.send(curso);
        res.render('instrutorEditarFrequencia', { presencas: presencas, curso: curso });
    },

    async editarFrequencia(req, res) {
        let idFrequencia;
        let erros = [];
        let { frequenciaId, observacao, horaAulas, presenca, agendaId } = req.body;

        if (Array.isArray(frequenciaId)) {
            for (i = 0; i < frequenciaId.length; i++) {

                if ((parseInt(presenca[i])) > parseInt(horaAulas)) {
                    erros.push({ texto: "Algum colaborador possui o campo presença maior que o campo aulas" });
                    break;
                }
            }
        } else {
            if (parseInt(presenca) > parseInt(horaAulas)) {
                erros.push({ texto: "Algum colaborador possui o campo presença maior que o campo aulas" });
            }
        }

        if (erros.length > 0) {

            if (Array.isArray(frequenciaId)) {

                idFrequencia = frequenciaId[0];
            } else {

                idFrequencia = frequenciaId;
            }

            let presencas = await sequelize.query(`select * from frequencia f inner join agendaCursoColaborador ac ON ac.agendaCursoColaboradorId = f.agendaCursoColaboradorId INNER JOIN colaborador c ON ac.colaboradorId = c.colaboradorId where ac.agendaCursoId = ${agendaId} AND f.dataFrequencia = (select dataFrequencia from frequencia where frequenciaId = ${idFrequencia});`, { type: QueryTypes.SELECT });

            let curso = await sequelize.query(`select c.cargaHoraria, c.nome from agendaCurso ac INNER JOIN curso c WHERE ac.cursoId = c.cursoId AND ac.agendaCursoId = ${agendaId};`, { type: QueryTypes.SELECT });

            res.render('instrutorEditarFrequencia', { presencas: presencas, curso: curso, erros: erros });

        } else {

            if (Array.isArray(frequenciaId)) {

                for (i = 0; i < frequenciaId.length; i++) {
                    let faltas = horaAulas - presenca[i];
                    await Frequencia.update({
                        falta: faltas,
                        presenca: presenca[i],
                        observacao: observacao[i]
                    }, {
                        where: {
                            id: frequenciaId[i]
                        }
                    }).then(() => {
                        req.flash("success_msg", "Chamada alterada com sucesso!");
                        res.redirect(`/avaliacao/frequenciasRegistradas/${agendaId}`);
                    })
                }

            } else {
                let faltas = horaAulas - presenca;
                await Frequencia.update({
                    falta: faltas,
                    presenca: presenca,
                    observacao: observacao
                }, {
                    where: {
                        id: frequenciaId
                    }
                }).then(() => {
                    req.flash("success_msg", "Chamada alterada com sucesso!");
                    res.redirect(`/avaliacao/frequenciasRegistradas/${agendaId}`);
                })

            }

        }

    }, //fim função editarFrequencia

    async buscarAvaliacaoFeita(req, res) {

        let { id } = req.params;

        let avaliacao = await sequelize.query(`SELECT acc.agendaCursoId, acc.agendaCursoColaboradorId, c.nome, av.nota, av.observacao, round(SUM(presenca)/SUM(horaAula) * 100,2) as porcentagem, ts.nome as situacao, av.avaliacaoCursoId FROM agendaCursoColaborador acc INNER JOIN frequencia f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId INNER JOIN avaliacaoCurso av ON av.avaliacaoCursoId = acc.avaliacaoCursoId INNER JOIN tipoAprovacao ts ON ts.tipoAprovacaoId = av.situacao WHERE acc.agendaCursoColaboradorId = ${id} GROUP BY acc.agendaCursoColaboradorId;`, { type: QueryTypes.SELECT });
        avaliacao = avaliacao[0]
        let curso = await sequelize.query(`SELECT ac.local, c.nome, ac.dataInicio, ac.dataFinal, ac.agendaCursoId FROM agendaCurso ac INNER JOIN curso c on ac.cursoId = c.cursoId inner join agendaCursoColaborador acc on acc.agendaCursoId = ac.agendaCursoId AND acc.agendaCursoColaboradorId = ${id} limit 1;`, { type: QueryTypes.SELECT });
        curso = curso[0]
        res.render('instrutorEditarAvaliacao', { avaliacao: avaliacao, curso: curso });

    },

    async alterarAvaliacaoColaborador(req, res) {

        let { idAvaliacao, nota, observacao, idAgendaCurso } = req.body;
        let situacao = 0;
        let dataAtual = new Date();
        dataAtual = dataEntrada(dataAtual);

        if (parseInt(nota) >= 5) {
            situacao = 1;
        } else {
            situacao = 0;
        }

        await AvaliacaoCurso.update({
            nota: nota,
            observacao: observacao,
            situacao: situacao,
            dataAvaliacao: dataAtual
        }, {
            where: {
                id: idAvaliacao
            }
        }).then((avaliacao) => {
            req.flash('success_msg', 'Avaliação alterada com sucesso!');
            res.redirect(`/historico/agenda/${idAgendaCurso}`);
        })
    }

}