const Sequelize = require('sequelize');
const sequelize = require('../db');

const Messages = sequelize.define('messages', {
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true, 
    },

    from:{
        type:Sequelize.TEXT
    },       
    text:{
        type:Sequelize.TEXT
    },

    roomName:{
        type:Sequelize.INTEGER
    },

    created:{
        type: Sequelize.DATEONLY
    }
},{
    timestamps:false
});
module.exports = Messages;