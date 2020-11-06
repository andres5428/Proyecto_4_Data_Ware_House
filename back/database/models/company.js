const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class company extends Model { }

company.init({
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  email: DataTypes.STRING,
  telephone: DataTypes.STRING
}, {
  sequelize,
  modelName: "company"
})

module.exports = company;