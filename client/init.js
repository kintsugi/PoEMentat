var throwErr = require('./static/js/throwErr.js');
var database = require('./database.js')
var Emitter = require('./static/js/Emitter.js')
var request = require('request')
var config = require('./static/js/config')
var storage = require('./static/js/storage.js')

try {
  database.init()
  .then(validateCurrencies, throwErr)
  .then(validateSettings, throwErr)
  .then(() => {
    Emitter.emit('init complete');
  }, throwErr);
} catch(err) {
  console.log(err.stack);
}

function validateSettings() {
  return new Promise((fulfill, reject) => {
    try {
      storage.get('settings')
      .then((settings) => {

        if(!settings.updateFrequency) {
          settings.updateFrequency = config.defaultUpdateFrequencyInSeconds;
          return storage.set('settings', settings);
        } else {
          fulfill();
        }

      }, reject)
      .then(fulfill, reject)

    } catch(err) {
      reject(err)
    }
  });
}

function getCurrencies() {
  return new Promise((fulfill, reject) => {
    try {
      var url = config.hostUrl + '/currencies'
      request(url, function(err, res, body) {
        if(err) {
          reject(err)
        } else {
          fulfill(JSON.parse(body))
        }
      });
    } catch(err) {
      reject(err);
    }

  });
}


function validateCurrencies() {
  return new Promise((fulfill, reject) => {
    try {
      getCurrencies()
      .then((currencies) => {
        var upsertPromises = [];
        for(var i in currencies) {
          upsertPromises.push(database.models.CurrencyTypes.upsert(currencies[i]));
        }
        return Promise.all(upsertPromises);
      })
      .then(fulfill, reject)
    } catch(err) {
      reject(err)
    }
  });
}

