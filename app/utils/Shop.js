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
    let orders = this.getOrdersToPost(settings, shop)

    formString += this.getShopFormString(settings, markets, inventory, orders)

    let uri = constants.urls.currencyPoeTradeShop + league

    console.log(formString)
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

  getOrdersToPost(settings, shop) {
    let orders = []
    for(let mainKey in shop) {
      let mainCurrencyShop = shop[mainKey]
      for(let altKey in mainCurrencyShop) {
        let shopOrder = shop[mainKey][altKey] || {}
        if(settings.shopEnabled && (shopOrder.autotradeEnabled || shopOrder.overridden)) {
          orders.push(shopOrder)
        } else {
          shopOrder.postedOrder = {}
        }
      }
    }
    return orders
  }

  getShopFormString(settings, markets, inventory, orders) {
    let formString = ''
    for(let order of orders) {
      let offerDetails, buyEnabled = true, sellEnabled = true, market
      order.postedOrder = {}

      if(markets[order.mainCurrencyType.id] && markets[order.mainCurrencyType.id][order.alternateCurrencyType.id]) {
        market = markets[order.mainCurrencyType.id][order.alternateCurrencyType.id]
      } else {
        continue
      }
      if(order.overridden) {
        offerDetails = order.overriddenOrder
      } else if(order.autotradeEnabled) {
        offerDetails = market.bestOfferDetails
      }
      if(!offerDetails || !offerDetails.sellOffer || !offerDetails.buyOffer) {
        console.log('Warning: Offer details is null, offerDetails, skipping')
        console.log(order, offerDetails)
        continue
      }

      let sellOfferSellValue = parseFloat(offerDetails.sellOffer.sell_value) || 0
      let sellOfferBuyValue = parseFloat(offerDetails.sellOffer.buy_value) || 0
      let buyOfferSellValue = parseFloat(offerDetails.buyOffer.sell_value) || 0
      let buyOfferBuyValue = parseFloat(offerDetails.buyOffer.buy_value) || 0
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

      //this part checks all conditions in order of precedence to determine whether to post the order
      //Order from highest to lowest precedence is:
      //1. There is proper market data for the order to determine the post price
      //2. There is enough stock of the item being sold
      //3. The order is the same type as the global order type (overrides order specific type)
      //4. The type of the order matches the order to be posted

      //4.
      if(order.type == 'sell') {
        buyEnabled = false
      } else if(order.type == 'buy') {
        sellEnabled = false
      }

      //3.
      if(settings.globalOrderType == 'both') {
        buyEnabled = true
        sellEnabled = true
      } else if(settings.globalOrderType == 'buy') {
        buyEnabled = true
        sellEnabled = false
      } else if(settings.globalOrderType == 'sell') {
        buyEnabled = false
        sellEnabled = true
      }

      //2.
      if(sellOfferSellInventoryItem.count < sellOfferSellValue) {
        sellEnabled = false
      }
      if(buyOfferSellInventoryItem.count < buyOfferSellValue) {
        buyEnabled = false
      }

      //1.
      if(!sellOfferSellValue || !sellOfferBuyValue) {
        console.log(`Sell offer values are undefined/0, sell: ${sellOfferSellValue}, buy: ${sellOfferBuyValue}, disabling sell order`)
        sellEnabled = false
      }
      if(!buyOfferSellValue || !buyOfferBuyValue) {
        console.log(`buy offer values are undefined/0, sell: ${sellOfferSellValue}, buy: ${sellOfferBuyValue}, disabling sell order`)
        buyEnabled = false
      }

      if(sellEnabled) {
        order.postedOrder.sellOffer = {
          buy_value: sellOfferBuyValue,
          sell_value: sellOfferSellValue,
        }
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
        formString += '&sell_currency=' + market.bestOfferDetails.buyOffer.sellCurrencyType.fullName
        formString += '&sell_value=' + buyOfferSellValue
        formString += '&buy_currency=' + market.bestOfferDetails.buyOffer.buyCurrencyType.fullName
        formString += '&buy_value=' + buyOfferBuyValue
      }
    }
    return formString
  }


}
