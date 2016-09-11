var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var Trade = sequelize.define('trade', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  sell_currency_id: {
    type: Sequelize.INTEGER,
  },
  buy_currency_id: {
    type: Sequelize.INTEGER,
  },
  sell_value: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_value: {
    type: Sequelize.DECIMAL(10, 8),
  },
  ign: {
    type: Sequelize.TEXT,
  },
});


module.exports = Trade;
