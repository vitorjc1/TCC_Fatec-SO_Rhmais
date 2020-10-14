const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const Colaborador = require('./colaborador');
const Gestor = require('./gestor');
const Curso = require('./curso');
const RequisicaoCurso = sequelize.define('requisicaoCurso', {

    id: {
        field: 'requisicaoCursoId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    dataRequisicao: {
        field: 'dataRequisicao',
        type: Sequelize.DATE
    },

    dataAtualizacao: {
        field: 'dataAtualizacao',
        type: Sequelize.DATE
    },

    situacao: {
        field: 'situacao',
        type: Sequelize.STRING
    },
},
    {
        timestamps: false,
        freezeTableName: true 
    },);

    Colaborador.hasMany(RequisicaoCurso,{
        foreignKey: 'colaboradorId'
    });
    RequisicaoCurso.belongsTo(Colaborador, {
        foreignKey: 'colaboradorId'
    });

    Gestor.hasMany(RequisicaoCurso,{
        foreignKey: 'gestorId'
    });
    RequisicaoCurso.belongsTo(Gestor, {
        foreignKey: 'gestorId'
    });

    Curso.hasMany(RequisicaoCurso,{
        foreignKey: 'cursoId'
    });
    RequisicaoCurso.belongsTo(Curso, {
        foreignKey: 'cursoId'
    });

module.exports = RequisicaoCurso;
