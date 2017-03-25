let request = require('request')
let rp = require('request-promise')
let cheerio = require('cheerio')
let fs = require('fs')
let constants = require('../constants')

let download = (uri, filename) => {
  return new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        resolve()
      })
    })
  })
}

export default class CurrencyTypesParser {

  constructor() {
    this.currencyTypesList = []
    this.currencyTypesIdDict = []
    this.currencyTypesNameDict = {}
  }

  getTypes() {
    if(this.currencyTypesList.length) {
      throw new Error('CurrencyTypesParser currency types already parsed')
    }
    return this.getPage()
      .then((html) => {
        return this.parsePage(html)
      })
      .catch((err) => {
        throw err
      })
      .then(() => {
        return this.downloadImages()
      })
      .catch((err) => {
        throw err
      })

  }

  parsePage(html) {
    let $ = cheerio.load(html)
    let currenciesHtml = $('#currency-want').find('.currency-selectable').each((i, elem) => {
      let imgHtml = $(elem).children('img')[0]
      let currency = {
        id: $(elem).attr('data-id'),
        name: $(elem).attr('title'),
        imgUrl: $(imgHtml).attr('src'),
      }
      this.currencyTypesList.push(currency)
      this.currencyTypesIdDict[currency.id] = currency
      this.currencyTypesNameDict[currency.name] = currency
    })
    return {
      list: this.currencyTypesList,
      idDict: this.currencyTypesIdDict,
      nameDict: this.currencyTypesNameDict
    }
  }

  downloadImages() {
    for(let currencyType of this.currencyTypesList) {
      console.log(currencyType.imgUrl)
    }
  }

  getPage() {
    return rp(constants.urls.currencyPoeTrade)
  }
}
