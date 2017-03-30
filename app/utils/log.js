let log = require('electron-log')

if(process.env.NODE_ENV === 'production') {
  log.transports.console.level = 'warn'
}

module.exports = log
