const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const AgendaCursoColaborador = require('./agendaCursoColaborador')


const Frequencia = sequelize.define('frequencia', {

    id: {
        field: 'frequenciaId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    presenca: {
        field: 'presenca',
        type: Sequelize.INTEGER,
    },

    falta: {
        field: 'falta',
        type: Sequelize.INTEGER,
    },

    dataFrequencia: {
        field: 'dataFrequencia',
        type: Sequelize.DATE,
    },

    observacao: {
        field: 'observacao',
        type: Sequelize.TEXT,
    },

    horaAula: {
        field: 'horaAula',
        type: Sequelize.INTEGER,
    },
},

    {
        timestamps: false,
        freezeTableName: true
    });

AgendaCursoColaborador.hasMany(Frequencia, {
    foreignKey: 'agendaCursoColaboradorId'
}),

    Frequencia.belongsTo(AgendaCursoColaborador, {
        foreignKey: 'agendaCursoColaboradorId'
    });


module.exports = Frequencia;