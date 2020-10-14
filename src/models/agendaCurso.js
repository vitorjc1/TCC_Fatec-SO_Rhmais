const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const Colaborador = require('./colaborador');
const Gestor = require('./gestor');
const Curso = require('./curso');
const Instrutor = require('./instrutor');
const AgendaCurso = sequelize.define('agendaCurso', {

    id: {
        field: 'agendaCursoId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    dataFinal: {
        field: 'dataFinal',
        type: Sequelize.DATE
    },

    local: {
        field: 'local',
        type: Sequelize.STRING
    },

    dataInicio: {
        field: 'dataInicio',
        type: Sequelize.DATE
    },

},
    {
        timestamps: false,
        freezeTableName: true 
    },);

    Gestor.hasMany(AgendaCurso,{
        foreignKey: 'gestorId'
    });
    AgendaCurso.belongsTo(Gestor, {
        foreignKey: 'gestorId'
    });

    Curso.hasMany(AgendaCurso,{
        foreignKey: 'cursoId'
    });
    AgendaCurso.belongsTo(Curso, {
        foreignKey: 'cursoId'
    });

    Instrutor.hasMany(AgendaCurso, {
        foreignKey: 'instrutorId'
    });

    AgendaCurso.belongsTo(Instrutor, {
        foreignKey: 'instrutorId'
    });

module.exports =  AgendaCurso;
