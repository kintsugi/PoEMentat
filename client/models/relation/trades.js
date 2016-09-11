var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.Trades.belongsTo(Schemas.CurrencyTypes, {
    as: 'SellCurrency',
    foreignKey: 'sell_currency_id',
  });
  Schemas.Trades.belongsTo(Schemas.CurrencyTypes, {
    as: 'BuyCurrency',
    foreignKey: 'buy_currency_id',
  });

  Schemas.Trades.belongsTo(Schemas.PostedOffers, {
    as: 'PostedOffer',
    foreignKey: 'posted_offer_id',
  });
}
