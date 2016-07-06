var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var Offer = sequelize.define('offer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  import_id: {
    type: Sequelize.INTEGER,
  },
  sell_currency_id: {
    type: Sequelize.INTEGER,
  },
  buy_currency_id: {
    type: Sequelize.INTEGER,
  },
  league: {
    type: Sequelize.TEXT,
  },
  username: {
    type: Sequelize.TEXT,
  },
  ign: {
    type: Sequelize.TEXT,
  },
  sell_value: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_value: {
    type: Sequelize.DECIMAL(10, 8),
  },
});

module.exports = Offer;
