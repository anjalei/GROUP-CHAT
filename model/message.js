const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  senderName: { 
    type: Sequelize.STRING,
    allowNull: false
  },
 type: {
  type: Sequelize.ENUM('text', 'multimedia'),
  allowNull: false,
  defaultValue : 'text'
}


});

module.exports = Message;
