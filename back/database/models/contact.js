const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db');

class contact extends Model { }

contact.init({
  name: DataTypes.STRING,
  lastname:DataTypes.STRING,
  email: DataTypes.STRING,
  position: DataTypes.STRING,
  address: DataTypes.STRING,
  channel: DataTypes.STRING,
  account: DataTypes.STRING,
  interest: DataTypes.STRING,
  preference: DataTypes.STRING,
  image: DataTypes.STRING(65535)
}, {
  sequelize,
  modelName: "contact"
})

module.exports = contact;