const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const TipoAprovacao = require('./tipoAprovacao');

const AvaliacaoCurso = sequelize.define('avaliacaoCurso', {

    id: {
        field: 'avaliacaoCursoId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    dataAvaliacao: {
        field: 'dataAvaliacao',
        type: Sequelize.DATE
    },

    nota: {
        field: 'nota',
        type: Sequelize.DECIMAL(4, 2)
    },

    observacao: {
        field: 'observacao',
        type: Sequelize.TEXT
    },

    situacao: {
        field: 'situacao',
        type: Sequelize.INTEGER
    },

}, {
    timestamps: false,
    freezeTableName: true
});


TipoAprovacao.hasMany(AvaliacaoCurso, {
    foreignKey: 'situacao'
});

AvaliacaoCurso.belongsTo(TipoAprovacao, {
    foreignKey: 'situacao'
});


module.exports = AvaliacaoCurso;