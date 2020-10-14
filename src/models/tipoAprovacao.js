const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const TipoAprovacao = sequelize.define('tipoAprovacao', {

    id: {
        field: 'tipoAprovacaoId',
        type: Sequelize.INTEGER,
        primaryKey: true,
    },

    nome: {
        field: 'nome',
        type: Sequelize.STRING,
    },
},
    {
        timestamps: false,
        freezeTableName: true 
    },);

module.exports = TipoAprovacao;
