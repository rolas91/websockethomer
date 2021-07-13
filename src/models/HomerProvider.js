const Sequelize = require("sequelize");
const sequelize = require("../db");
const ProductsProvider = require("../models/Productsprovider");
const HomerProvider = sequelize.define(
  "homerprovider",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ui: {
      type: Sequelize.INTEGER,
      nullable: false,
      primaryKey: true,
    },
    state: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    lat: {
      type: Sequelize.TEXT,
    },
    lng: {
      type: Sequelize.TEXT,
    },
    onesignal: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: false,
  }
);
// HomerProvider.hasMany(ProductsProvider, {foreingKey:'providerId', sourceKey:'id'});
// ProductsProvider.belongsTo(HomerProvider,{foreingKey:'providerId', sourceKey:'id'});

module.exports = HomerProvider;
