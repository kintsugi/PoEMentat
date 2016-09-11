var sequelize = require('sequelize');
var connection = new sequelize('PoEMentat', 'root', process.env.PoEMentatAuth, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

module.exports = connection;
