const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  groupname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdBy: { 
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Group;
