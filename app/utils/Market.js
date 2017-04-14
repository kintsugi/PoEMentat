
import MarketSync from './MarketSync'

/*
 * ROI Exmaple: Buy chromes 15:1c sell chromes 20:1c,
 */

export default class Market {
  constructor(settings, io, currencyTypes, cb) {
    this.settings = settings
    this.cb = cb
    this.currencyTypes = currencyTypes
    this.marketSync = new MarketSync(io, (offers) => {
      this.update(offers)
    })
    this.reset()
  }

  reset() {
    this.offers = []
    this.markets = []
    //offers[buy_currency_id][sell_currency_id]
    //markets[main_currency_id][alternate_currency_id]
    for(let buyCurrencyType of this.currencyTypes.list) {
      this.offers[buyCurrencyType.id] = []
      for(let sellCurrencyType of this.currencyTypes.list) {
        this.offers[buyCurrencyType.id][sellCurrencyType.id] = {details: {}, list: []}
      }
    }

    for(let mainCurrencyType of this.currencyTypes.list) {
      this.markets[mainCurrencyType.id] = []
      for(let alternateCurrencyType of this.currencyTypes.list) {
        this.markets[mainCurrencyType.id][alternateCurrencyType.id] = {
          mainCurrencyType: mainCurrencyType,
          alternateCurrencyType: alternateCurrencyType,
          buyOffers: this.offers[alternateCurrencyType.id][mainCurrencyType.id],
          sellOffers: this.offers[mainCurrencyType.id][alternateCurrencyType.id],
        }
      }
    }
  }

  update(rawOffers) {
    this.rawOffers = rawOffers
    this.reset()
    this.formatOffers()
    this.indexOffers()
    this.calcOffers()
    this.sortOffers()
    this.calcMarkets()
    this.cb(this.offers, this.markets)
  }

  formatOffers() {
    for(let id in this.rawOffers) {
      let rawOffer = this.rawOffers[id]
      rawOffer.buyCurrencyType = this.currencyTypes.idDict[rawOffer.buy_currency_id]
      rawOffer.sellCurrencyType = this.currencyTypes.idDict[rawOffer.sell_currency_id]
    }
  }

  indexOffers() {
    for(let id in this.rawOffers) {
      let rawOffer = this.rawOffers[id]
      this.offers[rawOffer.buy_currency_id][rawOffer.sell_currency_id].list.push(rawOffer)
    }
  }

  calcOffers() {
    //calc ratios, etc.
    for(let buyCurrencyId in this.offers) {
      let sellCurrencyIds = this.offers[buyCurrencyId]
      for(let sellCurrencyId in sellCurrencyIds) {
        let offerList = this.offers[buyCurrencyId][sellCurrencyId].list
        let offerDetails = this.offers[buyCurrencyId][sellCurrencyId].details
        //calc buy/sell ratio for each offer
        for(let offer of offerList) {
          offer.ratios = {
            buyPerSell: offer.buy_value / offer.sell_value,
            sellPerBuy: offer.sell_value / offer.buy_value
          }
        }

      }
    }
  }

  sortOffers() {
    for(let buyCurrencyId in this.offers) {
      let sellCurrencyIds = this.offers[buyCurrencyId]
      for(let sellCurrencyId in sellCurrencyIds) {
        this.offers[buyCurrencyId][sellCurrencyId].list.sort(this.compareOffers)
      }
    }
  }

  calcMarkets() {
    for(let mainCurrencyType of this.currencyTypes.list) {
      for(let alternateCurrencyType of this.currencyTypes.list) {
        let market = this.markets[mainCurrencyType.id][alternateCurrencyType.id]
        this.calcMarket(market)
      }
    }
  }

  calcMarket(market) {
    market.topOfferDetails = {
      buyOffer: market.buyOffers.list[0],
      sellOffer: market.sellOffers.list[0],
    }
    market.topOfferDetails.profit = this.calcProfit(market.topOfferDetails.buyOffer, market.topOfferDetails.sellOffer)
    market.topOfferDetails.ROI = this.calcROI(market.topOfferDetails.buyOffer, market.topOfferDetails.sellOffer)
    market.bestOfferDetails = this.findBestOfferPair(market.buyOffers, market.sellOffers)
    market.bestOfferDetails.ROI = this.calcROI(market.bestOfferDetails.buyOffer, market.bestOfferDetails.sellOffer)
  }

  calcROI(buyOffer, sellOffer) {
    /*
     * Example: buy chromes 1c:20, sell 1c:15
     * profit = 5 chromes
     * 15 chromes = 1c, 15/5 = 3 trades needed to make 1c
     * ROI = chaos invested / chaos profited
     * 3 trades at 1c each = 3c invested, 1c profit ROI = 3/1 = 3
     */
    if(!buyOffer || !sellOffer) {
      return
    }
    let alternateBuyValue = buyOffer.ratios.buyPerSell
    let alternateSellValue = sellOffer.ratios.sellPerBuy
    let alternateProfitPerMain = alternateBuyValue - alternateSellValue
    let ROI = alternateSellValue / alternateProfitPerMain
    return ROI
  }

  calcProfit(buyOffer, sellOffer) {
    let sellPerBuy = buyOffer ? buyOffer.ratios.sellPerBuy : 0
    let buyPerSell = sellOffer ? sellOffer.ratios.buyPerSell : 0
    return buyPerSell - sellPerBuy
  }

  findBestOfferPair(buyOffers, sellOffers) {
    let usernamesToIgnore = this.settings.usernameWhitelist.concat([this.settings.poeUsername])
    let buyOffer = null, sellOffer = null, profit = null
    if(!buyOffers || !sellOffers || !buyOffers.list || !sellOffers.list) {
      return {
        buyOffer,
        sellOffer,
        profit,
      }
    }
    for(let buyIndex = 0, sellIndex = 0; buyIndex < buyOffers.list.length || sellIndex < sellOffers.list.length;) {
      buyOffer = buyOffers.list[buyIndex], sellOffer = sellOffers.list[sellIndex]
      if(buyOffer && usernamesToIgnore.indexOf(buyOffer.username) > -1) {
        buyIndex++
        continue
      }
      if(sellOffer && usernamesToIgnore.indexOf(sellOffer.username) > -1) {
        sellIndex++
        continue
      }
      profit = this.calcProfit(buyOffer, sellOffer)
      if(profit > 0) {
        break
      }
      if(buyIndex < buyOffers.list.length) {
        buyIndex++
      }
      if(sellIndex < sellOffers.list.length) {
        sellIndex++
      }
    }
    return {
      buyOffer,
      sellOffer,
      profit,
    }
  }

  compareOffers(a, b) {
    if(a.ratios.buyPerSell < b.ratios.buyPerSell) {
      return -1
    } else if(a.ratios.buyPerSell > b.ratios.buyPerSell) {
      return 1
    }
    return 0
  }

}
