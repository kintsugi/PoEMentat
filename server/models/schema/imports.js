var Sequelize = require('sequelize')
var sequelize = require('../connection.js');

var Import = sequelize.define('import', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});


module.exports = Import;
