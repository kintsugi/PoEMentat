var request = require('request'); 
var cheerio = require('cheerio');
var promise = require('promise');
var async = require('async');

function getCurrencyPage() {
  var url = 'http://currency.poe.trade/'
  return new Promise(function(fulfill, reject) {
    request(url, function(err, res, body) {
      if(!err && res.statusCode == 200) {
        fulfill(body)
      } else
        reject(err);
    })
  })
};

function parseCurrencyPage(currencyPage) {
  var $ = cheerio.load(currencyPage);
  var htmlCurrencyTypes = $('#currency-want').find('.currency-selectable');
  var currencyTypes = {};

  function iterFunction(htmlCurrencyType, next) {
    try {
      var id = $(htmlCurrencyType).attr('data-id');
      currencyTypes[id] = {
        id: $(htmlCurrencyType).attr('data-id'),
        name: $(htmlCurrencyType).attr('title'),
      };
      next();
    } catch(err) {
      next(err);
    }
  }
  return new Promise(function(fulfill, reject) {
    async.each(htmlCurrencyTypes, iterFunction, function(err) {
      if(err)
        reject(err)
      else
        fulfill(currencyTypes);
    });
  });
};

module.exports = function() {
  return new Promise(function(fulfill, reject) {
    getCurrencyPage()
    .then(parseCurrencyPage, reject)
    .then(fulfill, reject)
  });
};
