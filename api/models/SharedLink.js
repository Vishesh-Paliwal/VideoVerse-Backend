const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db');
const Video = require('./Video');

const SharedLink = sequelize.define('SharedLink', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  videoId: {
    type: DataTypes.INTEGER,
    references: {
      model: Video,
      key: 'id'
    },
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = SharedLink;
