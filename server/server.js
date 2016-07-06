var throwErr = require('./throwErr.js');
var database = require('./database.js')

try {
  database.init().then(function(models) {
    console.log('Database Initialization Complete')
    var routes = require('./routes.js');
    routes.startServer();
    routes.startAutoImport();
  }) 
  .catch(throwErr)
} catch(err) {
  console.log(err.stack);
}


