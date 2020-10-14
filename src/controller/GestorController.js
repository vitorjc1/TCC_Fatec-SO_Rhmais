const Colaborador = require('../models/colaborador');
const Setor = require('../models/setor');
const Op = require('Sequelize').Op;
const pdf = require('html-pdf');
const Cargo = require('../models/cargo');
const Instrutor = require('../models/instrutor');
const moment = require('moment');
const Curso = require('../models/curso');
const RequisicaoCurso = require('../models/requisicaoCurso');
const AvaliacaoCurso = require('../models/avaliacaoCurso');
const CursoController = require('../controller/CursoController');
const AvaliacaoColaborador = require('../models/avaliacaoColaborador');
const SugestaoCurso = require('../models/sugestaoCurso');
const AgendaCurso = require('../models/agendaCurso');
const Frequencia = require('../models/frequencia');
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

module.exports = {

    async listagem(req, res) {

        await Colaborador.findAll({
            include: [{
                    model: Setor,
                    where: {
                        setorId: req.user.setorId
                    }
                },
                {
                    model: Cargo,

                }
            ],
            where: {
                acesso: [0, 2]
            },
            order: [
                ['nome', 'ASC'],
            ]
        }).then((colaboradores) => {
            res.render('colaboradores', { colaboradores: colaboradores })
        });
    },

    async atualizar(req, res) {

        let { nome, email, senha, acesso, cargoId, setorId } = req.body;

        let erros = [];

        if (nome.length < 3) {
            erros.push({ texto: "Informe o nome do colaborador" });
        }

        if (email.length == 0) {
            erros.push({ texto: "Informe o e-mail do colaborador" });
        }

        if (senha.length < 6) {
            erros.push({ texto: "Informe uma senha com pelo menos 6 dígitos" });
        }


        if (erros.length > 0) {
            Colaborador.findByPk(req.body.id).then((colaborador) => {
                Setor.findAll({
                    order: [
                        ['nome', 'ASC']
                    ]
                }).then((setores) => {
                    Cargo.findAll({
                        order: [
                            ['nome', 'ASC']
                        ]
                    }).then((cargos) => {
                        res.render('editarColaborador', { erros: erros, setores: setores, cargos: cargos, colaborador: colaborador });
                    })
                })
            })

        } else {
            Colaborador.update({
                nome,
                email,
                senha,
                cargoId,
                acesso: parseInt(acesso),
                setorId
            }, {
                where: {
                    id: req.body.id
                }
            }).then(() => {
                req.flash("success_msg", "Colaborador: " + nome + " alterado com sucesso!");
                res.redirect('/listarColaboradorCadastrado/' + req.body.id);
            })
        }


    },

    async buscaCargoSetor(req, res) {

        Cargo.findAll({
            order: [
                ['nome', 'ASC']
            ]
        }).then((cargos) => {
            Setor.findAll({
                order: [
                    ['nome', 'ASC']
                ]
            }).then((setores) => {
                res.render("cadastroColaborador", { cargos: cargos, setores: setores });
            })
        })
    },


    async cadastro(req, res) {

        let erros = [];

        let { nome, matricula, email, senha, cargoId, setorId, confirmarSenha } = req.body;

        let acesso = parseInt(req.body.acesso);

        Colaborador.findAll({
            where: {
                email: email
            }
        }).then((colaborador) => {

            Colaborador.findAll({
                where: {
                    matricula: matricula
                }
            }).then((colaborador2) => {

                if (colaborador2.length > 0) {
                    erros.push({ texto: "Essa matrícula já está sendo utilizada por outro colaborador" });
                }


                if (colaborador.length > 0) {
                    erros.push({ texto: "Esse e-mail já está sendo utilizado por outro colaborador" });
                }

                if (matricula <= 0 || matricula == null) {
                    erros.push({ texto: "Digite uma matricula válida" });
                }

                if (confirmarSenha != senha) {
                    erros.push({ texto: "Suas senhas devem coincidir" });
                }

                if (email.length <= 6) {
                    erros.push({ texto: "Digite um email válido" });
                }

                if (senha.length < 6 || senha.length == 0) {
                    erros.push({ texto: 'Sua senha deve possuir ao menos 6 digitos' });
                }

                if (nome.length == 0) {
                    erros.push({ texto: "Informe o nome do colaborador!" });
                }

                if (erros.length > 0) {
                    Setor.findAll({
                        order: [
                            ['nome', 'ASC']
                        ]
                    }).then((setores) => {
                        Cargo.findAll({
                            order: [
                                ['nome', 'ASC']
                            ]
                        }).then((cargos) => {
                            res.render("cadastroColaborador", { erros: erros, setores: setores, cargos: cargos, nome: nome, email: email, senha: senha, cargoId: cargoId, setorId: setorId, confirmarSenha: confirmarSenha, acesso: acesso, matricula: matricula });
                        })
                    })

                } else {

                    Colaborador.create({
                        nome,
                        matricula,
                        email,
                        senha,
                        cargoId,
                        acesso,
                        setorId
                    }).then((colaborador) => {
                        if (acesso == 1) {
                            Gestor.create({
                                colaboradorId: colaborador.dataValues.id
                            })
                        }

                        if (acesso == 2) {
                            Instrutor.create({
                                colaboradorId: colaborador.dataValues.id
                            })
                        }
                        req.flash("success_msg", "Colaborador: " + nome + " cadastrado com sucesso!");
                        res.redirect('/listarColaboradorCadastrado/' + colaborador.dataValues.id);
                    })

                }
            })

        })

    }, //fim cadastro de colaborador


    async listarColaboradorCadastrado(req, res) {
        let { id } = req.params;

        Colaborador.findAll({
            include: [{
                    model: Setor,
                    where: {
                        setorId: req.user.setorId
                    }
                },
                {
                    model: Cargo,

                }
            ],
            where: {
                id
            },
        }).then((colaboradores) => {
            res.render('colaboradores', { colaboradores: colaboradores })
        });
    }, //fim listarColaboradorCadastrado

    async buscarColaborador(req, res) {

        let { id } = req.params;

        await Colaborador.findByPk(id, {
            include: [{
                model: Setor,
            }, ]
        }).then(async(colaborador) => {
            await Setor.findAll({
                order: [
                    ['nome', 'ASC']
                ]
            }).then(async(setores) => {
                await Cargo.findAll({
                    order: [
                        ['nome', 'ASC']
                    ]
                }).then((cargos) => {
                    let op = [0, 1, 2];
                    res.render("editarColaborador", { colaborador: colaborador, cargos: cargos, setores: setores, op: op });
                })
            })
        });

    },




    async dadosCadastroAgenda(req, res) {
        let { id } = req.params;

        await Curso.findAll({
            where: {
                situacao: 1
            }
        }).then((cursos) => {
            Instrutor.findAll({
                include: [Colaborador]
            }).then((instrutores) => {
                res.render("cadastrarAgenda", { cursos: cursos, instrutores: instrutores });
            });
        })
    },

    async listagemParticipantes(req, res) {

        let { id } = req.params;

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
                    required: true,
                    where: {
                        id: req.user.id
                    }
                }]
            }, ],
            where: {
                id: id
            }
        }).then(async(agenda) => {
            await AgendaCursoColaborador.findAll({
                include: [{
                    model: AgendaCurso,
                    required: true,
                    where: {
                        id: id
                    }
                }, {
                    model: Colaborador,
                    required: true,
                    where: {
                        acesso: 0
                    }
                }]
            }).then(async(participantes) => {
                let flag = -1;
                let dataAtual = new Date();
                dataAtual = dataEntrada(dataAtual);
                let dataInicio = new Date(agenda.dataValues.dataInicio);
                dataInicio = dataEntrada(dataInicio);

                if (dataAtual > dataInicio) {
                    flag = 1;
                } else {
                    flag = 0;
                }

                let colaboradores = await sequelize.query(`select * from colaborador where acesso = 0 AND setorId = ${req.user.setorId}  AND colaboradorId not in(select colaboradorId from agendaCursoColaborador where agendaCursoColaboradorId IN (select agendaCursoColaboradorId from agendaCursoColaborador where agendaCursoId = ${id}));`, { type: QueryTypes.SELECT });
                //console.log(colaboradores);
                res.render('agendaParticipantes', { participantes: participantes, colaboradores: colaboradores, id: id, agenda: agenda, flag: flag });
            })
        });


    },

    async excluirAgenda(req, res) {
        let { id } = req.params;
        await AgendaCurso.findOne({
            where: {
                id: id
            }
        }).then((agenda) => {
            let dataInicial = new Date(agenda.dataValues.dataInicio);
            let dataAtual = new Date();

            dataInicial = dataSaida(dataInicial);

            if (dataInicial > dataAtual) {
                AgendaCurso.destroy({
                    where: {
                        id: id
                    }
                }).then(() => {
                    req.flash("success_msg", "Agenda excluída com sucesso!");
                    res.redirect('/visualizarAgenda');
                })
            } else {
                req.flash("error", "A agenda não pode ser excluída depois de iniciada");
                res.redirect('/visualizarAgenda');
            }

        })

    },

    async removerParticipantesAgenda(req, res) {

        let { exparticipantes, agendaCursoId2, id2 } = req.body;

        if (Array.isArray(exparticipantes)) {
            for (i = 0; i < exparticipantes.length; i++) {

                await AgendaCursoColaborador.destroy({
                    where: {
                        agendaCursoId: agendaCursoId2,
                        colaboradorId: exparticipantes[i]
                    }
                })
            }
        } else {

            await AgendaCursoColaborador.destroy({
                where: {
                    agendaCursoId: agendaCursoId2,
                    colaboradorId: exparticipantes
                }
            })
        }


        res.redirect(`/agenda/participante/${agendaCursoId2}`);
    },

    async adicionarParticipantesAgenda(req, res) {

        let { participantes, agendaCursoId, id } = req.body;

        let colaboradores = participantes;

        if (Array.isArray(participantes)) {
            for (i = 0; i < colaboradores.length; i++) {

                await AgendaCursoColaborador.create({

                    agendaCursoId,
                    colaboradorId: colaboradores[i]
                })
            }
        } else {
            await AgendaCursoColaborador.create({

                agendaCursoId,
                colaboradorId: colaboradores
            })

        }

        res.redirect(`/agenda/participante/${agendaCursoId}`);
    },

    async buscarAgendaAlterar(req, res) {

        let { id } = req.params;

        await AgendaCurso.findByPk(id).then((agenda) => {
            Curso.findAll({
                where: {
                    situacao: 1
                }
            }).then((cursos) => {
                Instrutor.findAll({ include: [Colaborador] }).then((instrutores) => {

                        let dataInicio = agenda.dataValues.dataInicio;
                        dataInicio = new Date(dataInicio.valueOf() + dataInicio.getTimezoneOffset() * 60000);
                        dataInicio = moment(dataInicio).format('YYYY-MM-DDTHH:mm');

                        let flag = -1;

                        let dataAtualCompara = new Date();
                        dataAtualCompara = dataSaida(dataAtualCompara);

                        let dataInicioCompara = new Date(agenda.dataValues.dataInicio);
                        dataInicioCompara = dataSaida(dataInicioCompara);

                        if (dataInicioCompara < dataAtualCompara) {

                            flag = 0;
                        } else {
                            flag = 1;
                        }

                        res.render("alterarAgenda", { agenda: agenda, cursos: cursos, instrutores: instrutores, dataInicio: dataInicio, flag: flag });
                    }

                )
            })
        })
    },


    async historicoDetalheAgenda(req, res) {

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
                    required: true
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
            let participantes = await sequelize.query(`select c.colaboradorId, av.situacao, acc.agendaCursoColaboradorId, c.nome, av.nota, av.dataAvaliacao, av.observacao, f.presenca  from  agendaCursoColaborador acc inner join colaborador c on c.colaboradorId = acc.colaboradorId inner join avaliacaoCurso av on av.avaliacaoCursoId = acc.avaliacaoCursoId inner join (select round((sum(presenca)/sum(horaAula))*100,2) as presenca, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f on f.agendaCursoColaboradorId =  acc.agendaCursoColaboradorId where acc.agendaCursoId = ${id} order by c.nome ASC;`, { type: QueryTypes.SELECT })
                .then((participantes) => {
                    //res.send(participantes);
                    res.render('gestorDetalheAgenda', { participantes: participantes, id: id, agenda: agenda });
                })
        });


    },


    async buscarPorMatricula(req, res) {

        let { matriculaId } = req.body;

        if (isNaN(parseInt(matriculaId)) == false) {

            Colaborador.findAll({
                include: [{
                        model: Cargo,
                        attributes: ['nome']
                    },
                    {
                        model: Setor,
                        attributes: ['nome']
                    }
                ],
                where: {
                    setorId: req.user.setorId,
                    acesso: [0, 2],
                    matricula: {
                        [Op.substring]: matriculaId
                    }
                },
                order: [
                    ['nome', 'ASC']
                ]
            }).then((colaborador) => {
                res.render('buscaColaborador', { colaborador: colaborador });
            })

        } else {

            Colaborador.findAll({
                include: [{
                        model: Cargo,
                        attributes: ['nome']
                    },
                    {
                        model: Setor,
                        attributes: ['nome']
                    }
                ],
                where: {
                    setorId: req.user.setorId,
                    acesso: [0, 2],
                    nome: {
                        [Op.substring]: matriculaId
                    }
                },
                order: [
                    ['nome', 'ASC']
                ]
            }).then((colaborador) => {
                res.render('buscaColaborador', { colaborador: colaborador });
            })

        }
    },

    async listagemSugestao(req, res) {

        await SugestaoCurso.findAll({
            include: [{
                model: Colaborador,
                where: {
                    setorId: req.user.setorId
                }
            }],
            where: {
                situacao: 2
            },
            order: [
                ['data', 'DESC']
            ]
        }).then((sugestoes) => {
            //console.log(sugestoes);
            res.render('sugestoes', { sugestoes: sugestoes });
        })
    },

    async listagemAgenda(req, res) {

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
                    required: true,
                    where: {
                        id: req.user.id
                    }
                }]
            }, {
                model: AgendaCursoColaborador,
            }],
            where: {
                dataFinal: {
                    [Op.gte]: dataAtual
                }
            },
            order: [
                ['dataInicio', 'DESC']
            ]

        }).then((agendas) => {
            res.render('visualizarAgenda', { agendas: agendas });
        });
    },

    async buscarAgenda(req, res) {
        let { busca } = req.body;

        let dataAtual = new Date();

        dataAtual = dataEntrada(dataAtual);


        await AgendaCurso.findAll({
            include: [{
                model: Curso,
                required: true,
                where: {
                    nome: {
                        [Op.substring]: busca
                    }
                }
            }, {
                model: Instrutor,
                required: true,
                include: [Colaborador]
            }, {
                model: Gestor,
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
            }],
            where: {
                dataFinal: {
                    [Op.gte]: dataAtual
                },
            },
            order: [
                ['dataInicio', 'DESC']
            ]

        }).then((agendas) => {
            res.render('visualizarAgenda', { agendas: agendas });
        });

    }, // fim buscarAgenda
    async listagemHistoricoAgenda(req, res) {

        let dataAtual = new Date();

        dataAtual = dataEntrada(dataAtual);
        let id = await sequelize.query(`select agendaCursoId from agendaCursoColaborador where agendaCursoId not in (select agendaCursoId from agendaCursoColaborador where avaliacaoCursoId is null) group by agendaCursoId;`, { type: QueryTypes.SELECT });
        let agendaId = [];
        for (i = 0; i < id.length; i++) {
            agendaId[i] = id[i].agendaCursoId;
        }
        //console.log(agendaId)
        //console.log(id)
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
                    required: true,
                    where: {
                        id: req.user.id
                    }
                }]
            }, ],
            where: {
                id: {
                    [Op.in]: agendaId
                }
            },
            order: [
                ['dataFinal', 'DESC']

            ]

        }).then((agendas) => {
            //res.send(agendas);
            res.render('historicoAgenda', { agendas: agendas });
        });
    }, //listagemHistoricoAgenda

    async buscarHistoricoAgenda(req, res) {
        let { busca } = req.body;
        let dataAtual = new Date();

        dataAtual = dataEntrada(dataAtual);
        let id = await sequelize.query(`select agendaCursoId from agendaCursoColaborador where agendaCursoId not in (select agendaCursoId from agendaCursoColaborador where avaliacaoCursoId is null) group by agendaCursoId;`, { type: QueryTypes.SELECT });
        let agendaId = [];
        for (i = 0; i < id.length; i++) {
            agendaId[i] = id[i].agendaCursoId;
        }
        //console.log(agendaId)
        //console.log(id)
        await AgendaCurso.findAll({
            include: [{
                model: Curso,
                required: true,
                where: {
                    nome: {
                        [Op.substring]: busca
                    }
                }
            }, {
                model: Instrutor,
                required: true,
                include: [Colaborador]
            }, {
                model: Gestor,
                required: true,
                include: [{
                    model: Colaborador,
                    required: true,
                    where: {
                        id: req.user.id
                    }
                }]
            }, ],
            where: {
                id: {
                    [Op.in]: agendaId
                }
            },
            order: [
                ['dataFinal', 'DESC']

            ]

        }).then((agendas) => {
            //res.send(agendas);
            res.render('historicoAgenda', { agendas: agendas });
        });
    }, //fim buscarHistoricoAgenda

    async aprovarSugestao(req, res) {

        let { id } = req.params;

        SugestaoCurso.update({
            situacao: 1
        }, {
            where: {
                id: id
            }
        }).then((sugestao) => {
            res.redirect('/cadastrarCurso');
        })
    },

    async negarSugestao(req, res) {

        let { id } = req.params;

        await SugestaoCurso.update({
            situacao: 0
        }, {
            where: {
                id: id
            }
        }).then(() => {
            req.flash("success_msg", "Sugestão reprovada com sucesso!");
            res.redirect('/sugestoesCursos');
        })
    },


    async cadastrarAgenda(req, res) {

        let { id } = req.params;

        let dataAtual = new Date();
        dataAtual = dataEntrada(dataAtual);


        let erros = [];

        let { instrutorId, cursoId, dataInicio, dataConclusao, local } = req.body;
        let dataConclusao2 = dataConclusao;
        let dataInicio2 = dataInicio;

        dataInicio = new Date(dataInicio);
        dataInicio = dataEntrada(dataInicio);

        dataConclusao = new Date(dataConclusao);
        dataConclusao = dataEntrada(dataConclusao);

        let acesso = parseInt(req.body.acesso);

        if (local.length < 5) {
            erros.push({ texto: "Informe um local válido" });
        }

        if (dataInicio < dataAtual) {

            erros.push({ texto: "Informe uma data de início posterior a data atual" });
        }

        if (dataConclusao <= dataInicio) {
            erros.push({ texto: "A data de conclusão não pode ser anterior a data de início" });
        }

        if (erros.length > 0) {

            await Curso.findAll({
                where: {
                    situacao: 1
                }
            }).then((cursos) => {
                Instrutor.findAll({
                    include: [Colaborador]
                }).then((instrutores) => {
                    res.render("cadastrarAgenda", { cursos: cursos, instrutores: instrutores, erros: erros, local: local, dataConclusao2: dataConclusao2, dataInicio2: dataInicio2, instrutorId: instrutorId, cursoId: cursoId });
                });
            })
        } else {
            let gestorId = await Gestor.findOne({
                where: {
                    Colaboradorid: req.user.id
                }
            });

            //função para o horário de brasília


            await AgendaCurso.create({
                gestorId: gestorId.dataValues.id,
                instrutorId,
                cursoId,
                dataInicio,
                dataFinal: dataConclusao,
                local
            }).then((agendaCurso) => {
                req.flash("success_msg", "Agenda cadastrada com sucesso!");
                //res.redirect('/visualizarAgenda');
                res.redirect("/listarAgendaCadastrada/" + agendaCurso.dataValues.id);
            });

        } //fim else


    }, /// fim da funcao cadastrarAgenda

    async listarAgendaCadastrada(req, res) {
        let { id } = req.params;


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
                    required: true,
                    where: {
                        id: req.user.id
                    }
                }]
            }, {
                model: AgendaCursoColaborador,
            }],
            where: {
                id
            }

        }).then((agendas) => {
            res.render('visualizarAgenda', { agendas: agendas });
        });
    }, //fim listarAgendaCadastrada


    async atualizarAgenda(req, res) {
        let erros = [];

        let { instrutorId, cursoId, dataInicio, dataFinal, local, agendaId } = req.body;

        let dataInicial = new Date(dataInicio);
        dataInicial = dataEntrada(dataInicial);

        let dataAtual = new Date();
        dataAtual = dataEntrada(dataAtual);

        let dataConclusao = new Date(dataFinal);
        dataConclusao = dataEntrada(dataConclusao);

        if (local.length < 5) {
            erros.push({ texto: "Informe um local válido" });
        }


        if (dataInicial >= dataConclusao) {

            erros.push({ texto: "A data de início do curso não pode ser superior a data de conclusão" })
        }

        if (erros.length > 0) {
            await AgendaCurso.findByPk(agendaId).then((agenda) => {

                Curso.findAll({
                    where: {
                        situacao: 1
                    }
                }).then((cursos) => {

                    Instrutor.findAll({ include: [Colaborador] }).then((instrutores) => {
                            res.render("alterarAgenda", { agenda: agenda, cursos: cursos, instrutores: instrutores, erros: erros });
                        }

                    )
                })
            })

        } else {

            AgendaCurso.findOne({
                where: {
                    id: agendaId
                }
            }).then((agenda) => {

                if (agenda.dataValues.dataInicio > dataAtual && dataInicial > dataAtual) {

                    AgendaCurso.update({
                        instrutorId,
                        cursoId,
                        dataInicio: dataInicial,
                        dataFinal: dataConclusao,
                        local
                    }, {
                        where: {
                            id: agendaId
                        }
                    }).then((agendaCurso) => {
                        //console.log(dataAtual);
                        //console.log(dataInicio);
                        req.flash("success_msg", "Agenda alterada com sucesso!");
                        //res.redirect('/visualizarAgenda');
                        res.redirect("/listarAgendaCadastrada/" + agendaId);
                    });
                } else {
                    AgendaCurso.update({
                        dataFinal: dataConclusao,
                        local
                    }, {
                        where: {
                            id: agendaId
                        }
                    }).then((agendaCurso) => {
                        //console.log(dataAtual);
                        //console.log(dataInicio);
                        req.flash("success_msg", "Agenda alterada com sucesso! OBS: A data de inicio, instrutor e curso não podem ser alterados devido ao curso ja ter iniciado.");
                        //res.redirect('/visualizarAgenda');
                        res.redirect("/listarAgendaCadastrada/" + agendaId);
                    });
                }
            })



        } //fim else


    }, //fim atualizarAgenda

    async listagemRequisicaoCurso(req, res) {

        await RequisicaoCurso.findAll({
            include: [{
                model: Colaborador,
                require: true,
                where: {
                    setorId: req.user.setorId
                },
            }, {
                model: Curso,
                require: true
            }],
            where: {
                situacao: 2
            },
            order: [
                ['dataRequisicao', 'DESC']
            ]
        }).then((requisicoes) => {
            res.render("visualizarRequisicao", { requisicoes: requisicoes });
        });
    }, //fim listagemRequisicaoCurso

    async listagemRequisicaoCursoAprovada(req, res) {

        await RequisicaoCurso.findAll({
            include: [{
                model: Colaborador,
                require: true,
                where: {
                    setorId: req.user.setorId
                },
            }, {
                model: Curso,
                require: true
            }],
            where: {
                situacao: 1
            },
            group: ['colaboradorId', 'cursoId'],
            order: [
                ['dataRequisicao', 'DESC']
            ]
        }).then((requisicoes) => {
            res.render("visualizarRequisicaoAprovada", { requisicoes: requisicoes });
        });

    }, //fim listagemRequisicaoCursoAprovada 

    async aprovarRequisicaoCurso(req, res) {

        let { id } = req.params;
        let dataAtualizacao = new Date();
        dataAtualizacao = dataEntrada(dataAtualizacao);

        let gestorId = await Gestor.findOne({
            where: {
                colaboradorId: req.user.id
            }
        });

        await RequisicaoCurso.update({
            dataAtualizacao,
            gestorId: gestorId.dataValues.id,
            situacao: 1
        }, {
            where: {
                id
            }
        }).then((requisicao) => {
            req.flash("success_msg", "Requisição de curso aprovada com sucesso!");
            res.redirect('/visualizarRequisicao');

        });
    }, // fim aprovarRequisicaoCurso

    async negarRequisicaoCurso(req, res) {
        let { id } = req.params

        let dataAtualizacao = new Date();
        dataAtualizacao = dataEntrada(dataAtualizacao);

        let gestorId = await Gestor.findOne({
            where: {
                colaboradorId: req.user.id
            }
        });

        await RequisicaoCurso.update({
            dataAtualizacao,
            gestorId: gestorId.dataValues.id,
            situacao: 0
        }, {
            where: {
                id
            }
        }).then((requisicao) => {
            req.flash("success_msg", "Requisição de curso recusada com sucesso!");
            res.redirect('/visualizarRequisicao');

        });
    }, // fim negarRequisicaoCurso

    async listagemColaboradoresAvaliacao(req, res) {

        await Colaborador.findAll({
            include: [{
                    model: Setor,
                    where: {
                        setorId: req.user.setorId
                    }
                }, {
                    model: AvaliacaoColaborador,
                    required: true,
                    order: [
                        ['dataAvaliacao', 'DESC']
                    ],
                    limit: 1
                },
                {
                    model: Cargo,
                }
            ],
            where: {
                acesso: 0
            },
            order: [
                ['nome', 'ASC'],
            ]
        }).then((colaboradores) => {
            //res.send(colaboradores);
            let colaboradores2 = [];
            for (i = 0; i < colaboradores.length; i++) {

                colaboradores2.push([]);
            }

            //console.log(colaboradores[0].avaliacaoColaboradors[0].dataAvaliacao);
            //console.log(colaboradores[0].dataValues.cargo.dataValues.nome);
            for (i = 0; i < colaboradores.length; i++) {
                colaboradores2[i][0] = ({ cargo: colaboradores[i].dataValues.cargo.dataValues.nome });
                colaboradores2[i][1] = ({ setor: colaboradores[i].dataValues.setor.dataValues.nome });
                colaboradores2[i][2] = ({ nome: colaboradores[i].dataValues.nome });
                if (colaboradores[i].avaliacaoColaboradors[0] != null) {
                    colaboradores2[i][3] = ({ data: colaboradores[i].avaliacaoColaboradors[0].dataAvaliacao });
                } else {
                    colaboradores2[i][3] = ({ data: "" });
                }
                colaboradores2[i][4] = ({ matricula: colaboradores[i].dataValues.matricula });
                colaboradores2[i][5] = ({ id: colaboradores[i].dataValues.id });
            }
            res.render('listagemAvaliacaoColaboradores', { colaboradores: colaboradores2 });
        });
    }, //fim listagemColaboradoresAvaliacao

    async listagemAvaliacaoColaboradorPorMatricula(req, res) {
        let { matriculaId } = req.body;
        let colaboradores;
        let erros = [];

        if (isNaN(parseInt(matriculaId)) == false) {
            colaboradores = await sequelize.query(`select c.colaboradorId as id, c.nome as nome, c.matricula as matricula, cg.nome as cargo, s.nome as setor, av.dataAvaliacao as dataAvaliacao from colaborador c inner join cargo cg on cg.cargoId = c.cargoId inner join setor s on s.setorId = c.setorId  left join (SELECT DISTINCT (ac.colaboradorId) colaboradorId, max(ac.dataAvaliacao) dataAvaliacao from avaliacaoColaborador ac GROUP BY ac.colaboradorId)  av on av.colaboradorId = c.colaboradorId where s.setorId = ${req.user.setorId} and c.matricula like  '%${matriculaId}%' and c.acesso = 0 order by c.nome ASC;`, { type: QueryTypes.SELECT });
        } else {
            colaboradores = await sequelize.query(`select c.colaboradorId as id, c.nome as nome, c.matricula as matricula, cg.nome as cargo, s.nome as setor, av.dataAvaliacao as dataAvaliacao from colaborador c inner join cargo cg on cg.cargoId = c.cargoId inner join setor s on s.setorId = c.setorId  left join (SELECT DISTINCT (ac.colaboradorId) colaboradorId, max(ac.dataAvaliacao) dataAvaliacao from avaliacaoColaborador ac GROUP BY ac.colaboradorId)  av on av.colaboradorId = c.colaboradorId where s.setorId = ${req.user.setorId} and c.nome like  '%${matriculaId}%' and c.acesso = 0 order by c.nome ASC;`, { type: QueryTypes.SELECT });
        }

        if (colaboradores == null || colaboradores == "") {
            erros.push({ texto: `Não foi encontrado nenhum colaborador com a busca por: ${matriculaId} !` });
            colaboradores = await sequelize.query(`select c.colaboradorId as id, c.nome as nome, c.matricula as matricula, cg.nome as cargo, s.nome as setor, av.dataAvaliacao as dataAvaliacao from colaborador c inner join cargo cg on cg.cargoId = c.cargoId inner join setor s on s.setorId = c.setorId  left join (SELECT DISTINCT (ac.colaboradorId) colaboradorId, max(ac.dataAvaliacao) dataAvaliacao from avaliacaoColaborador ac GROUP BY ac.colaboradorId)  av on av.colaboradorId = c.colaboradorId where s.setorId = ${req.user.setorId} order by c.nome ASC;`, { type: QueryTypes.SELECT });
            res.render('listagemAvaliacaoPorMatricula', { colaboradores: colaboradores, erros: erros });
        } else {
            //res.send(colaboradores);
            res.render('listagemAvaliacaoPorMatricula', { colaboradores: colaboradores });
        }

    }, //fim listagemAvaliacaoColaboradorPorMatricula

    async formularioAvaliacaoPeriodica(req, res) {

        let { id } = req.params;

        Colaborador.findOne({
            include: [Setor, Cargo],
            where: {
                id: id
            }
        }).then((colaborador) => {
            res.render('cadastroAvaliacaoPeriodica', { colaborador: colaborador });
        })

    },

    async avaliacaoPeriodica(req, res) {


        let dataAvaliacao = new Date();
        dataAvaliacao = dataEntrada(dataAvaliacao);
        let {
            notaGeral,
            autoAvaliacao,
            avaliacaoEmEquipe,
            avaliacaoTecnica,
            avaliacaoComportamental,
            observacao,
            colaboradorId
        } = req.body;

        let erros = []
            //console.log(notaGeral)
        if (notaGeral == null) {
            erros.push({
                texto: 'Informe a nota geral.'
            })
        }
        if (avaliacaoEmEquipe == null || avaliacaoEmEquipe == '') {
            erros.push({
                texto: 'Informe a avaliação em equipe.'
            })
        }
        if (autoAvaliacao == null || autoAvaliacao == '') {
            erros.push({
                texto: 'Informe a auto avaliação.'
            })
        }
        if (avaliacaoTecnica == null || avaliacaoTecnica == '') {
            erros.push({
                texto: 'Informe a avaliação técnica.'
            })
        }
        if (avaliacaoComportamental == null || avaliacaoComportamental == '') {
            erros.push({
                texto: 'Informe a avaliação comportamental.'
            })
        }

        if (erros.length > 0) {

            Colaborador.findOne({
                include: [Setor, Cargo],
                where: {
                    id: colaboradorId
                }
            }).then((colaborador) => {
                //res.send(req.body)
                res.render('cadastroAvaliacaoPeriodica', { colaborador: colaborador, erros: erros });

            })
        } else {




            await Gestor.findOne({
                where: {
                    colaboradorId: req.user.id
                }
            }).then(async(gestor) => {
                //res.send(req.body)
                await AvaliacaoColaborador.create({
                    gestorId: gestor.dataValues.id,
                    colaboradorId,
                    nota: notaGeral,
                    dataAvaliacao: dataAvaliacao,
                    autoAvaliacao: autoAvaliacao,
                    avaliacaoEmEquipe: avaliacaoEmEquipe,
                    avaliacaoTecnica: avaliacaoTecnica,
                    avaliacaoComportamental: avaliacaoComportamental,
                    observacao: observacao
                }).then((avaliacao) => {
                    //res.send(req.body)
                    req.flash('success_msg', 'Avaliação concluída com sucesso!')
                    res.redirect('/todasAvaliacoesPeriodicas/' + colaboradorId);
                })
            })
        }


    },

    async listagemHistoricoAvaliacaoPeriodica(req, res) {

        await Colaborador.findAll({
            include: [{
                    model: Setor,
                    where: {
                        setorId: req.user.setorId
                    }
                }, {
                    model: AvaliacaoColaborador,
                    required: true,
                    order: [
                        ['dataAvaliacao', 'DESC']
                    ],
                    limit: 1
                },
                {
                    model: Cargo,
                }
            ],
            where: {
                acesso: 0
            },
            order: [
                ['nome', 'ASC'],
            ]
        }).then((colaboradores) => {
            //res.send(colaboradores);
            let colaboradores2 = [];
            for (i = 0; i < colaboradores.length; i++) {

                colaboradores2.push([]);
            }

            //console.log(colaboradores[0].avaliacaoColaboradors[0].dataAvaliacao);
            //console.log(colaboradores[0].dataValues.cargo.dataValues.nome);
            for (i = 0; i < colaboradores.length; i++) {
                colaboradores2[i][0] = ({ cargo: colaboradores[i].dataValues.cargo.dataValues.nome });
                colaboradores2[i][1] = ({ setor: colaboradores[i].dataValues.setor.dataValues.nome });
                colaboradores2[i][2] = ({ nome: colaboradores[i].dataValues.nome });
                if (colaboradores[i].avaliacaoColaboradors[0] != null) {
                    colaboradores2[i][3] = ({ data: colaboradores[i].avaliacaoColaboradors[0].dataAvaliacao });
                } else {
                    colaboradores2[i][3] = ({ data: "" });
                }
                colaboradores2[i][4] = ({ matricula: colaboradores[i].dataValues.matricula });
                colaboradores2[i][5] = ({ id: colaboradores[i].dataValues.id });
            }
            res.render('historicoAvaliacaoPeriodica', { colaboradores: colaboradores2 });
        });
    },

    async listagemAvaliacoesColaborador(req, res) {

        let { id } = req.params;

        //let avaliacoes = await sequelize.query(`select ac.dataAvaliacao, ac.nota, ac.autoAvaliacao, ac.avaliacaoEmEquipe, ac.avaliacaoTecnica, ac.avaliacaoComportamental, ac.observacao from avaliacaoColaborador ac where colaboradorId = 4;`, { type: QueryTypes.SELECT });
        await Colaborador.findOne({
            include: [{
                model: Setor,
                required: true
            }, {
                model: Cargo,
                required: true
            }],
            where: { colaboradorId: id }
        }).then(async(colaborador) => {
            await AgendaCurso.findAll({
                include: [{
                    model: AgendaCursoColaborador,
                    required: true,
                    include: [{
                        model: AvaliacaoCurso,
                        required: true
                    }],
                    where: { colaboradorId: id }
                }, {
                    model: Curso,
                    required: true,
                    attributes: ['nome']
                }],
                order: [
                    ['dataFinal', 'DESC']
                ]
            }).then(async(avaliacoesCurso) => {
                //res.send(avaliacoesCurso);
                let mediaCurso = 0;
                if (avaliacoesCurso.length > 0) {
                    for (i = 0; i < avaliacoesCurso.length; i++) {
                        mediaCurso = mediaCurso + parseFloat(avaliacoesCurso[i].agendaCursoColaboradors[0].dataValues.avaliacaoCurso.dataValues.nota);
                    }
                    mediaCurso = (mediaCurso / avaliacoesCurso.length).toFixed(2);

                }

                await AvaliacaoColaborador.findAll({
                    where: { colaboradorId: id }
                }).then(async(avaliacoesColaborador) => {
                    //res.send(avaliacoesColaborador);
                    let mediaFinal = 0;
                    let medias = [];
                    if (avaliacoesColaborador.length > 0) {

                        medias = await sequelize.query(`select round(avg(avc.nota),2) as 'nota', round(avg(avc.avaliacaoEmEquipe),2) as 'avaliacaoEmEquipe', round(avg(avc.avaliacaoTecnica),2) as 'avaliacaoTecnica', round(avg(avc.autoAvaliacao),2) as 'autoAvaliacao', round(avg(avc.avaliacaoComportamental),2) as 'avaliacaoComportamental' from colaborador c inner join avaliacaoColaborador avc on avc.colaboradorId = c.colaboradorId where c.colaboradorId = ${id};`, { type: QueryTypes.SELECT });
                        mediaFinal = (parseFloat(medias[0].nota) + parseFloat(medias[0].autoAvaliacao) + parseFloat(medias[0].avaliacaoEmEquipe) + parseFloat(medias[0].avaliacaoComportamental) + parseFloat(medias[0].avaliacaoTecnica)) / 5;
                    }

                    let cursos = await sequelize.query(` SELECT av.nota, av.observacao, av.situacao, cu.nome, av.dataAvaliacao, frequencia FROM agendaCursoColaborador acc INNER JOIN avaliacaoCurso av ON av.avaliacaoCursoId = acc.avaliacaoCursoId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId INNER JOIN agendaCurso ac ON ac.agendaCursoId = acc.agendaCursoId INNER JOIN curso cu ON cu.cursoId = ac.cursoId INNER JOIN (select round(((sum(presenca)/sum(horaAula))*100),2) as frequencia, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId WHERE c.colaboradorId = ${id} order by av.dataAvaliacao DESC;`, { type: QueryTypes.SELECT })
                    let cursos2 = await sequelize.query(`SELECT av.nota, av.observacao, av.situacao, cu.nome, av.dataAvaliacao, frequencia FROM agendaCursoColaborador acc INNER JOIN avaliacaoCurso av ON av.avaliacaoCursoId = acc.avaliacaoCursoId INNER JOIN colaborador c ON c.colaboradorId = acc.colaboradorId INNER JOIN agendaCurso ac ON ac.agendaCursoId = acc.agendaCursoId INNER JOIN curso cu ON cu.cursoId = ac.cursoId INNER JOIN (select round(((sum(presenca)/sum(horaAula))*100),2) as frequencia, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f ON f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId WHERE c.colaboradorId = ${id} order by av.dataAvaliacao ASC;`, { type: QueryTypes.SELECT });
                    let c = cursos2.length;

                    let avaliacoesAnteriores = await sequelize.query(`select round((nota + autoAvaliacao + avaliacaoEmEquipe + avaliacaoTecnica + avaliacaoComportamental)/5,2) as nota, dataAvaliacao from avaliacaoColaborador where colaboradorId = ${id} order by dataAvaliacao ASC LIMIT 5;`, { type: QueryTypes.SELECT });
                    let valorTotal = await sequelize.query(`select round(sum(valor),2) as valorTotal from agendaCurso ac inner join curso c on ac.cursoId = c .cursoId inner join agendaCursoColaborador acc on acc.agendaCursoId = ac.agendaCursoId where acc.colaboradorId = ${id};`, { type: QueryTypes.SELECT });
                    //console.log(valorTotal);
                    valorTotal = valorTotal[0].valorTotal;
                    res.render('avaliacoesColaborador', { colaborador: colaborador, avaliacoesCurso: avaliacoesCurso, avaliacoesColaborador: avaliacoesColaborador, avaliacoesCurso: avaliacoesCurso, medias: medias, mediaFinal: mediaFinal, mediaCurso: mediaCurso, avaliacoesAnteriores: avaliacoesAnteriores, valorTotal: valorTotal, cursos: cursos, c: c, cursos2: cursos2 });
                });
            });
        });

    }, //fim listagemAvaliacoesColaborador

    async buscarHistoricoAvaliacaoPeriodica(req, res) {

        let { matriculaId } = req.body;
        let colaboradores;
        let erros = [];

        if (isNaN(parseInt(matriculaId)) == false) {
            colaboradores = await sequelize.query(`select c.colaboradorId as id, c.nome as nome, c.matricula as matricula, cg.nome as cargo, s.nome as setor, av.dataAvaliacao as dataAvaliacao from colaborador c inner join cargo cg on cg.cargoId = c.cargoId inner join setor s on s.setorId = c.setorId  left join (SELECT DISTINCT (ac.colaboradorId) colaboradorId, max(ac.dataAvaliacao) dataAvaliacao from avaliacaoColaborador ac GROUP BY ac.colaboradorId)  av on av.colaboradorId = c.colaboradorId where s.setorId = ${req.user.setorId} and c.acesso = 0 and c.matricula like  '%${matriculaId}%' order by c.nome asc;`, { type: QueryTypes.SELECT });
        } else {
            colaboradores = await sequelize.query(`select c.colaboradorId as id, c.nome as nome, c.matricula as matricula, cg.nome as cargo, s.nome as setor, av.dataAvaliacao as dataAvaliacao from colaborador c inner join cargo cg on cg.cargoId = c.cargoId inner join setor s on s.setorId = c.setorId  left join (SELECT DISTINCT (ac.colaboradorId) colaboradorId, max(ac.dataAvaliacao) dataAvaliacao from avaliacaoColaborador ac GROUP BY ac.colaboradorId)  av on av.colaboradorId = c.colaboradorId where s.setorId = ${req.user.setorId} and c.acesso = 0 and c.nome like  '%${matriculaId}%' order by c.nome asc;`, { type: QueryTypes.SELECT });
        }

        if (colaboradores == null || colaboradores == "") {
            erros.push({ texto: `Não foi encontrado nenhum colaborador com a busca por: ${matriculaId} !` });
            colaboradores = await sequelize.query(`select c.colaboradorId as id, c.nome as nome, c.matricula as matricula, cg.nome as cargo, s.nome as setor, av.dataAvaliacao as dataAvaliacao from colaborador c inner join cargo cg on cg.cargoId = c.cargoId inner join setor s on s.setorId = c.setorId  left join (SELECT DISTINCT (ac.colaboradorId) colaboradorId, max(ac.dataAvaliacao) dataAvaliacao from avaliacaoColaborador ac GROUP BY ac.colaboradorId)  av on av.colaboradorId = c.colaboradorId where s.setorId = ${req.user.setorId} and c.acesso = 0 order by c.nome asc;`, { type: QueryTypes.SELECT });
            res.render('buscaHistoricoAvaliacaoPeriodica', { colaboradores: colaboradores, erros: erros });
        } else {
            res.render('buscaHistoricoAvaliacaoPeriodica', { colaboradores: colaboradores });
        } // fim buscaHistoricoAvaliacaoPeriodica
    },

    async listagemAvaliacoesPeriodicas(req, res) {
        let { id } = req.params;

        await Colaborador.findOne({
            include: [{
                model: Setor,
                required: true
            }, {
                model: Cargo,
                required: true,
            }],
            where: {
                id
            }
        }).then(async(colaborador) => {
            let avaliacoes = await sequelize.query(`select *, round((nota+autoAvaliacao+avaliacaoEmEquipe+avaliacaoTecnica+avaliacaoComportamental)/5,2) as media from avaliacaoColaborador where colaboradorId = ${id} order by dataAvaliacao DESC;`, { type: QueryTypes.SELECT })
                .then((avaliacoes) => {
                    //res.send(avaliacoes);
                    res.render('gestorAvaliacoesPeriodicas', { colaborador: colaborador, avaliacoes: avaliacoes })
                });
        });
    }, // fim listagemAvaliacoesPeriodicas

    async listagemAvaliacoesCursos(req, res) {
        let { id } = req.params;

        await Colaborador.findOne({
            include: [{
                model: Setor,
                required: true
            }, {
                model: Cargo,
                required: true,
            }],
            where: {
                id
            }
        }).then(async(colaborador) => {
            let avaliacoes = await sequelize.query(`select acc.colaboradorId, c.nome, a.dataAvaliacao, a.nota, a.observacao , f.presenca,ap.nome as situacao ,acc.agendaCursoColaboradorId as agendaCursoColaboradorId from agendaCursoColaborador acc inner join avaliacaoCurso a on  a.avaliacaoCursoId = acc.avaliacaoCursoId inner join tipoAprovacao ap on ap.tipoAprovacaoId = a.situacao inner join agendaCurso ac on ac.agendaCursoId = acc.agendaCursoId inner join curso c on c.cursoId = ac.cursoId inner join (select ( round((sum(presenca)/sum(horaAula)*100),2))  as presenca, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f on f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId where acc.avaliacaoCursoId is not null and acc.colaboradorId = ${id} order by dataAvaliacao desc;`, { type: QueryTypes.SELECT })
                //res.send(avaliacoes);
            res.render('gestorAvaliacoesCursos', { colaborador: colaborador, avaliacoes: avaliacoes });
        });
    }, //fim listagemAvaliaçõesCursos

    async detalheAvaliacaoCurso(req, res) {
        let { id, colaboradorId, op } = req.params;
        let troca;

        await Colaborador.findOne({
            include: [{
                model: Setor,
                required: true
            }, {
                model: Cargo,
                required: true,
            }],
            where: {
                id: colaboradorId
            }
        }).then(async(colaborador) => {
            if (op == 1) {
                troca = true //volta para a tela de histórico de avaliações cursos
            } else {
                troca = false // volta para a tela de histórico de agendas
            }
            let avaliacoes = await sequelize.query(`select acc.agendaCursoId, acc.colaboradorId, c.nome, a.dataAvaliacao, a.nota, a.observacao , f.presenca,ap.nome as situacao ,acc.agendaCursoColaboradorId as agendaCursoColaboradorId from agendaCursoColaborador acc inner join avaliacaoCurso a on  a.avaliacaoCursoId = acc.avaliacaoCursoId inner join tipoAprovacao ap on ap.tipoAprovacaoId = a.situacao inner join agendaCurso ac on ac.agendaCursoId = acc.agendaCursoId inner join curso c on c.cursoId = ac.cursoId inner join (select ( round((sum(presenca)/sum(horaAula)*100),2))  as presenca, agendaCursoColaboradorId from frequencia group by agendaCursoColaboradorId) f on f.agendaCursoColaboradorId = acc.agendaCursoColaboradorId where acc.avaliacaoCursoId is not null and acc.colaboradorId = ${colaboradorId} and acc.agendaCursoColaboradorId = ${id} order by dataAvaliacao desc;`, { type: QueryTypes.SELECT })
            let curso = await sequelize.query(`select c.nome, c.cargaHoraria, ac.dataInicio, ac.dataFinal, ac.local, co.nome as instrutor  from curso c, agendaCursoColaborador acc, agendaCurso ac, instrutor i, colaborador co where c.cursoId = ac.cursoId and ac.agendaCursoId = acc.agendaCursoId and ac.instrutorId = i.instrutorId and co.colaboradorId = i.colaboradorId  and acc.agendaCursoColaboradorId = ${id};`, { type: QueryTypes.SELECT });
            let frequencia = await sequelize.query(`select f.presenca, f.falta, f.dataFrequencia, f.observacao, f.horaAula from frequencia f inner join agendaCursoColaborador acc on acc.agendaCursoColaboradorId = f.agendaCursoColaboradorId where acc.agendaCursoColaboradorId = ${id};`, { type: QueryTypes.SELECT });
            curso = curso[0];
            avaliacoes = avaliacoes[0];

            //res.send(curso);
            res.render('gestorDetalheAvaliacaoCurso', { colaborador: colaborador, avaliacoes: avaliacoes, curso: curso, frequencia: frequencia, troca: troca });
        });

    }

}