var mysql = require('mysql');
var request = require('request'); 
var cheerio = require('cheerio')
var promise = require('promise')
var async = require('async')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.PoEMentatDatabasePassword,
  database : 'PoEMentat'
});

function connectToDB() {
  return new Promise(function(fulfill, reject) {
    connection.connect(function(err) {
      if (err)
        reject(err);
      else
        fulfill();
    });
  })
}

function getOffersPage(options) {
  options = options || {};
  options.league = options.league || '';
  options.online = options.online ? 'x' : '';
  options.want = options.want || '';
  options.have = options.have || '';
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

function parseOffers(offersPage) {
  var $ = cheerio.load(offersPage.body);
  var htmlOffers = $('.displayoffer');
  var offers = [];

  function iterFunction(htmlOffer, next) {
    offers.push({
      league: offersPage.league,
      username: $(htmlOffer).attr('data-username'),
      ign: $(htmlOffer).attr('data-ign'),
      sellCurrency: $(htmlOffer).attr('data-sellcurrency'),
      sellValue: $(htmlOffer).attr('data-sellvalue'),
      buyCurrency: $(htmlOffer).attr('data-buycurrency'),
      buyValue: $(htmlOffer).attr('data-buyvalue'),
    })
    next();
  }
  return new Promise(function(fulfill, reject) {
    async.each(htmlOffers, iterFunction, function(err) {
      if(err)
        reject(err)
      else
        fulfill(offers);
    })
  })
}

function writeOffers(offers) {
  var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(now)

  function iterFunction(offer, next) {
    var stmt = 'INSERT INTO offers(league, username, ign, sell_currency, sell_value, buy_currency, buy_value, time) VALUES(?, ?, ?, ?, ?, ?, ?, ?)'
    var params = [
      offer.league,
      offer.username,
      offer.ign,
      offer.sellCurrency,
      offer.sellValue,
      offer.buyCurrency,
      offer.buyValue,
      now
    ];
    connection.query(stmt, params, function(err) {
      if(err)
        next(err);
      else
        next();
    })
  }
  return new Promise(function(fulfill, reject) {
    async.each(offers, iterFunction, function(err) {
      if(err)
        reject(err)
      else
        fulfill();
    });
  });

}

function importOffers(league) {
  getOffersPage({league: league, online: true})
  .then(parseOffers, throwErr)
  .then(writeOffers, throwErr)
  .then(function() {
    connection.end();
  })
}

function throwErr(err) {
  throw err;
}

function main() {
  connectToDB()
  .then(function() {
    importOffers('Hardcore Prophecy');
  }, throwErr)

}


try {
  main();
} catch(err) {
  console.log(err.stack);
}
