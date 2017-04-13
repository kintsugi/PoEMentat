import InventoryParser from './InventoryParser'
import {
  getStackSize,
  getAbbreviatedCurrencyName,
  matchInventoryItemToCurrency,
} from './functions'
const constants = require('../constants')
const sets = require('../data/sets')

export default class Inventory {
  constructor(settings) {
    this.settings = settings
    this.inventoryParser = new InventoryParser(this.settings)
  }

  init(settings, currencyTypes) {
    this.settings = settings
    this.currencyTypes = currencyTypes
    this.resetInventory()
    return this.inventoryParser.init(settings)
      .then(() => {
        return this.update(this.settings)
      })
      .catch((err) => {
        throw err
      })
  }

  resetInventory() {
    this.currencyInventory = {}
    this.currencyInventoryNameDict = {}
    for(let currencyType of this.currencyTypes.list) {
      let currencyItem = {
        ...currencyType,
        count: 0
      }
      this.currencyInventory[currencyType.id] = currencyItem
      this.currencyInventoryNameDict[currencyType.name] = currencyItem
    }
  }

  stashUpdate() {
    if(this.settings.stashUpdateMode == 'parallel') {
      return this.inventoryParser.getAllStashTabsParallel(this.settings, 10)
    } else if(this.settings.stashUpdateMode == 'series') {
      return this.inventoryParser.getAllStashTabsSeries(this.settings)
    }
  }


  update(settings) {
    this.settings = settings
    return this.stashUpdate()
      .then((receivedTabs) => {
        return this.countCurrency(receivedTabs)
      })
      .catch((err) => {
        throw err
      })
  }

  countCurrency(receivedTabs) {
    //create a list of currency names, then iterate through all items in all
    //tabs for matches
    //then for all matches, look for sets
    this.resetInventory()
    let currencyNames = Object.keys(this.currencyTypes.nameDict)
    for(let tab of receivedTabs) {
      for(let item of tab.items) {
        let currencyType = matchInventoryItemToCurrency(this.currencyTypes, item)
        if(currencyType) {
          this.currencyInventory[currencyType.id].count += getStackSize(item)
        }
      }
    }
    for(let setName in sets) {
      let setCurrencyType = this.currencyTypes.nameDict[setName]
      if(setCurrencyType) {
        let setPiecesCurrencyTypes = []
        let setCurrencyItem = this.currencyInventoryNameDict[setCurrencyType.name]
        let setPiecesCurrencyItems = []
        for(let pieceName of sets[setName]) {
          setPiecesCurrencyTypes.push(this.currencyTypes.nameDict[pieceName])
        }
        for(let setPieceCurrencyType of setPiecesCurrencyTypes) {
          setPiecesCurrencyItems.push(this.currencyInventoryNameDict[setPieceCurrencyType.name])
        }
        this.countSetPieces(setCurrencyItem, setPiecesCurrencyItems)
      }
    }
    return {
      idDict: this.currencyInventory,
      nameDict: this.currencyInventoryNameDict
    }
  }

  countSetPieces(setCurrencyItem, setPiecesCurrencyItems) {
    //the number of possessed sets is equal to the minimum of the
    //set pieces
    let setCount = null
    for(let setPieceCurrencyItem of setPiecesCurrencyItems) {
      if(setCount === null || setCount > setPieceCurrencyItem.count) {
        setCount = setPieceCurrencyItem.count
      }
    }
    setCurrencyItem.count = setCount
  }

}
