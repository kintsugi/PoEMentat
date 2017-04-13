export const CHANGE_SELECTED_MARKET_CURRENCIES = 'CHANGE_SELECTED_MARKET_CURRENCIES'

export function changeSelectedMarketCurrencies(main, alternate) {
  return{
    type: CHANGE_SELECTED_MARKET_CURRENCIES,
    selections: {
      main,
      alternate,
    }
  }
}

export function changeSelectedMainMarketCurrency(main) {
  return (dispatch, getState) => {
    const { selectedMarketCurrencies } = getState()
    dispatch(changeSelectedMarketCurrencies(main, selectedMarketCurrencies.alternate))
  }
}

export function changeSelectedAlternateMarketCurrency(alternate) {
  return (dispatch, getState) => {
    const { selectedMarketCurrencies } = getState()
    dispatch(changeSelectedMarketCurrencies(selectedMarketCurrencies.main, alternate))
  }
}
