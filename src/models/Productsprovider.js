const {Sequelize} = require('sequelize');
const {sequelize} = require('../db');
const {HomerProvider} = require('../models/HomerProvider');

const ProductsProvider = sequelize.define('ProductsProvider', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true     
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

ProductsProvider.belongsTo(HomerProvider)
module.exports = ProductsProvider;