const express = require('express');
const gestorRotas = express.Router();
const CursoController = require('../controller/CursoController');
const GestorController = require('../controller/GestorController');
const ColaboradorController = require('../controller/ColaboradorController');
const { nivelRedirect, nivelGestor, estaLogado, logado } = require('../helpers/acesso');

gestorRotas.get("/homeGestor", nivelGestor, (req, res) => {
    res.render('homeGestor');
});

//rota Gerenciar colaborador
gestorRotas.get('/gerenciarColaborador', nivelGestor, (req, res) => {
    res.render("gerenciarColaboradores");
});

//listagem de colaboradores
gestorRotas.get('/visualizarColaborador', nivelGestor, GestorController.listagem);

//rota Gerenciar agenda
gestorRotas.get('/gerenciarAgenda', nivelGestor, (req, res) => {
    res.render('gerenciarAgenda')
});

//rota atualizar Agenda
gestorRotas.post('/agenda/atualizar', nivelGestor, GestorController.atualizarAgenda);

// buscar agenda
gestorRotas.get('/agenda/alterar/:id', nivelGestor, GestorController.buscarAgendaAlterar);

//listagem de agenda
gestorRotas.get('/visualizarAgenda', nivelGestor, GestorController.listagemAgenda);

//listar agenda cadastrada
gestorRotas.get('/listarAgendaCadastrada/:id', nivelGestor, GestorController.listarAgendaCadastrada);

//busca de agendas

gestorRotas.post('/buscarAgenda', nivelGestor, GestorController.buscarAgenda);


// formulário de cadastro de  agenda
gestorRotas.get('/cadastrarAgenda', nivelGestor, GestorController.dadosCadastroAgenda);

// Cadastrando uma nova agenda
gestorRotas.post('/cadastrar/novaAgenda', nivelGestor, GestorController.cadastrarAgenda);

//historico de agendas
gestorRotas.get('/historicoAgenda', nivelGestor, GestorController.listagemHistoricoAgenda);

//buscar histórico de agendas
gestorRotas.post('/buscarHistoricoAgenda', nivelGestor, GestorController.buscarHistoricoAgenda);

gestorRotas.get('/historicoAgenda/detalhe/:id', GestorController.historicoDetalheAgenda);

// Visualizar requisicao de curso
gestorRotas.get('/visualizarRequisicao', nivelGestor, GestorController.listagemRequisicaoCurso);

// Visualizar requisicao de curso aprovadas
gestorRotas.get('/visualizar/requisicaoAprovada', nivelGestor, GestorController.listagemRequisicaoCursoAprovada);

//Aprovar requisição de curso
gestorRotas.get('/requisicao/aprovar/:id', nivelGestor, GestorController.aprovarRequisicaoCurso);

//Negar requisição de curso
gestorRotas.get('/requisicao/negar/:id', nivelGestor, GestorController.negarRequisicaoCurso);

// Agenda participantes
gestorRotas.get('/agenda/participante/:id', nivelGestor, GestorController.listagemParticipantes);

//formulário de alteração de colaborador
gestorRotas.get('/colaborador/alterar/:id', nivelGestor, GestorController.buscarColaborador);

//Deletar agenda
gestorRotas.get('/agenda/deletar/:id', nivelGestor, GestorController.excluirAgenda);

//atualiza colaborador
gestorRotas.post('/colaborador/atualizacao', nivelGestor, GestorController.atualizar);

//formulário de cadastro de colaborador
gestorRotas.get("/cadastrarColaborador", nivelGestor, GestorController.buscaCargoSetor);

//cadastra colaborador
gestorRotas.post("/colaborador/cadastro", nivelGestor, GestorController.cadastro);

//lista apenas o colaborador cadastrado.
gestorRotas.get("/listarColaboradorCadastrado/:id", nivelGestor, GestorController.listarColaboradorCadastrado);

//adicionar participantes na agenda
gestorRotas.post('/agenda/adicionarParticipantes', nivelGestor, GestorController.adicionarParticipantesAgenda);

//remover participantes da agenda
gestorRotas.post('/agenda/excluirParticipantes', nivelGestor, GestorController.removerParticipantesAgenda)

//listagem de sugestoes
gestorRotas.get('/sugestoesCursos', nivelGestor, GestorController.listagemSugestao);

//rota Gerenciar Curso
gestorRotas.get('/gerenciarCurso', nivelGestor, (req, res) => {
    res.render("gerenciarCursos");
});

//buscar por matricula
gestorRotas.post('/buscarMatricula', nivelGestor, GestorController.buscarPorMatricula);

gestorRotas.get('/listarCursoCadastrado/:id', nivelGestor, CursoController.listarCursoCadastrado);

gestorRotas.get('/visualizarCurso', nivelGestor, CursoController.listagem);
gestorRotas.get('/curso/alterar/:id', nivelGestor, CursoController.procurar);
gestorRotas.post('/curso/atualizacao', nivelGestor, CursoController.atualizar);

//aprovar sugestao de curso
gestorRotas.get('/aprovarSugestao/:id', nivelGestor, GestorController.aprovarSugestao);

//buscar cursos
gestorRotas.post('/buscarCurso', nivelGestor, CursoController.buscarCurso);

//negar sugestão de curso
gestorRotas.get('/negarSugestao/:id', nivelGestor, GestorController.negarSugestao);

//Menu de gerenciar avaliação
gestorRotas.get('/gerenciarAvaliacao', nivelGestor, (req, res) => {
    res.render("gestorGerenciarAvaliacao");
});

//Lista os colaboradores a ser avaliados
gestorRotas.get('/cadastrarAvaliacaoPeriodica', nivelGestor, GestorController.listagemColaboradoresAvaliacao);

//listar o resultado da busca de colaboradores a serem avaliados
gestorRotas.post('/buscarColaboradorAvaliacaoPorMatricula', nivelGestor, GestorController.listagemAvaliacaoColaboradorPorMatricula);


//formulario de avaliação periódica
gestorRotas.get('/cadastrarAvaliacaoPeriodica/:id', nivelGestor, GestorController.formularioAvaliacaoPeriodica);

//Receber avaliação periodica
gestorRotas.post('/cadastroAvaliacaoPeriodica/:id', nivelGestor, GestorController.avaliacaoPeriodica);

//listar historico de avaliação periodica
gestorRotas.get('/historicoAvaliacao', nivelGestor, GestorController.listagemHistoricoAvaliacaoPeriodica);

//Busca histórico de avaliação períodica
gestorRotas.post('/buscarHistoricoAvaliacao', nivelGestor, GestorController.buscarHistoricoAvaliacaoPeriodica);


//Formulário de avaliações contendo informações sobre avaliações 
gestorRotas.get('/historicoAvaliacoes/:id', nivelGestor, GestorController.listagemAvaliacoesColaborador);

//Listar todas as avaliaçoes períodicas de um colaborador
gestorRotas.get('/todasAvaliacoesPeriodicas/:id', nivelGestor, GestorController.listagemAvaliacoesPeriodicas);

//Listar todas as avaliações cursos de um colaborador
gestorRotas.get('/todasAvaliacoesCursos/:id', nivelGestor, GestorController.listagemAvaliacoesCursos);

//listar a avaliação do curso, com todas as informações(presenças e faltas, data de inicio e fim, nota detalhes do curso)
gestorRotas.get('/detalheAvaliacaoCurso/:id/:colaboradorId/:op', nivelGestor, GestorController.detalheAvaliacaoCurso);

module.exports = gestorRotas;