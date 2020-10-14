const express = require('express');
const CursoController = require('../controller/CursoController');
const cursoRotas = express.Router();

//lista todos os cursos
cursoRotas.get('/curso/listagem', CursoController.listagem);

//formulario de cadastro de curso
cursoRotas.get('/cadastrarCurso',(req,res)=>{
    res.render('cadastrarCurso');
})

//cadastra um novo curso
cursoRotas.post('/curso/cadastrar', CursoController.cadastrar);

//procura um curso especifico
cursoRotas.get('/curso/:id', CursoController.procurar);

cursoRotas.get('/desabilitarCurso/:id',CursoController.desabilitarCurso);

module.exports = cursoRotas;