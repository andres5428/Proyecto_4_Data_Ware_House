const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class country extends Model { }

country.init({
  name: DataTypes.STRING

}, {
  sequelize,
  modelName: "country"
})

module.exports = country;