const Sequelize = require('sequelize');
const sequelize = require('../db');
const ProductsProvider = require('../models/Productsprovider');
module.exports.HomerProvider = sequelize.define('homerprovider', {
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
    lat:{
        type:Sequelize.TEXT
    },
    lng:{
        type:Sequelize.TEXT
    }
},{
    timestamps:false
});
HomerProvider.hasMany(ProductsProvider, {foreingKey:'providerId', sourceKey:'id'});
ProductsProvider.belongsTo(HomerProvider,{foreingKey:'providerId', sourceKey:'id'});
