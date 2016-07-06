module.exports = function() {
  require('./relation/currency_types.js')();
  require('./relation/imports.js')();
  require('./relation/offers.js')();
  require('./relation/pricings.js')();
  require('./relation/offers_pricings.js')();
  require('./relation/price_histories.js')();
  require('./relation/trade_group.js')();
};
