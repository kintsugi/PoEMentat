export const CHANGE_SELECTED_SHOP_CURRENCIES = 'CHANGE_SELECTED_SHOP_CURRENCIES'

export function changeSelectedShopCurrencies(main, alternate) {
  return{
    type: CHANGE_SELECTED_SHOP_CURRENCIES,
    selections: {
      main,
      alternate,
    }
  }
}

export function changeSelectedMainShopCurrency(main) {
  return (dispatch, getState) => {
    const { selectedShopCurrencies } = getState()
    dispatch(changeSelectedShopCurrencies(main, selectedShopCurrencies.alternate))
  }
}

export function changeSelectedAlternateShopCurrency(alternate) {
  return (dispatch, getState) => {
    const { selectedShopCurrencies } = getState()
    dispatch(changeSelectedShopCurrencies(selectedShopCurrencies.main, alternate))
  }
}
