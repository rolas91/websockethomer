const Sequelize = require("sequelize");
const sequelize = require("../db");

const Categories = sequelize.define(
  "categories",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descriptions: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Categories;
