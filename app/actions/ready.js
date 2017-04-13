export const READY_CURRENCY_TYPES = 'READY_CURRENCY_TYPES'
export const READY_INVENTORY = 'READY_INVENTORY'
export const READY_MARKET = 'READY_MARKET'

export function readyCurrencyTypes() {
  return {
    type: READY_CURRENCY_TYPES,
    state: {
      currencyTypes: true
    },
  }
}

export function readyInventory() {
  return {
    type: READY_INVENTORY,
    state: {
      inventory: true
    },
  }
}

export function readyMarket() {
  return {
    type: READY_MARKET,
    state: {
      market: true
    },
  }
}
