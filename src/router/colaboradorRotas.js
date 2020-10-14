const express = require('express');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');
const ColaboradorController = require('../controller/ColaboradorController');
const CursoController = require('../controller/CursoController');
const Setor = require('../models/setor');
const Curso = require('../models/curso');
const Cargo = require('../models/cargo');
const Colaborador = require('../models/colaborador');
const colaboradorRotas = express.Router();
const { nivelRedirect, estaLogado, nivelColaborador } = require('../helpers/acesso');

colaboradorRotas.get('/', nivelRedirect);

colaboradorRotas.get('/homeColaborador', nivelColaborador, (req, res) => {
    res.render('homeColaborador')
})

colaboradorRotas.get('/login', estaLogado, (req, res) => {
    res.render("login")
})

colaboradorRotas.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

colaboradorRotas.get('/colaborador/info/:id', async(req, res) => {
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
        res.render('info', { colaborador: colaborador })
    });
});

colaboradorRotas.get('/colaborador/cadastrar', async(req, res) => {

    await Setor.findAll().then((setores) => {

        Cargo.findAll().then((cargos) => {
            res.render('cadastroColaborador', { setores: setores, cargos: cargos })
        })

    })
})

colaboradorRotas.get('/colaboradorExclusao/:id', ColaboradorController.deletar);

colaboradorRotas.get('/login/:id', ColaboradorController.procurar);

colaboradorRotas.post('/colaborador/login', ColaboradorController.login);

//formulário de sugestao de curso
colaboradorRotas.get('/listagemSugestao', ColaboradorController.listagemSugestoes);


colaboradorRotas.get('/sugestaoCurso', (req, res) => {
    res.render('sugerirCurso');
});

colaboradorRotas.post('/cadastrarSugestao', ColaboradorController.sugerirCurso);
//fim



//Agenda

//Consultar Agenda
colaboradorRotas.get('/consultarAgenda', (req, res) => {
    res.render('colaboradorConsultarAgenda');
});

//Visualizar Curso em Andamento
colaboradorRotas.get('/visualizarCursoEmAndamento', ColaboradorController.listagemCursoEmAndamento);

//Ver mais sobre o curso em andamento
colaboradorRotas.get('/verMaisCursoEmAndamento/:id', ColaboradorController.buscarCursoEmAndamento);

//Ver frequência sobre o curso em andamento
colaboradorRotas.get('/verFrequenciaCursoEmAndamento/:id', ColaboradorController.buscarFrequenciaCursoEmAndamento);

//Visualizar Curso Finalizado
colaboradorRotas.get('/visualizarCursoFinalizado', ColaboradorController.listagemCursoFinalizado);

//Ver desempenho curso FInalizado
colaboradorRotas.get('/verDesempenhoCursoFinalizado/:id', ColaboradorController.buscarCursoFinalizado);

//fim

//formulário de requisição de curso
colaboradorRotas.get('/listagemRequisicaoCurso', ColaboradorController.listagemRequisicaoCurso);
colaboradorRotas.get('/requisitarCurso', ColaboradorController.listagemCursoAtivo);
colaboradorRotas.post('/cadastrarRequisicao', ColaboradorController.requisitarCurso);

//menu de avaliações periódicas e de curso
colaboradorRotas.get('/consultarDesempenho', (req, res) => {

    res.render('colaboradorConsultarDesempenho');
});

colaboradorRotas.get('/colaboradorVerAvaliacoes', ColaboradorController.colaboradorVerAvaliacoes);

colaboradorRotas.get('/colaboradorAvaliacoesCurso', ColaboradorController.colaboradorVerCursosFinalizados);


module.exports = colaboradorRotas;