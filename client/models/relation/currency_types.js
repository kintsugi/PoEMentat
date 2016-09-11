var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.CurrencyTypes.hasMany(Schemas.InventoryCurrencies, {
    as: 'InventoryCurrencies',
    foreignKey: 'currency_id',
  })
  Schemas.CurrencyTypes.hasMany(Schemas.Trades, {
    as: 'SellTrades',
    foreignKey: 'sell_currency_id',
  })
  Schemas.CurrencyTypes.hasMany(Schemas.Trades, {
    as: 'BuyTrades',
    foreignKey: 'buy_currency_id',
  })
  Schemas.CurrencyTypes.hasMany(Schemas.PostedOffers, {
    as: 'SellPostedOffers',
    foreignKey: 'sell_currency_id',
  })
  Schemas.CurrencyTypes.hasMany(Schemas.PostedOffers, {
    as: 'BuyPostedOffers',
    foreignKey: 'buy_currency_id',
  })
}
