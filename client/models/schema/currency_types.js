var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var CurrencyType = sequelize.define('currency_type', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.TEXT,
  },
});

module.exports = CurrencyType; 
