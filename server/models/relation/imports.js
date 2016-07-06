var Schemas = require('../schemas.js')

module.exports = function() {
  Schemas.Imports.hasMany(Schemas.Offers, {
    as: 'Offers',
    foreignKey: 'import_id',
  });
  Schemas.Imports.hasMany(Schemas.Pricings, {
    as: 'Pricings',
    foreignKey: 'import_id',
  });
}
