let rp = require('request-promise')
let cheerio = require('cheerio')
let async = require('async')
let dirTree = require('directory-tree')
import {
  download,
  serializeJSON,
} from './functions'
const constants = require('../constants')

export default class CurrencyTypesParser {

  constructor() {
    this.currencyTypesList = []
    this.currencyTypesIdDict = {}
    this.currencyTypesNameDict = {}
  }

  getCurrencyTypes() {
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
      .then(() => {
        return serializeJSON(constants.paths.data.currencyTypes, this.getParsedCurrencyTypes(), {spaces: 2})
      })
      .catch((err) => {
        throw err
      })
      .then(() => {
        return this.getParsedCurrencyTypes()
      })
      .catch((err) => {
        throw err
      })
  }

  getParsedCurrencyTypes() {
    return {
      list: this.currencyTypesList,
      idDict: this.currencyTypesIdDict,
      nameDict: this.currencyTypesNameDict
    }
  }

  getPage() {
    return rp(constants.urls.currencyPoeTrade)
  }

  parsePage(html) {
    let $ = cheerio.load(html)
    let currenciesHtml = $('#currency-want').find('.currency-selectable').each((i, elem) => {
      let imgHtml = $(elem).children('img')[0]
      let currency = {
        id: $(elem).attr('data-id'),
        name: $(elem).attr('title'),
        imgUrl: $(imgHtml).attr('src'),
        imgFilename: $(imgHtml).attr('src').substr(1)
      }
      if(!currency.id) {
        console.log(currency)
      }
      this.currencyTypesList.push(currency)
      this.currencyTypesIdDict[currency.id] = currency
      this.currencyTypesNameDict[currency.name] = currency
    })
  }

  findMissingCurrencyTypes() {
    let missingCurrencyTypes = []
    let existingCurrencyFileNames = []
    let currencyImgFolder = dirTree(constants.paths.currencyImgs)
    let existingCurrencyImgs = currencyImgFolder.children.map((file) => {
      //will [1] error if the result is null? or'd it to be safe
      return file.path.split(constants.paths.app)[1] || null
    })
    //for each currencyType check if it has a matching filename
    for(let currency of this.currencyTypesList) {
      if(existingCurrencyImgs.indexOf(currency.imgUrl) == -1) {
        missingCurrencyTypes.push(currency)
      }
    }
    return missingCurrencyTypes
  }

  downloadImages() {
    return new Promise((resolve, reject) => {
      let missingCurrencyTypes = this.findMissingCurrencyTypes()
      async.each(missingCurrencyTypes, (currencyType, next) => {
        let uri = `${constants.urls.currencyPoeTrade}${currencyType.imgUrl}`
        let filename = `${constants.paths.app}${currencyType.imgUrl}`
        console.log(`Downloading ${uri} to ${filename}`)
        download(uri, filename)
          .then(() => {
            return next()
          })
          .catch((err) => {
            return next(err)
          })
      }, (err) => {
        if(err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
