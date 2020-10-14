const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const Colaborador = require('./colaborador');
const Gestor = require('./gestor');
const Curso = require('./curso');
const AgendaCurso = require('./agendaCurso');
const AvaliacaoCurso = require('./avaliacaoCurso');

const AgendaCursoColaborador = sequelize.define('agendaCursoColaborador', {

    id: {
        field: 'agendaCursoColaboradorId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }

}, {
    timestamps: false,
    freezeTableName: true
}, );

AgendaCurso.hasMany(AgendaCursoColaborador, {
    foreignKey: 'agendaCursoId'
});
AgendaCursoColaborador.belongsTo(AgendaCurso, {
    foreignKey: 'agendaCursoId'
});

Colaborador.hasMany(AgendaCursoColaborador, {
    foreignKey: 'colaboradorId'
});
AgendaCursoColaborador.belongsTo(Colaborador, {
    foreignKey: 'colaboradorId'
});

AvaliacaoCurso.hasOne(AgendaCursoColaborador, {
    foreignKey: 'avaliacaoCursoId'
})

AgendaCursoColaborador.belongsTo(AvaliacaoCurso, {
    foreignKey: 'avaliacaoCursoId'
})

module.exports = AgendaCursoColaborador;