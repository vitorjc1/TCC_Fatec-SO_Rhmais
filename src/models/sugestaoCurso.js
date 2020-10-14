const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Colaborador = require('./colaborador');


const SugestaoCurso = sequelize.define('sugestaoCurso', {

    id: {
        field: 'sugestaoCursoId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    data:{
        field: 'data',
        type: Sequelize.DATE,
    },

    motivo:{
        field: 'motivo',
        type: Sequelize.STRING,
    },

    nomeCurso:{
        field: 'nomeCurso',
        type: Sequelize.STRING,
    },

    situacao:{
        field: 'situacao',
        type: Sequelize.STRING,
    },

}, {
    timestamps: false,
    freezeTableName: true 
},)

Colaborador.hasMany(SugestaoCurso,{
    foreignKey: 'colaboradorId'
});
SugestaoCurso.belongsTo(Colaborador, {
    foreignKey: 'colaboradorId'
});

module.exports = SugestaoCurso;