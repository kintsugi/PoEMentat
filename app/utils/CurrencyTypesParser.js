let constants = require('../constants')
let rp = require('request-promise')
let cheerio = require('cheerio')

export default class CurrencyTypesParser {
  constructor(settings) {
    this.currencyTypes = {}
  }

  getTypes() {
    return this.getPage()
      .then(this.parsePage)
      .catch((err) => {
        throw err
      })
  }

  parsePage(html) {
    return html
  }

  getPage() {
    return rp(constants.urls.currencyPoeTrade)
  }
}
