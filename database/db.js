const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // or ':memory:' for in-memory database
});

module.exports = sequelize;
