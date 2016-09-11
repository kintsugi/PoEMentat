module.exports = function() {
  require('./relation/imports.js')();
  require('./relation/currency_types.js')();
  require('./relation/inventory_currencies.js')();
  require('./relation/trades.js')();
  require('./relation/posted_offers.js')();
};
