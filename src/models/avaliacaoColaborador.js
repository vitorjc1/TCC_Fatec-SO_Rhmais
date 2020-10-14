const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const Colaborador = require('./colaborador');
const Gestor = require('./gestor');
const AvaliacaoColaborador = sequelize.define('avaliacaoColaborador', {

    id: {
        field: 'avaliacaoColaboradorId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    observacao: {
        field: 'observacao',
        type: Sequelize.TEXT
    },

    dataAvaliacao: {
        field: 'dataAvaliacao',
        type: Sequelize.DATE
    },

    nota: {
        field: 'nota',
        type: Sequelize.DECIMAL(4,2)
    },
    
    autoAvaliacao: {
        field: 'autoAvaliacao',
        type: Sequelize.DECIMAL(4,2)
    },

    avaliacaoEmEquipe: {
        field: 'avaliacaoEmEquipe',
        type: Sequelize.DECIMAL(4,2)
    },

    avaliacaoTecnica: {
        field: 'avaliacaoTecnica',
        type: Sequelize.DECIMAL(4,2)
    },
    
    avaliacaoComportamental: {
        field: 'avaliacaoComportamental',
        type: Sequelize.DECIMAL(4,2)
    },

},
    {
        timestamps: false,
        freezeTableName: true 
    },);

    Colaborador.hasMany(AvaliacaoColaborador,{
        foreignKey: 'colaboradorId'
    });

    AvaliacaoColaborador.belongsTo(Colaborador, {
        foreignKey: 'colaboradorId'
    });

    Gestor.hasMany(AvaliacaoColaborador,{
        foreignKey: 'gestorId'
    });
   AvaliacaoColaborador.belongsTo(Gestor, {
        foreignKey: 'gestorId'
    });

module.exports =   AvaliacaoColaborador;
