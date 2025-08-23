// model/archivedMessage.js
const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const ArchivedMessage = sequelize.define("ArchivedChat", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = ArchivedMessage;
