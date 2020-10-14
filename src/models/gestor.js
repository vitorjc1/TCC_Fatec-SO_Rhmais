const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const Colaborador = require('./colaborador');

const Gestor = sequelize.define('gestor', {

    id: {
        field: 'gestorId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
    {
        timestamps: false,
        freezeTableName: true 
    },);

    Colaborador.hasMany(Gestor,{
        foreignKey: 'colaboradorId'
    });
    Gestor.belongsTo(Colaborador, {
        foreignKey: 'colaboradorId'
    });

module.exports = Gestor;
