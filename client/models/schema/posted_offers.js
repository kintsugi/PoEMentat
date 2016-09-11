var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var PostedOffer = sequelize.define('posted_offer', {
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
  posted_offer_id: {
    type: Sequelize.INTEGER,
  },
  sell_value: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_value: {
    type: Sequelize.DECIMAL(10, 8),
  },
  active: {
    type: Sequelize.BOOLEAN,
  },
});


module.exports = PostedOffer;
