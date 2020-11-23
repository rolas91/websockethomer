const Sequelize = require('sequelize');
const sequelize = require('../db');

const ProductsProvider = sequelize.define('productsprovider', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true     
    },
    ui:{
        type:Sequelize.INTEGER
    },
    name:{
        type:Sequelize.TEXT
    },
    providerId:{
        type:Sequelize.INTEGER
    }
},{
    timestamps:false
});

module.exports = ProductsProvider;