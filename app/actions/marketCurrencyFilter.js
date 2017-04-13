export const ADD_MARKET_FILTER = 'ADD_MARKET_FILTER'
export const REMOVE_MARKET_FILTER = 'REMOVE_MARKET_FILTER'

export function addMarketFilter(category) {
  return {
    type: ADD_MARKET_FILTER,
    category
  }
}

export function removeMarketFilter(category) {
  return {
    type: REMOVE_MARKET_FILTER,
    category
  }
}

export function changeMarketFilter(category) {
  return (dispatch, getState) => {
    const { marketCurrencyFilter } = getState()
    if(marketCurrencyFilter.indexOf(category) != -1) {
      dispatch(removeMarketFilter(category))
    } else {
      dispatch(addMarketFilter(category))
    }
  }
}
