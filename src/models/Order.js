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
        values: ['solicitado','iniciado','aceptado' ,'finalizado', 'rechazado', 'cancelado'],
        defaultValue: 'solicitado'
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