import InventoryParser from './InventoryParser'
import { getStackSize } from './functions'
const constants = require('../constants')
const sets = require('../data/sets')

export default class Inventory {
  constructor(settings) {
    this.settings = settings
    this.inventoryParser = new InventoryParser(this.settings)
  }

  init(currencyTypes) {
    this.currencyTypes = currencyTypes
    this.resetInventory()
    return this.inventoryParser.init()
      .then(() => {
        return this.update()
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
      return this.inventoryParser.getAllStashTabsParallel(5)
    } else if(this.settings.stashUpdateMode == 'series') {
      return this.inventoryParser.getAllStashTabsSeries()
    }
  }


  update() {
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
        let currencyNameIndex = currencyNames.indexOf(item.typeLine)
        if(currencyNameIndex != -1) {
          let currencyName = currencyNames[currencyNameIndex]
          let currencyType = this.currencyTypes.nameDict[currencyName]
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
    console.log(setCurrencyItem,  setPiecesCurrencyItems)
  }

}
