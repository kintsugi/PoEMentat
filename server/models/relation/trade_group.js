var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.TradeGroups.belongsTo(Schemas.CurrencyTypes, {
    as: 'MainCurrency',
    foreignKey: 'main_currency_id',
  });
  Schemas.TradeGroups.belongsTo(Schemas.CurrencyTypes, {
    as: 'AlternateCurrency',
    foreignKey: 'alternate_currency_id',
  });
  Schemas.TradeGroups.hasMany(Schemas.Pricings, {
    as: 'Pricings',
    foreignKey: 'trade_group_id',
  })
  Schemas.TradeGroups.hasMany(Schemas.PricingHistories, {
    as: 'PricingHistories',
    foreignKey: 'trade_group_id',
  });
}
