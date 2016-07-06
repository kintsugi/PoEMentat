var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var PriceHistory = sequelize.define('price_history', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  import_id: {
    type: Sequelize.INTEGER,
  },
  sell_trade_group_id: {
    type: Sequelize.INTEGER,
  },
  sell_upper_donchian: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_lower_donchian: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_median: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_median_shadow: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_median_tail: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_moving_avg_5d: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_moving_avg_20d: {
    type: Sequelize.DECIMAL(10, 4),
  },
  sell_volume: {
    type: Sequelize.INTEGER(10, 4),
  },
  buy_trade_group_id: {
    type: Sequelize.INTEGER,
  },
  buy_upper_donchian: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_lower_donchian: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_median: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_median_shadow: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_median_tail: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_moving_avg_5d: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_moving_avg_20d: {
    type: Sequelize.DECIMAL(10, 4),
  },
  buy_volume: {
    type: Sequelize.INTEGER(10, 4),
  },
  min_profit_trade_group_id: {
    type: Sequelize.INTEGER,
  },
  min_profit_upper_donchian: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_lower_donchian: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_median: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_median_shadow: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_median_tail: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_moving_avg_5d: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_moving_avg_20d: {
    type: Sequelize.DECIMAL(10, 4),
  },
  min_profit_volume: {
    type: Sequelize.INTEGER(10, 4),
  },
});

module.exports = PriceHistory;
