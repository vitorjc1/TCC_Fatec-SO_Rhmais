const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const TipoSituacao = sequelize.define('TipoSituacao', {

    id: {
        field: 'tipoSituacaoId',
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

module.exports = TipoSituacao;
