var importCurrencyTypes = require('./importCurrencyTypes.js');

var Importer = {
  run: function() {
    return new Promise(function(fulfill, reject) {
      try {
        importCurrencyTypes()
        .then(fulfill, reject);
      } catch(err) {
        reject(err);
      }
    });
  }
};

module.exports = Importer;
