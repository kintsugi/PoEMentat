var importCurrencyTypes = require('./importCurrencyTypes.js');
var Models = require('./database.js').models;

function getCurrencyTypesMap() {
  return new Promise(function(fulfill, reject) {
    Promise.all([
      Models.CurrencyTypes.findAll({where: {}}),
      importCurrencyTypes()
    ]).then(function(typesArr) {
      try {
        var prevCurrencyTypes = {};
        var newCurrencyTypes = typesArr[1];
        typesArr[0].map(function(k) {prevCurrencyTypes[k.dataValues.id] = k.dataValues;});

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

      if(newTypes.length === 0)
        fulfill(prevTypes);

      for(let type in prevTypes) {
        prevType = prevTypes[type];
        newType = newTypes[type];
        if(!prevType || !newType || prevType.id != newType.id || prevType.name != newType.name)
          reject(newTypes);
      }
      for(let type in newTypes) {
        prevType = prevTypes[type];
        newType = newTypes[type];
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
      var newTypesArray = Object.keys(newTypes).map(function(k) {return newTypes[k];});

      Models.CurrencyTypes.destroy({where: {}})
      .then(function() {
        return Models.CurrencyTypes.bulkCreate(newTypesArray);
      }, reject)
      .then(fulfill, reject);
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
          reject(result);
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

var Importer = {
  run: function() {
    return new Promise(function(fulfill, reject) {
      try {
        init().then(fulfill, reject);
      } catch(err) {
        reject(err);
      }
    });
  }
};

module.exports = Importer;
