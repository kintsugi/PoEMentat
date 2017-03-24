let rp = require('request-promise')
let constants = require('../constants')

class InventoryParser {
  constructor(options) {
    this.settings = options.settings
    this.requestOptions = {
      method: 'GET',
      url: constants.urls.stashItems,
      qs: {
        accountName: this.settings.poeUsername,
        tabIndex: 0,
        league: this.settings.leagueName,
        tabs: 0
      },
      headers: {
        cookie: 'POESESSID=' + this.settings.poeSessionId + ';',
      }
    }
  }

  getInventory() {

  }
}

module.exports = InventoryParser
