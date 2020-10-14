const sequelize = require('../config/db');
const Sequelize = require('sequelize');
const Colaborador = require('./colaborador');

const Instrutor = sequelize.define('instrutor', {

    id: {
        field: 'instrutorId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
    {
        timestamps: false,
        freezeTableName: true 
    },);

    Colaborador.hasMany(Instrutor,{
        foreignKey: 'colaboradorId'
    });
    Instrutor.belongsTo(Colaborador, {
        foreignKey: 'colaboradorId'
    });

module.exports = Instrutor;
