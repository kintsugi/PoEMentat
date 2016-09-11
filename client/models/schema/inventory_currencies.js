var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var InventoryCurrency = sequelize.define('inventory_currency', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  currency_id: {
    type: Sequelize.INTEGER,
  },
  qty: {
    type: Sequelize.INTEGER,
  },
});


module.exports = InventoryCurrency;
