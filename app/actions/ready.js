export const READY_CURRENCY_TYPES = 'READY_CURRENCY_TYPES'
export const READY_INVENTORY = 'READY_INVENTORY'

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
