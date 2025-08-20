const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const GroupMember = sequelize.define('groupMember', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  }
});

module.exports = GroupMember;
