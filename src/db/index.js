const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DB, process.env.USERDB, process.env.PASSWORDDB, {
    host: process.env.Host,
    dialect:'mysql',
    "logging": false,
    pool:{
        max:5,
        min:0,
        require:30000,
        idle:10000 
    }
  });

  module.exports = sequelize;