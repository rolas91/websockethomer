const Sequelize = require('sequelize');
const sequelize = require('../db');

const ProductsProvider = sequelize.define('productsprovider', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true     
    },
    ui:{
        type:Sequelize.INTEGER
    },
    name:{
        type:Sequelize.TEXT
    }
},{
    timestamps:false
});

module.exports = ProductsProvider;