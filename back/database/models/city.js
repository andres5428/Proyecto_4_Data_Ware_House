const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class city extends Model { }

city.init({
  name: DataTypes.STRING

}, {
  sequelize,
  modelName: "city"
})

module.exports = city;