const Sequelize = require('sequelize');
const sequelize = require('../db');
const RequestClient = require('../models/StateService');

const StateService = sequelize.define('stateservice', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type: Sequelize.STRING
    }
},{
    timestamps:false
});
// StateService.hasMany(RequestClient);
module.exports = StateService;