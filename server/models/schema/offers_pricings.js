var sequelize = require('../connection.js');
var Sequelize = require('sequelize')

var OffersPricing = sequelize.define('offers_pricing', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  pricing_id: {
    type: Sequelize.INTEGER,
  },
  sell_offer_id: {
    type: Sequelize.INTEGER,
  },
  buy_offer_id: {
    type: Sequelize.INTEGER,
  },
  min_sell_offer_id: {
    type: Sequelize.INTEGER,
  },
  max_sell_offer_id: {
    type: Sequelize.INTEGER,
  },
  min_buy_offer_id: {
    type: Sequelize.INTEGER,
  },
  max_buy_offer_id: {
    type: Sequelize.INTEGER,
  },
  mpa: {
    type: Sequelize.DECIMAL(10, 8),
  },
});

OffersPricing.beforeCreate(function(instance, options, cb) {
  var sellOfferId = instance.get('sell_offer_id');
  var buyOfferId = instance.get('buy_offer_id');
  //false for buy, true for sell
  var offerType = false;

  if(sellOfferId && !buyOfferId)
    offerType = true;
  else if(!sellOfferId && buyOfferId)
    offerType = false;
  else if(!sellOfferId && ! buyOfferId)
    console.log('no offer id on offerpricing')
  else
    console.log('both offer id on offerpricing')
  instance.getPricing()
  .then(function(pricing) {
    var offerPromise = offerType ? instance.getSellOffer() : instance.getBuyOffer()
    offerPromise.then(function(offer) {
      var mainValue = 0.0, alternateValue = 0.0;
      if(offer.dataValues.sell_currency_id == pricing.dataValues.main_currency_id && offer.dataValues.buy_currency_id == pricing.dataValues.alternate_currency_id) {
        mainValue = offer.dataValues.sell_value;
        alternateValue = offer.dataValues.buy_value;
      }
      if(offer.dataValues.buy_currency_id == pricing.dataValues.main_currency_id && offer.dataValues.sell_currency_id == pricing.dataValues.alternate_currency_id) {
        mainValue = offer.dataValues.buy_value;
        alternateValue = offer.dataValues.sell_value;
      }
      instance.set('mpa', mainValue / alternateValue)
      cb(null, instance);
    }, function(err) {
      throw err;
    })
  }, function(err) {
    throw err;
  })
});

module.exports = OffersPricing;
