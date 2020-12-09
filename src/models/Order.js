const Sequelize = require('sequelize');
const sequelize = require('../db');
const StateService = require('./StateService');

const RequestClient = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    clientUi:{
        type: Sequelize.INTEGER,
    },
    nameClient:{
        type: Sequelize.STRING
    },
    productUi:{
        type: Sequelize.INTEGER
    },
    productName:{
        type: Sequelize.STRING
    },
    stateServiceId:{
        type: Sequelize.INTEGER
    },
    date:{
        type: Sequelize.DATEONLY
    },
    hour:{
        type: Sequelize.TIME
    },
    location:{
        type:Sequelize.STRING
    }
},{
    timestamps:false
});
RequestClient.belongsTo(StateService, {
    foreignKey: "stateServiceId"
});
module.exports = RequestClient;