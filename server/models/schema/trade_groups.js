var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var TradeGroup = sequelize.define('trade_group', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  main_currency_id: {
    type: Sequelize.INTEGER,
  },
  alternate_currency_id: {
    type: Sequelize.INTEGER,
  },
});

module.exports = TradeGroup;
