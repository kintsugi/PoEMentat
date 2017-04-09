export const CHANGE_SELECTED_CURRENCIES = 'CHANGE_SELECTED_CURRENCIES'

export function changeSelectedCurrencies(main, alternate) {
  return{
    type: CHANGE_SELECTED_CURRENCIES,
    selections: {
      main,
      alternate,
    }
  }
}

export function changeSelectedMainCurrency(main) {
  return (dispatch, getState) => {
    const { selectedCurrencies } = getState()
    dispatch(changeSelectedCurrencies(main, selectedCurrencies.alternate))
  }
}

export function changeSelectedAlternateCurrency(alternate) {
  return (dispatch, getState) => {
    const { selectedCurrencies } = getState()
    dispatch(changeSelectedCurrencies(selectedCurrencies.main, alternate))
  }
}
