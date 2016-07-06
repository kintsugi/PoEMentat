
var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.PricingHistories.belongsTo(Schemas.Imports, {
    as: 'Import',
    foreignKey: 'import_id',
  });
  Schemas.PricingHistories.belongsTo(Schemas.TradeGroups, {
    as: 'PricingHistory',
    foreignKey: 'trade_group_id',
  });

  Schemas.PricingHistories.hasMany(Schemas.Pricings, {
    as: 'Pricings',
    foreignKey: 'pricing_history_id',
  });
}
