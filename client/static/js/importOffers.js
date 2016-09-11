var request = require('request');
var cheerio = require('cheerio');
var promise = require('promise');
var async = require('async');

function getOffersPage(options) {
  var url = 'http://currency.poe.trade/search?league=' + options.league + '&online=' + options.online;
  var wantUrl = '&want=';
  var haveUrl = '&have=';
  for(var i in options.want) {
    wantUrl += options.want[i] + '-';
  }
  for(var i in options.have) {
    haveUrl += options.have[i] + '-';
  }
  url += wantUrl + haveUrl;

  return new Promise((fulfill, reject) => {
    request(url, function(err, res, body) {
      if(!err && res.statusCode == 200) {
        fulfill({league: options.league, body: body})
      } else
        reject(err);
    })
  })
}

function sortOffers(offers) {
  var sortedOffers = {};
  for(var i in offers) {
    var offer = offers[i];
    var sellCurrencyId = offer.sell_currency_id;
    var buyCurrencyId = offer.buy_currency_id;
    var sortedOffer = sortedOffers[sellCurrencyId + '-' + buyCurrencyId];
    if(sortedOffer) {
      sortedOffer.push(offer);
    } else {
      sortedOffers[sellCurrencyId + '-' + buyCurrencyId] = [offer];
    }
  }
  return sortedOffers;
}

function parseOffersPage(offersPage) {
  var $ = cheerio.load(offersPage.body);
  var htmlOffers = $('.displayoffer');
  var offers = [];

  function iterFunction(htmlOffer, next) {
    try {
      offers.push({
        league: offersPage.league,
        username: $(htmlOffer).attr('data-username'),
        ign: $(htmlOffer).attr('data-ign'),
        sell_currency_id: $(htmlOffer).attr('data-sellcurrency'),
        sell_value: $(htmlOffer).attr('data-sellvalue'),
        buy_currency_id: $(htmlOffer).attr('data-buycurrency'),
        buy_value: $(htmlOffer).attr('data-buyvalue'),
      });
      next();
    } catch(err) {
      next(err);
    }

  }
  return new Promise((fulfill, reject) => {
    async.each(htmlOffers, iterFunction, function(err) {
      if(err)
        reject(err)
      else
        fulfill(sortOffers(offers));
    });
  });
}



module.exports = function(options) {
  options = options || {};
  options.league = options.league || 'Hardcore Prophecy';
  options.online = options.online ? 'x' : '';
  options.want = options.want || [];
  options.have = options.have || [];
  return new Promise((fulfill, reject) => {
    getOffersPage(options)
    .then(parseOffersPage, reject)
    .then(fulfill, reject)
  });
}

