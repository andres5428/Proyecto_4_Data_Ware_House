const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class region extends Model { };

region.init({
  name: DataTypes.STRING

}, {
  sequelize,
  modelName: "region"
})

module.exports = region;