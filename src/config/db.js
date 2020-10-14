const Sequelize = require('sequelize');

//Banco de dados local
/*const sequelize = new Sequelize('tcc', 'root', '18119623', {
    host: 'localhost',
    dialect: 'mysql'
  });
  */

  //banco de dados online
  const sequelize = new Sequelize('tcc_bd', 'grupo_tcc','grupo_tcc_2020', {
    host:'107.180.26.78',
    dialect: 'mysql'
  });

  module.exports = sequelize;
  