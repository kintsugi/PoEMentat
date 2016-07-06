var path = require('path')
var Promise = require('promise');
var express = require('express')
var throwErr = require('./throwErr.js');
var importer = require('./importer.js');
var pricer = require('./pricer.js');
var database = require('./database.js')
var historian = require('./priceHistorian.js')


function init(app) {
  app.use(express.static(path.join(__dirname + '/client')));

  app.get('/', function(req, res){
    res.sendFile('index.html');
  });

  app.get('/currencies', function(req, res) {
    database.models.CurrencyTypes.findAll({})
    .then(function(currencyTypes) {
      res.send(JSON.stringify(currencyTypes))
    }, throwErr)
  })

  app.get('/import', function(req, res) {
    importer.run({online: true})
    .then(function(importEntry) {
      try {
        return pricer.run(importEntry);
      } catch(err) {
        throwErr(err)
      }
    }, throwErr)
    .then(function() {
      res.send('import complete');
    }, throwErr)
  })

  app.get('/history', function(req, res) {
    var options = {
      main_currency_id: parseInt(req.query.main_currency_id) || 4,
      alternate_currency_id: parseInt(req.query.alternate_currency_id) || 1,
      historyLength: parseInt(req.query.historyLength) || 1000 * 60 * 60 * 24 * 7,
      segmentLength: parseInt(req.query.segmentLength) || 1000 * 60,
      slowMovingAvgLength: parseInt(req.query.slowMovingAvgLength) || 1000 * 60 * 60 * 24,
      fastMovingAvgLength: parseInt(req.query.fastMovingAvgLength) || 1000 * 60 * 60,
      donchianPeriod: parseInt(req.query.donchianPeriod) || 5,
    }
    historian.getHistory(options)
    .then(function(history) {
      res.send(JSON.stringify(history))
    }, throwErr)
  });

  app.get('/currentOffers', function(req, res) {
    var sell_currency_id = parseInt(req.query.sell_currency_id) || 4,
    buy_currency_id = parseInt(req.query.buy_currency_id) || 1;
    database.models.Imports.findAll({
      where: {
        complete: true,
      },
      order: 'createdAt DESC'
    })
    .then(function(imports) {
      var importEntry = imports[0] || null;
      console.log(importEntry.dataValues)
      return database.models.Offers.findAll({
        where: {
          import_id: importEntry.id,
          sell_currency_id: sell_currency_id,
          buy_currency_id: buy_currency_id,
        },
        order: 'id ASC'
      })
    }, throwErr)
    .then(function(offers) {
      res.send(JSON.stringify(offers));
    }, throwErr)
  });

  app.listen(3000);
}

var defaultImportInterval = 40000;
var skippedIntervals = 0;
var skippedIntervalsTimeout = 3;
var timeoutIntervalStep = 5000;
var importInProgress = false;

function autoImport(interval) {
  return new Promise(function(fulfill, reject) {
    console.log('Running Importer...')
    importInProgress = true;
    var startTime = new Date().getTime();
    importer.run({online: true})
      .then(function(importEntry) {
        try {
          return pricer.run(importEntry);
        } catch(err) {
          throwErr(err)
        }
      }, throwErr)
      .then(function() {
        var endTime = new Date().getTime();
        var executionTime = (endTime - startTime);
        var executionTimeInSeconds = executionTime / 1000;
        var secondsUntilNextImport = (interval - executionTime) / 1000;
        console.log('Importer completed in ' + executionTimeInSeconds + ' seconds at ' + new Date());
        console.log('Running next import in ' + secondsUntilNextImport + ' seconds');
        importInProgress = false;
        fulfill();
      }, throwErr)
  });
}

  
module.exports = {
  app: express(),

  startServer: function() {
    init(this.app);
    console.log('Server Online')
  },

  startAutoImport: function(interval) {
    interval = interval || defaultImportInterval;
    autoImport(interval)
    .then(function() {
      var intervalId;

      var intervalFunction = function() {
        if(!importInProgress) {
          skippedIntervals = 0;
          autoImport(interval);
        } else {
          if(skippedIntervals > skippedIntervalsTimeout) {
            skippedIntervals = 0;
            interval += timeoutIntervalStep;
            console.log('Import timeout, increasing interval to ' + (interval / 1000) + ' seconds')
            clearInterval(intervalId);
            intervalId = setInterval(intervalFunction, interval)
          } else {
            console.log('Import still in progress, skipping import interval, ' + (skippedIntervalsTimeout - skippedIntervals) + ' attempts remaining before timeout');
            skippedIntervals++;
          }
        }
      }
      intervalId = setInterval(intervalFunction, interval)
    })
  },
};
