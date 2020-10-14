const express = require('express');
const InstrutorController = require('../controller/InstrutorController');
const instrutorRotas = express.Router();
const { nivelInstrutor, estaLogado, logado } = require('../helpers/acesso');


instrutorRotas.get("/homeInstrutor", nivelInstrutor, (req, res) => { res.render('homeInstrutor') });

//listagem de cursos para avaliar.
instrutorRotas.get('/avaliarCurso', nivelInstrutor, InstrutorController.listagemDeAvaliacao);

//Formulário para avaliar o colaborador.
instrutorRotas.get('/avaliarCurso/:id', nivelInstrutor, InstrutorController.buscarAvaliacaoCurso);

//Avaliando o colaborador
instrutorRotas.post('/avaliarCurso/avaliarParticipante', nivelInstrutor, InstrutorController.avaliarColaborador);

//Historico de agendas
instrutorRotas.get('/historicoAvaliacaoCurso', nivelInstrutor, InstrutorController.historicoAgenda);

//Detalhe historico agenda
instrutorRotas.get('/historico/agenda/:id', nivelInstrutor, InstrutorController.detalheAgenda);

//Formulário de  frequencia
instrutorRotas.get('/adicionarFrequencia/:id', nivelInstrutor, InstrutorController.formularioDeFrequencia);

//Adicionar Frequencia 
instrutorRotas.post('/avaliacao/adicionarFrequencia', nivelInstrutor, InstrutorController.adicionarFrenquencia);

//Listar chamadas anteriores
instrutorRotas.get('/avaliacao/frequenciasRegistradas/:id', nivelInstrutor, InstrutorController.frequenciasRegistradas);

//abrir uma chamada anterior
instrutorRotas.get('/alterarFrequencia/:frequenciaId/:id', nivelInstrutor, InstrutorController.alterarFrequencia);

//realiza a alteração da chamada
instrutorRotas.post('/editarFrequencia/:id', nivelInstrutor, InstrutorController.editarFrequencia);

//formulario de avaliação
instrutorRotas.get('/alterarAvaliacao/:id', nivelInstrutor, InstrutorController.buscarAvaliacaoFeita);

//alterar uma avaliação ja feita(no historico)
instrutorRotas.post('/atualizarAvaliacao/', nivelInstrutor, InstrutorController.alterarAvaliacaoColaborador);

module.exports = instrutorRotas;