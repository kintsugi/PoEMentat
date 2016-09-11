var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.InventoryCurrencies.belongsTo(Schemas.Imports, {
    as: 'Import',
    foreignKey: 'import_id',
  });
  Schemas.InventoryCurrencies.belongsTo(Schemas.CurrencyTypes, {
    as: 'CurrencyType',
    foreignKey: 'currency_id',
  });
}
