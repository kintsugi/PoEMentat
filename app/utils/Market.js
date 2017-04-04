
import MarketSync from './MarketSync'

export default class Market {
  constructor(io, currencyTypes, cb) {
    this.cb = cb
    this.currencyTypes = currencyTypes
    this.marketSync = new MarketSync(io, (offers) => {
      this.update(offers)
    })
    this.resetOffers()
  }

  resetOffers() {
    this.offers = []
    //offers[buy_currency_id][sell_currency_id]
    for(let buyCurrencyType of this.currencyTypes.list) {
      this.offers[buyCurrencyType.id] = []
      for(let sellCurrencyType of this.currencyTypes.list) {
        this.offers[buyCurrencyType.id][sellCurrencyType.id] = []
      }
    }
  }

  update(rawOffers) {
    this.rawOffers = rawOffers
    this.resetOffers()
    this.formatOffers()
    this.indexOffers()
    this.sortOffers()
    this.cb(this.offers)
  }

  formatOffers() {
    for(let id in this.rawOffers) {
      let rawOffer = this.rawOffers[id]
      rawOffer.ratios = {
        buyPerSell: rawOffer.buy_value / rawOffer.sell_value,
        sellPerBuy: rawOffer.sell_value / rawOffer.buy_value
      }
      rawOffer.buyCurrencyType = this.currencyTypes.idDict[rawOffer.buy_currency_id]
      rawOffer.sellCurrencyType = this.currencyTypes.idDict[rawOffer.sell_currency_id]
    }
  }

  indexOffers() {
    for(let id in this.rawOffers) {
      let rawOffer = this.rawOffers[id]
      this.offers[rawOffer.buy_currency_id][rawOffer.sell_currency_id].push(rawOffer)
    }
  }

  sortOffers() {
    for(let buyCurrencyId in this.offers) {
      let sellCurrencyIds = this.offers[buyCurrencyId]
      for(let sellCurrencyId in sellCurrencyIds) {
        this.offers[buyCurrencyId][sellCurrencyId].sort(this.compareOffers)
      }
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
