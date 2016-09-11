var sequelize = require('sequelize');
var connection = new sequelize(undefined, undefined, undefined, {
  dialect: 'sqlite',
  logging: false, 
  storage: './data.db'
});

module.exports = connection;
