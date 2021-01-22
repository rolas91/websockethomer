const Sequelize = require('sequelize');
const sequelize = require('../db');

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
    status:{
        type: Sequelize.ENUM,
        values: ['solicitado','aceptado','he llegado','iniciado','finalizado', 'rechazado', 'cancelado'],
        defaultValue: 'solicitado'
    },
    isCancel:{
        type:Sequelize.STRING
    },
    isCount:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
    },
    isCountNow:{
        type: Sequelize.BOOLEAN,
        defaultValue:true
    },
    date:{
        type: Sequelize.DATEONLY
    },
    hour:{
        type: Sequelize.TIME
    },
    location:{
        type:Sequelize.STRING
    },
    lat:{
        type:Sequelize.STRING
    },
    lng:{
        type:Sequelize.STRING
    },
    onesignal:{
        type:Sequelize.TEXT
    }
},{
    timestamps:false
});

module.exports = RequestClient;