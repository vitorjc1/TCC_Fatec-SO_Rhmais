const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Curso = sequelize.define('curso', {

    id: {
        field: 'cursoId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    cargaHoraria: {
        field: 'cargaHoraria',
        type: Sequelize.INTEGER,
    },

    descricao: {
        field: 'descricao',
        type: Sequelize.TEXT,
    },

    nome: {
        field: 'nome',
        type: Sequelize.STRING,
    },

    valor: {
        field: 'valor',
        type: Sequelize.DECIMAL(10, 2),
    },
    situacao: {
        field: 'situacao',
        type: Sequelize.INTEGER
    }

}, {
    timestamps: false,
    freezeTableName: true
})

module.exports = Curso;