var Models = require('./database.js').models;
var Promise = require('promise');
var jStat = require('jStat').jStat;
var priceHistorian = require('./priceHistorian.js');

function getCurrencyOffers(importEntry, mainCurrency, alternateCurrency) {

  return new Promise(function(fulfill, reject) {
    try {
      var buyOffersPromise = Models.Offers.findAll({
        where: {
          import_id: importEntry.get('id'),
          sell_currency_id: mainCurrency.get('id'),
          buy_currency_id: alternateCurrency.get('id'),
        }
      });
      var sellOffersPromise = Models.Offers.findAll({
        where: {
          import_id: importEntry.get('id'),
          sell_currency_id: alternateCurrency.get('id'),
          buy_currency_id: mainCurrency.get('id'),
        }
      });
      var tradeGroupPromise = Models.TradeGroups.findOne({
        where: {
          main_currency_id: mainCurrency.id,
          alternate_currency_id: alternateCurrency.id
        }
      });
      Promise.all([buyOffersPromise, sellOffersPromise, tradeGroupPromise])
      .then(function(buySellOffersArray) {
        try {
          fulfill({
            buyOffers: buySellOffersArray[0],
            sellOffers: buySellOffersArray[1],
            mainCurrency: mainCurrency,
            alternateCurrency: alternateCurrency,
            importEntry: importEntry,
            tradeGroup: buySellOffersArray[2],
          })
        } catch(err) {
          reject(err)
        }
      }, reject);

    } catch(err) {
      reject(err)
    }
  });

}

function createPrice(buySellOffers) {
  return new Promise(function(fulfill, reject) {
    try {
      Models.Pricings.create({
        import_id: buySellOffers.importEntry.get('id'),
        main_currency_id: buySellOffers.mainCurrency.get('id'),
        alternate_currency_id: buySellOffers.alternateCurrency.get('id'),
        trade_group_id: buySellOffers.tradeGroup.get('id'),
      }).then(function(pricing) {
        pricing.setSellOffers(buySellOffers.sellOffers, {
          individualHooks: true,
        })
        .then(function() {
        }, reject)
        .then(function() {
          pricing.setBuyOffers(buySellOffers.buyOffers, {
          individualHooks: true,
        })
          .then(function() {
            fulfill(pricing);
          }, reject)
        });
      }, reject)
    } catch(err) {
      reject(err)
    }
  });
}

function getOfferValues(price, type) {
  return new Promise(function(fulfill, reject) {
    try {

      var whereFilter = {
        pricing_id: price.id,
        $not: {}
      };
      whereFilter.$not[type + '_offer_id'] = null;

      var countOffersPromise = Models.OffersPricings.count({
        where: whereFilter
      });
      var minOfferValuePromise = Models.OffersPricings.min('mpa', {
        where: whereFilter
      })
      var maxOfferValuePromise = Models.OffersPricings.max('mpa', {
        where: whereFilter
      })
      var sumOfferValuePromise = Models.OffersPricings.sum('mpa', {
        where: whereFilter
      })
      var offersPromise = Models.OffersPricings.findAll({
        where: whereFilter
      })
      Promise.all([
        countOffersPromise,
        minOfferValuePromise,
        maxOfferValuePromise,
        sumOfferValuePromise,
        offersPromise,
      ])
      .then(function(values) {
        //validate values
        if(values[0] != 0 &&
           !isNaN(values[1]) &&
           !isNaN(values[2]) &&
           !isNaN(values[3]) &&
           values[4].length > 0)
        {
          //find min offers

          whereFilter.mpa = values[1]
          var minOfferPromise = Models.OffersPricings.findAll({
            where: whereFilter
          })

          //find max offers
          whereFilter.mpa = values[2]

          var maxOfferPromise = Models.OffersPricings.findAll({
            where: whereFilter
          })
          Promise.all([
            minOfferPromise,
            maxOfferPromise,
          ])
          .then(function(offers) {
            fulfill({
              count: values[0],
              min_mpa: values[1],
              max_mpa: values[2],
              sum: values[3],
              all: values[4],
              mins: offers[0],
              maxs: offers[1],
            })
          }, reject)
        } else {
          fulfill();
        }

      }, reject)
    } catch(err) {
      reject(err)
    }
  });
}

function calcValues(offerValues) {
  var values = [];
  for(var i in offerValues.all) {
    var offerPricing = offerValues.all[i];
    values.push(offerPricing.mpa);
  }
  var mean = jStat.mean(values);
  var median = jStat.median(values);
  var stdev = jStat.stdev(values);
  return {
    mean: mean,
    median: median,
    stdev: stdev,
  }
}

function setOfferPricingId(offerPricing, type, value) {
  offerPricing.set(value + '_' + type + '_offer_id', offerPricing.get(type + '_offer_id'))
  return offerPricing.save();
}

function setOfferValues(price, offerValues) {

  var setPromises = [];
  if(offerValues[0]) {
    for(var i in offerValues[0].mins) {
      var offerPricing = offerValues[0].mins[i];
      setPromises.push(setOfferPricingId(offerPricing, 'min', 'buy'))
    }
    for(var i in offerValues[0].maxs) {
      var offerPricing = offerValues[0].maxs[i];
      setPromises.push(setOfferPricingId(offerPricing, 'max', 'buy'))
    }

    price.buy_min_mpa = offerValues[0].min_mpa
    price.buy_max_mpa = offerValues[0].max_mpa

    var buyValues = calcValues(offerValues[0]);
    price.buy_mean_mpa = buyValues.mean;
    price.buy_median_mpa = buyValues.median;
    price.buy_std_dev = buyValues.stdev;
  }
  if(offerValues[1]){
    for(var i in offerValues[1].mins) {
      var offerPricing = offerValues[1].mins[i];
      setPromises.push(setOfferPricingId(offerPricing, 'min', 'sell'))
    }
    for(var i in offerValues[1].maxs) {
      var offerPricing = offerValues[1].maxs[i];
      setPromises.push(setOfferPricingId(offerPricing, 'max', 'sell'))
    }

    price.sell_min_mpa = offerValues[1].min_mpa
    price.sell_max_mpa = offerValues[1].max_mpa

    var sellValues = calcValues(offerValues[1]);
    price.sell_mean_mpa = sellValues.mean;
    price.sell_median_mpa = sellValues.median;
    price.sell_std_dev = sellValues.stdev;
  }

  if(offerValues[0] && offerValues[1]) {
    price.profit_margin_min_mpa = price.sell_min_mpa - price.buy_max_mpa;
    price.profit_margin_max_mpa = price.sell_max_mpa - price.buy_min_mpa;
  }

  setPromises.push(price.save());

  return Promise.all(setPromises);

}


function setPriceValues(importEntry, price) {
  return new Promise(function(fulfill, reject) {
    try {
      Promise.all([getOfferValues(price, 'buy'), getOfferValues(price, 'sell')])
      .then(function(offerValues) {
        return setOfferValues(price, offerValues);
      }, reject)
      .then(function() {
        fulfill();
      }, reject)
    } catch(err) {
      reject(err)
    }
  });
}

function priceCurrencies(importEntry, currencyTypes) {
  return new Promise(function(fulfill, reject) {
    try {
      var pricingPromises = []
      for(mainCurrency in currencyTypes) {
        for(alternateCurrency in currencyTypes) {
          var main = currencyTypes[mainCurrency];
          var alternate = currencyTypes[alternateCurrency];
          if(main.get('id') != alternate.get('id'))
            pricingPromises.push(getCurrencyOffers(importEntry, currencyTypes[mainCurrency], currencyTypes[alternateCurrency]))
        }
      }
      Promise.all(pricingPromises)
      .then(function(buySellOffersCollection) {

        createPricePromises = []
        for(buySellOffersObj in buySellOffersCollection) {
          buySellOffers = buySellOffersCollection[buySellOffersObj];
          if(buySellOffers.buyOffers.length >  0 || buySellOffers.sellOffers.length > 0)
            createPricePromises.push(createPrice(buySellOffers));
        }


        return Promise.all(createPricePromises)
      }, reject)
      .then(function(prices) {

        var setPriceValuesPromises = [];

        for(var i in prices) {
          var price = prices[i];
          setPriceValuesPromises.push(setPriceValues(importEntry, price));
        }

        return Promise.all(setPriceValuesPromises);
      }, reject)
      .then(function() {
        fulfill();
      }, reject)
    } catch(err) {
      reject(err)
    }
  });

}

var Pricer = {
  run: function(importEntry) {
    return new Promise(function(fulfill, reject) {
      try {
        console.log('Pricing offers...')
        Models.CurrencyTypes.findAll({where: {}})
        .then(function(currencyTypes) {
          return priceCurrencies(importEntry, currencyTypes);
        })
        .then(function() {
          importEntry.complete = true;
          return importEntry.save()
        }, reject)
        .then(fulfill, reject)
      } catch(err) {
        reject(err)
      }
    });
  }
};

module.exports = Pricer;
