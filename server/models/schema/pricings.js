var Sequelize = require('sequelize')
var sequelize = require('../connection.js');
var Promise = require('promise');


var Pricing = sequelize.define('pricing', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  import_id: {
    type: Sequelize.INTEGER,
  },
  main_currency_id: {
    type: Sequelize.INTEGER,
  },
  alternate_currency_id: {
    type: Sequelize.INTEGER,
  },
  sell_min_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  sell_max_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_min_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_max_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  sell_median_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  sell_std_dev: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_mean_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_median_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  buy_std_dev: {
    type: Sequelize.DECIMAL(10, 8),
  },
  profit_margin_min_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
  profit_margin_max_mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
}, {
  instanceMethods: {
    setPriceValues: function(pricing) {
      return new Promise(function(fulfill, reject) {
        try {
          var buySellPromises = [pricing.setBuyValues(pricing), pricing.setSellValues(pricing)]
          Promise.all(buySellPromises).then(function() {
            return setProfit();
          }, reject)
          .then(fulfill, reject)
        } catch(err) {
          reject(err)
        }
      });
    },
    setBuyValues: function(pricing) {
      return new Promise(function(fulfill, reject) {
        try {
          pricing.getBuyOffers()
          .then(function(buyOffers) {
            try {
              if(buyOffers.length > 0) {
                buyOffers.sort(pricing.offerSort)
                fulfill(calcValues);
              }
              fulfill();
            } catch(err) {
              reject(err)
            }          
          }, reject);
        } catch(err) {
          reject(err)
        }
      });

    },
    setSellValues: function(pricing) {
      return new Promise(function(fulfill, reject) {
        try {
          pricing.getSellOffers()
          .then(function(sellOffers) {
            try {
              if(sellOffers.length > 0) {
                sellOffers.sort(pricing.offerSort)
                fulfill(calcValues);
              }
              fulfill();
            } catch(err) {
              reject(err)
            }
          }, reject)
        } catch(err) {
          reject(err)
        }
      });
    },
    calcValues: function(offers) {

      return new Promise(function(fulfill, reject) {
        try {
          offers.getOffersPricings
        } catch(err) {
          reject(err)
        }
      });
    },
    setProfit: function(price) {

    },
    offerSort: function(a, b) {
      if(a.dataValues.offers_pricing.mpa < b.dataValues.offers_pricing.mpa)
        return -1
      else if(a.dataValues.offers_pricing.mpa > b.dataValues.offers_pricing.mpa)
        return 1;
      return 0;
    }


  }
});

module.exports = Pricing;
