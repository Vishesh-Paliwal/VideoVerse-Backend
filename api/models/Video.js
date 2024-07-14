const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  buffer: {
    type: DataTypes.BLOB,
    allowNull: false
  }
});

module.exports = Video;
