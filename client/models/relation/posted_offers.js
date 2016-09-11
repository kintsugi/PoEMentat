var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.PostedOffers.belongsTo(Schemas.CurrencyTypes, {
    as: 'SellCurrency',
    foreignKey: 'sell_currency_id',
  });
  Schemas.PostedOffers.belongsTo(Schemas.CurrencyTypes, {
    as: 'BuyCurrency',
    foreignKey: 'buy_currency_id',
  });

  Schemas.PostedOffers.hasMany(Schemas.Trades, {
    as: 'CompletedTrades',
    foreignKey: 'posted_offer_id',
  });
}
