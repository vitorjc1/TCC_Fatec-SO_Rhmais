const express = require('express');
const SetorController = require('../controller/SetorController');
const setorRotas = express.Router();

setorRotas.get('/setor/listagem', SetorController.listagem);


module.exports = setorRotas;