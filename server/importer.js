var importCurrencyTypes = require('./importCurrencyTypes.js')
var importOffers = require('./importOffers.js')
var Models = require('./database.js').models;
var Promise = require('promise');

function getCurrencyTypesMap() {
  return new Promise(function(fulfill, reject) {
    Promise.all([
      Models.CurrencyTypes.findAll({where: {}}),
      importCurrencyTypes()
    ]).then(function(typesArr) {
      try {
        var prevCurrencyTypes = {};
        var newCurrencyTypes = typesArr[1];
        typesArr[0].map(function(k) {return prevCurrencyTypes[k.dataValues.id] = k.dataValues})

        fulfill({
          prevCurrencyTypes: prevCurrencyTypes,
          newCurrencyTypes: newCurrencyTypes
        });
      } catch(err) {
        reject(err);
      }
    }, reject);
  });
}

function validateCurrencyTypes(currencyTypesMap) {
  return new Promise(function(fulfill, reject) {
    try {
      var prevTypes = currencyTypesMap.prevCurrencyTypes;
      var newTypes = currencyTypesMap.newCurrencyTypes;

      if(newTypes.length == 0)
        fulfill(prevTypes);

      for(var type in prevTypes) {
        var prevType = prevTypes[type];
        var newType = newTypes[type];
        if(!prevType || !newType || prevType.id != newType.id || prevType.name != newType.name)
          reject(newTypes);
      }
      for(var type in newTypes) {
        var prevType = prevTypes[type];
        var newType = newTypes[type];
        if(!prevType || !newType || prevType.id != newType.id || prevType.name != newType.name)
          reject(newTypes);
      }

      fulfill(prevTypes);
    } catch(err) {
      reject(err);
    }
  });
}

function updateCurrencyTypes(newTypes) {
  return new Promise(function(fulfill, reject) {
    try {
      var newTypesArray = Object.keys(newTypes).map(function(k) {return newTypes[k]});

      Models.CurrencyTypes.destroy({where: {}})
      .then(function() {
        return Models.CurrencyTypes.bulkCreate(newTypesArray)
      }, reject)
      .then(fulfill, reject)
    } catch(err) {
      reject(err);
    }
  });
}


function initCurrencyTypes() {
  return new Promise(function(fulfill, reject) {
    try {
      getCurrencyTypesMap()
      .then(validateCurrencyTypes, reject)
      .then(fulfill, function(result) {
        if(result instanceof Error)
          reject(result)
        else {
          return updateCurrencyTypes(result);
        }
      })
      .then(fulfill, reject);
    } catch(err) {
      reject(err);
    }
  });
  
}

function init() {
  return new Promise(function(fulfill, reject) {
    initCurrencyTypes().then(fulfill, reject);
  });

}

function saveImportOffers(offers) {
  return new Promise(function(fulfill, reject) {
    try {
      if(offers.length > 0) {
        console.log('Saving ' + offers.length + ' offers...')
        Models.Imports.create({}).then(function(importEntry) {
          for(var offer in offers)
            offers[offer].import_id = importEntry.dataValues.id;

          Models.Offers.bulkCreate(offers)
          .then(function() {
            fulfill(importEntry)
          }, reject);
        }, reject)
      }
    }catch(err) {
      reject(err);
    }
  })
}

var Importer = {

  run: function(options) {
    return new Promise(function(fulfill, reject) {
      try {
        init().then(function() {
          console.log('Downloading from currency.poe.trade...')
          return importOffers(options);
        }, reject)
        .then(saveImportOffers, reject)
        .then(fulfill, reject);
      } catch(err) {
        reject(err);
      }
    });
  }
};

module.exports = Importer;
