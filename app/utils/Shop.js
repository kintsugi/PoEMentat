let rp = require('request-promise')
const constants = require('../constants')

export default class Shop {
  constructor(settings, currencyTypes) {
    this.settings = settings
    this.currencyTypes = currencyTypes
  }

  init() {
    let shop = []
    for(let mainCurrencyType of this.currencyTypes.list) {
      shop[mainCurrencyType.id] = []
    }
    return shop
  }

  postShop(settings, shop, markets, inventory) {
    let league = settings.leagueName.replace(' ', '+')
    let cookie = `league=${league}; apikey=${settings.poeTradeAPIKey}`
    let formString = `league=${league}&apikey=${settings.poeTradeAPIKey}`
    let orders = []
    for(let mainKey in shop) {
      let mainCurrencyShop = shop[mainKey]
      for(let altKey in mainCurrencyShop) {
        let shopOrder = shop[mainKey][altKey] || {}
        if(shopOrder.autotradeEnabled || shopOrder.overridden) {
          orders.push(shopOrder)
        } else {
          shopOrder.postedOrder = {}
        }
      }
    }

    if(!orders.length) {
      return Promise.resolve(shop)
    }
    for(let order of orders) {
      let offerDetails, buyEnabled = true, sellEnabled = true
      let market = markets[order.mainCurrencyType.id][order.alternateCurrencyType.id]
      if(order.overridden) {
        offerDetails = order.overriddenOrder
      } else if(order.autotradeEnabled) {
        offerDetails = market.bestOfferDetails
      }
      let sellCurrency = market.bestOfferDetails.sellCurrencyType
      let buyCurrency = market.bestOfferDetails.buyCurrencyType
      let sellOfferSellValue = parseFloat(offerDetails.sellOffer.sell_value)
      let sellOfferBuyValue = parseFloat(offerDetails.sellOffer.buy_value)
      let buyOfferSellValue = parseFloat(offerDetails.buyOffer.sell_value)
      let buyOfferBuyValue = parseFloat(offerDetails.buyOffer.buy_value)
      if(order.minBulk) {
        let origSellOfferSellValue = sellOfferSellValue, origSellOfferBuyValue = sellOfferBuyValue, origBuyOfferSellValue = buyOfferSellValue, origBuyOfferBuyValue = buyOfferBuyValue
        while(buyOfferSellValue < order.minBulk) {
          buyOfferBuyValue += origBuyOfferBuyValue
          buyOfferSellValue += origBuyOfferSellValue
        }
        while(sellOfferBuyValue < order.minBulk) {
          sellOfferBuyValue += origSellOfferBuyValue
          sellOfferSellValue += origSellOfferSellValue
        }
      }

      let sellOfferSellInventoryItem = inventory.idDict[market.bestOfferDetails.sellOffer.sellCurrencyType.id]
      let buyOfferSellInventoryItem = inventory.idDict[market.bestOfferDetails.buyOffer.sellCurrencyType.id]


      if(sellOfferSellInventoryItem.count < sellOfferSellValue) {
        sellEnabled = false
      }
      if(buyOfferSellInventoryItem.count < buyOfferSellValue) {
        buyEnabled = false
      }

      order.postedOrder = {}

      if(order.type == 'sell') {
        buyEnabled = false
      } else if(order.type == 'buy') {
        sellEnabled = false
      }
      if(sellEnabled) {
        order.postedOrder.sellOffer = {
          buy_value: sellOfferBuyValue,
          sell_value: sellOfferSellValue,
        }
        console.log(order.postedOrder.sellOffer)
        formString += '&sell_currency=' + market.bestOfferDetails.sellOffer.sellCurrencyType.fullName
        formString += '&sell_value=' + sellOfferSellValue
        formString += '&buy_currency=' + market.bestOfferDetails.sellOffer.buyCurrencyType.fullName
        formString += '&buy_value=' + sellOfferBuyValue
      }

      if(buyEnabled) {
        order.postedOrder.buyOffer = {
          buy_value: buyOfferBuyValue,
          sell_value: buyOfferSellValue,
        }
        console.log(order.postedOrder.buyOffer)
        formString += '&sell_currency=' + market.bestOfferDetails.buyOffer.sellCurrencyType.fullName
        formString += '&sell_value=' + buyOfferBuyValue
        formString += '&buy_currency=' + market.bestOfferDetails.buyOffer.buyCurrencyType.fullName
        formString += '&buy_value=' + buyOfferSellValue
      }
    }

    let uri = constants.urls.currencyPoeTradeShop + league

    return rp({
      uri: uri,
      method: 'POST',
      followAllRedirects: true,
      headers: {
        'Chookie': cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: formString
    })
      .then((data) => {
        return Promise.resolve(shop.slice())
      })
      .catch((err) => {
        throw err
      })
  }



}
