let rp = require('request-promise')
let cheerio = require('cheerio')
let async = require('async')
let dirTree = require('directory-tree')
import {
  download,
  serializeJSON,
  readJSON,
  getItemCategory,
} from './functions'
const constants = require('../constants')
let currencyTypeData = require('../data/currency-types')
let currencyAbbreviationData = require('../data/currency-abbreviations')

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
        if (process.env.NODE_ENV === 'development') {
          return serializeJSON(constants.paths.data.currencyTypes, this.getParsedCurrencyTypes(), {spaces: 2})
        }
        return Promise.resolve()
      })
      .catch((err) => {
        throw err
      })
      .then(() => {
        if(process.env.NODE_ENV === 'development') {
          return this.serializeCurrrencyAbbreviations()
        }
        return Promise.resolve()
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
      let currency = {
        id: $(elem).attr('data-id'),
        name: $(elem).attr('data-title'),
        className: $(elem).attr('class').split(' '),
        text: $(elem).text().trim()
      }
      currency.category = getItemCategory(currency.id)
      if(currency.category == 'divination card' || currency.category == 'map') {
        currency.name = currency.text
      }
      if(process.env.NODE_ENV === 'production') {
        currency.fullName = currencyAbbreviationData[currency.name]
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

  serializeCurrrencyAbbreviations() {
    return readJSON(constants.paths.data.currencyAbbreviations)
      .then((currencyAbbreviations) => {
        let abbreviatedCategories = ['currency', 'fragment', 'essence', 'breach']
        for(let currencyType of this.currencyTypesList) {
          if(abbreviatedCategories.indexOf(currencyType.category) != -1 && !currencyAbbreviations[currencyType.name]) {
            if(currencyType.category == 'fragment' || currencyType.category == 'essence' || currencyType.category == 'breach') {
              currencyAbbreviations[currencyType.name] = this.formatCurrencyAbbreviation(currencyType.name)
            } else {
              currencyAbbreviations[currencyType.name] = ""
            }
          } else {
            currencyType.fullName = currencyAbbreviations[currencyType.name]
          }
        }
        return serializeJSON(constants.paths.data.currencyAbbreviations, currencyAbbreviations, {spaces: 2})
      })
      .catch((err) => {
        throw err
      })

  }

  formatCurrencyAbbreviation(abbreviation) {
    return abbreviation
      .split(/ /g).map((word) => {
        if(word == 'of') {
          return word
        }
        return `${word.substring(0,1).toUpperCase()}${word.substring(1)}`
      })
      .join(" ")
  }

  downloadImages() {
    let uri32 = constants.urls.currency32Img
    let filename32 = constants.paths.currency32Img
    let uri20 = constants.urls.currency20Img
    let filename20 = constants.paths.currency20Img
    return Promise.all([download(uri32, filename32), download(uri20, filename20)])
  }

  downloadCSS() {
    return new Promise((resolve, reject) => {
      let uri = constants.urls.currency32Css
      let filename = constants.paths.currency32Css
      download(uri, filename)
        .then(() => {
          resolve()
          return
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
