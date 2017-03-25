let rp = require('request-promise')
let async = require('async')
let constants = require('../constants')

export default class InventoryParser {
  constructor(settings) {
    this.settings = settings
    this.requestOptions = {
      method: 'GET',
      uri: constants.urls.stashItems,
      qs: {
        accountName: this.settings.poeUsername,
        tabIndex: 0,
        league: this.settings.leagueName,
        tabs: 0
      },
      headers: {
        cookie: 'POESESSID=' + this.settings.poeSessionId + ';',
      }
    }
    this.stashTabs = []
    this.numTabs = 0
  }

  init() {
    return this.getStashHeader()
  }

  setTabIndex(tab) {
    this.requestOptions.qs.tabIndex = tab
  }

  getTabIndex() {
    return this.requestOptions.qs.tabIndex
  }

  incrementTabIndex(num = 1) {
    this.requestOptions.qs.tabIndex += num
    return this.requestOptions.qs.tabIndex
  }

  decrementTabIndex(num = -1) {
    this.requestOptions.qs.tabIndex += num
    return this.requestOptions.qs.tabIndex
  }

  setStashTab(tabIndex, stashTab) {
    this.stashTabs[tabIndex] = {
      timestamp: Date.now(),
      tabIndex: tabIndex,
      ...stashTab
    }
    return this.stashTabs[tabIndex]
  }

  getStashTab(tabIndex) {
    let tabRequestOptions = Object.assign({}, this.requestOptions)
    tabRequestOptions.qs = Object.assign({}, this.requestOptions.qs, {
      tabIndex: tabIndex,
    })
    return rp(tabRequestOptions)
      .then((data) => {
        let stashTab = JSON.parse(data)
        return this.setStashTab(tabIndex, stashTab)
      })
      .catch((err) => {
        throw err
      })
  }

  getStashHeader() {
    //form a new options object to maintain the current state of the InventoryParser
    //header tab is always index 0
    let headerRequestOptions = Object.assign({}, this.requestOptions)
    headerRequestOptions.qs = Object.assign({}, this.requestOptions.qs, {
      tabIndex: 0,
    })
    return this.getStashTab(0)
      .then((stashHeader) => {
        this.numTabs = stashHeader.numTabs
        return stashHeader
      })
      .catch((err) => {
        throw err
      })
  }



  getCurrentStashTab() {
    let tabIndex = this.getTabIndex()
    return this.getStashTab(tabIndex)
      .then((stashTab) => {
        return stashTab
      })
      .catch((err) => {
        throw err
      })
  }


  getNextStashTab(num = 1) {
    this.incrementTabIndex(num)
    return this.getCurrentStashTab()
  }

  getAllStashTabsParallel(limit) {
    if(!this.numTabs) {
      return Promise.reject(new Error('InventoryParser not initialized, cannot getAllStashTabsParallel'))
    }
    limit = !limit || limit > this.numTabs ? this.numTabs : limit
    let receivedTabs = []
    return new Promise((resolve, reject) => {
      async.each(Array.from(Array(limit).keys()), (tabIndex, next) => {
        this.getStashTab(tabIndex)
          .then((stashTab) => {
            if(stashTab.error) {
              console.log('Error field in stash tab response:', stashTab.error)
            }
            receivedTabs.push(stashTab)
            return next()
          })
          .catch((err) => {
            next(err)
          })
      }, (err) => {
        if(err) {
          reject(err)
        }
        receivedTabs.sort((a, b) => {
          if(a.tabIndex < b.tabIndex) {
            return -1
          } else if(a.tabIndex > b.tabIndex) {
            return 1
          } else {
            return 0
          }
        })
        resolve(receivedTabs)
      })
    })

  }

  getAllStashTabsSeries(limit) {
    if(!this.numTabs) {
      return Promise.reject(new Error('InventoryParser not initialized, cannot getAllStashTabSeries'))
    }
    limit = !limit || limit > this.numTabs ? this.numTabs : limit
    let receivedTabs = []
    //uses array.reduce to call getStashTab in series
    //on error will throw
    return Array.from(Array(limit).keys()).slice(1, limit).reduce((acc, tabIndex) => {
      return acc.then((stashTab) => {
        if(stashTab.error) {
          console.log('Error field in stash tab response:', stashTab.error)
        }
        receivedTabs.push(stashTab)
        return this.getStashTab(tabIndex)
      })
      .catch((err) => {
        throw err
      })
    }, this.getStashTab(0))
      .then((stashTab) => {
        receivedTabs.push(stashTab)
        return receivedTabs
      })
  }

  getInventory() {

  }
}
