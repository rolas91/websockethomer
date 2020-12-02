const Sequelize = import('sequelize');
const sequelize = import('../db');
const RequestClient = import('../models/StateService');
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
StateService.hasMany(RequestClient);
module.exports = StateService;