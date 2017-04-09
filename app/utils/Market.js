
import MarketSync from './MarketSync'

/*
 * ROI Exmaple: Buy chromes 15:1c sell chromes 20:1c,
 */

export default class Market {
  constructor(io, currencyTypes, cb) {
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
          buyOffers: this.offers[mainCurrencyType.id][alternateCurrencyType.id],
          sellOffers: this.offers[alternateCurrencyType.id][mainCurrencyType.id],
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
    this.cb(this.offers)
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
    market.topBuyOffer = market.buyOffers[0]
    market.topSellOffer = market.sellOffers[0]
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
