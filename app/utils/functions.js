let request = require('request')
let fs = require('fs')
let jsonfile = require('jsonfile')
const constants = require('../constants')
const config = require('../config')
const currencyAbbreviations = require('../data/currency-abbreviations')
const currencyCategories = constants.misc.currencyCategories

export function download(uri, filename) {
  return new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body) {
      if(err) {
        return reject(err)
      }
      request(uri).pipe(fs.createWriteStream(filename)).on('close', () => {
        console.log(filename)
        resolve()
      })
    })
  })
}

export function serializeJSON(filename, obj, options) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(filename, obj, options, (err) => {
      if(err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export function readJSON(filename) {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(filename, (err, obj) => {
      if(err) {
        return reject(err)
      }
      resolve(obj)
    })
  })
}

export function getStackSize(item) {
  if(item.properties) {
    for(let prop of item.properties) {
      if(prop.name == 'Stack Size') {
        let stackSizeString = prop.values[0][0]
        let stackSizeFraction = stackSizeString.split('/')
        return parseInt(stackSizeFraction[0])
      }
    }
  }
	return 1
}

export function checkItemCategory(id, category) {
  if(id >= category[0] && id <= category[1]) {
    return true
  }
  return false
}

export function checkItemCategoryName(id, categoryName) {
  return checkItemCategory(id, currencyCategories[categoryName])
}

export function getItemCategory(id) {
  //silver and relic key is currency but isnt in the currency range
  if(id == 35 || id == 494) {
    return 'currency'
  }
  for(let category in currencyCategories) {
    let categoryObj = currencyCategories[category]
    if(checkItemCategory(id, categoryObj)) {
      return category
    }
  }

}

export function getAbbreviatedCurrencyName(name) {
  for(let key in currencyAbbreviations) {
    if(currencyAbbreviations[key] == name) {
      return key
    }
  }
}

export function matchInventoryItemToCurrency(currencyTypes, item) {
  let abbreviatedName = getAbbreviatedCurrencyName(item.typeLine) || item.typeLine.toLowerCase()
  for(let currencyType of currencyTypes.list) {
    if(abbreviatedName == currencyType.name.toLowerCase() || abbreviatedName == currencyType.fullName) {
      return currencyType
    }
  }
}

export function calculateWorth(mainCurrencyType, market, inventoryItem) {
  let alternateCurrencyCount = inventoryItem.count
  let buyOffer = market.bestOfferDetails.buyOffer
  let sellOffer = market.bestOfferDetails.sellOffer
  let buyWorth = 0, sellWorth = 0
  if(buyOffer) {
    buyWorth = alternateCurrencyCount / buyOffer.ratios.buyPerSell
  }
  if(sellOffer) {
    sellWorth = alternateCurrencyCount / sellOffer.ratios.sellPerBuy
  }
  return {
    ...inventoryItem,
    buyWorth,
    sellWorth,
  }
}

export function calculateTotalWorth(mainCurrencyType, markets, inventory) {
  let mainCurrencyCount = inventory.idDict[mainCurrencyType.id].count
  let buyWorth = mainCurrencyCount, sellWorth = mainCurrencyCount
  let alternateWorthList = []
  if(!markets.length) {
    return
  }
  let mainCurrencyMarkets = markets[mainCurrencyType.id]
  for(let altKey in mainCurrencyMarkets) {
    if(altKey == mainCurrencyType.id) {
      continue
    }
    let market = mainCurrencyMarkets[altKey]
    let inventoryItem = inventory.idDict[altKey]
    let alternateWorth = calculateWorth(mainCurrencyType, market, inventoryItem)
    alternateWorthList[inventoryItem.id] = alternateWorth
  }
  buyWorth = alternateWorthList.reduce((acc, val) => acc+ val.buyWorth, buyWorth)
  sellWorth = alternateWorthList.reduce((acc, val) => acc+ val.sellWorth, sellWorth)
  return {
    buyWorth,
    sellWorth,
    alternateWorthList
  }

}
