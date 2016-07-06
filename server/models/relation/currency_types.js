var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.CurrencyTypes.hasMany(Schemas.Offers, {
    as: 'SellOffers',
    foreignKey: 'sell_currency_id',
  });
  Schemas.CurrencyTypes.hasMany(Schemas.Offers, {
    as: 'BuyOffers',
    foreignKey: 'buy_currency_id',
  });
  Schemas.CurrencyTypes.hasMany(Schemas.Pricings, {
    as: 'MainPricings',
    foreignKey: 'main_currency_id',
  });
  Schemas.CurrencyTypes.hasMany(Schemas.Pricings, {
    as: 'AlternatePricings',
    foreignKey: 'alternate_currency_id',
  });
  Schemas.CurrencyTypes.hasMany(Schemas.TradeGroups, {
    as: 'MainTradeGroups',
    foreignKey: 'main_currency_id',
  });
  Schemas.CurrencyTypes.hasMany(Schemas.Pricings, {
    as: 'AlternateTradeGroups',
    foreignKey: 'alternate_currency_id',
  });
}
