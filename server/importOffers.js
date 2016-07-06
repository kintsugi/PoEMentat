var request = require('request'); 
var cheerio = require('cheerio');
var promise = require('promise');
var async = require('async');

function getOffersPage(options) {
  var url = 'http://currency.poe.trade/search?league=' + options.league + '&online=' + options.online + '&want=' + options.want + '&have=' + options.have;
  return new Promise(function(fulfill, reject) {
    request(url, function(err, res, body) {
      if(!err && res.statusCode == 200) {
        fulfill({league: options.league, body: body})
      } else
        reject(err);
    })
  })
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
  return new Promise(function(fulfill, reject) {
    async.each(htmlOffers, iterFunction, function(err) {
      if(err)
        reject(err)
      else
        fulfill(offers);
    });
  });
}



module.exports = function(options) {
  options = options || {};
  options.league = options.league || 'Hardcore Prophecy';
  options.online = options.online ? 'x' : '';
  options.want = options.want || '';
  options.have = options.have || '';
  return new Promise(function(fulfill, reject) {
    getOffersPage(options)
    .then(parseOffersPage, reject)
    .then(fulfill, reject)
  });
}

