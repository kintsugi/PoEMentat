var sequelize = require('./models/connection.js')
var schemas = require('./models/schemas.js')
var setRelations = require('./models/relations.js')

module.exports = {
  init: function() {
    return new Promise(function(fulfill, reject) {
      sequelize.authenticate()
      .then(function() {
        setRelations();
        sequelize.sync()
        .then(function () {
          fulfill(schemas);
        })
        .catch(reject);
      })
      .catch(reject);
    });
  },
  models: schemas,
  clear: function() {
    return sequelize.dropAllSchemas();
  }
}
