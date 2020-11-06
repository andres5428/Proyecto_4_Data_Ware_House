const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class user extends Model { }

user.init({
  name: DataTypes.STRING,
  lastname: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING

}, {
  sequelize,
  modelName: "user"
})

module.exports = user;