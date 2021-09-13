const Sequelize = require("sequelize");
const sequelize = require("../db");

const RequestClient = sequelize.define(
  "order",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientUi: {
      type: Sequelize.INTEGER,
    },
    nameClient: {
      type: Sequelize.STRING,
    },
    productUi: {
      type: Sequelize.INTEGER,
    },
    productName: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      values: [
        "solicitado",
        "aceptado",
        "pagado",
        "he llegado",
        "iniciado",
        "finalizado",
        "rechazado",
        "cancelado",
      ],
      defaultValue: "solicitado",
    },
    isCancel: {
      type: Sequelize.STRING,
    },
    isCount: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isCountNow: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    date: {
      type: Sequelize.DATEONLY,
    },
    hour: {
      type: Sequelize.TIME,
    },
    hour_end:{
      type: Sequelize.TIME,
    },
    date_end:{
      type: Sequelize.DATEONLY,
    },
    location: {
      type: Sequelize.STRING,
    },
    lat: {
      type: Sequelize.STRING,
    },
    lng: {
      type: Sequelize.STRING,
    },
    onesignal: {
      type: Sequelize.TEXT,
    },
    countDown: {
      type: Sequelize.INTEGER,
      defaultValue: 10,
    },
    cart: {
      type: Sequelize.STRING,
    },
    bookingId: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = RequestClient;
