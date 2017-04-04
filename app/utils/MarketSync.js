let constants = require('../constants')

export default class MarketSync {
  constructor(io, cb) {
    this.io = io
    this.socket = this.io.connect(constants.urls.marketSync)
    this.offers = {}
    this.socketEvents()
    this.cb = cb
  }

  socketEvents() {
    this.socket.on('offers', (receivedOffers) => {
      this.offers = receivedOffers
      this.cb(this.expandOffers())
    })
    this.socket.on('update', (receivedOffers) => {
      for(let id of receivedOffers.removed) {
        if(!this.offers[id]) {
        } else {
          delete this.offers[id]
        }
      }
      for(let id in receivedOffers.added) {
        this.offers[id] = receivedOffers.added[id]
      }
      this.cb(this.expandOffers())
    })
  }

  expandOffers() {
    let expandedOffers = {}
    for(let id in this.offers) {
      expandedOffers[id] = {}
      for(let key in constants.misc.offersTranslate) {
        expandedOffers[id][constants.misc.offersTranslate[key]] = this.offers[id][key]
      }
    }
    return expandedOffers
  }
}
