const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const Setor = sequelize.define('setor', {

    id: {
        field: 'setorId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        field: 'nome',
        type: Sequelize.STRING,
    },
},
    {
        timestamps: false,
        freezeTableName: true 
    },);

module.exports = Setor;
