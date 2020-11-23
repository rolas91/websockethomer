const Sequelize = require('sequelize');
const sequelize = require('../db');
const {ProductsProvider} = require('../models/Productsprovider');
const HomerProvider = sequelize.define('HomerProvider', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true     
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
module.exports = HomerProvider;
