const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const Setor = require('./setor');
const Cargo = require('./cargo');

const Colaborador = sequelize.define('colaborador', {

    id: {
        field: 'colaboradorId',
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        field: 'nome',
        type: Sequelize.STRING,
    },

    email: {
        field: 'email',
        type: Sequelize.STRING,
    },

    senha: {
        field: 'senha',
        type: Sequelize.STRING,
    },

    acesso: {
        field: 'acesso',
        type: Sequelize.INTEGER
    },

    matricula: {
        field: 'matricula',
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false,
    freezeTableName: true
})

Setor.hasMany(Colaborador, {
    foreignKey: 'setorId'
});
Colaborador.belongsTo(Setor, {
    foreignKey: 'setorId'
});

Cargo.hasMany(Colaborador, {
    foreignKey: 'cargoId'
});

Colaborador.belongsTo(Cargo, {
    foreignKey: 'cargoId'
})


module.exports = Colaborador;