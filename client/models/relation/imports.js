var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.Imports.hasMany(Schemas.InventoryCurrencies, {
    as: 'InventoryCurrencies',
    foreignKey: 'import_id',
  });
}
