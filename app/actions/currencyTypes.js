export const CHANGE_CURRENCY_TYPES = 'CHANGE_CURRENCY_TYPES'

export function changeCurrencyTypes(currencyTypes) {
  return{
    type: CHANGE_CURRENCY_TYPES,
    currencyTypes,
  }
}
