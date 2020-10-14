const sequelize = require('../config/db');
const Sequelize = require('sequelize');


const Cargo = sequelize.define('cargo', {

    id: {
        field: 'cargoId',
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

module.exports = Cargo;
