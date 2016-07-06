var Sequelize = require('sequelize')
var sequelize = require('../connection.js');
var Promise = require('promise');

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

CurrencyType.afterBulkCreate(function(currencyTypes) {
  return new Promise(function(fulfill, reject) {
    try {
      var models = require('../../database.js').models;
      var tradeGroupPromises = [];
      for(mainCurrency in currencyTypes) {
        for(alternateCurrency in currencyTypes) {
          var main = currencyTypes[mainCurrency]; 
          var alternate = currencyTypes[alternateCurrency]; 
          if(main.get('id') != alternate.get('id')) {
            tradeGroupPromises.push(models.TradeGroups.create({
              main_currency_id: main.get('id'),
              alternate_currency_id: alternate.get('id'),
            }))
          }
        }
      }
      Promise.all(tradeGroupPromises).then(function() {
        fulfill();
      }, reject);
    } catch(err) {
      reject(err)
    }
  });
});

module.exports = CurrencyType; 
