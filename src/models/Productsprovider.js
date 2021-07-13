const Sequelize = require("sequelize");
const sequelize = require("../db");
const HomerProvider = require("../models/HomerProvider");

const ProductsProvider = sequelize.define(
  "productsprovider",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ui: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    providerId: {
      type: Sequelize.INTEGER,
      reference: {
        module: "homerproviders",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ProductsProvider;
