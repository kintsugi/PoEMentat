export const ADD_SHOP_FILTER = 'ADD_SHOP_FILTER'
export const REMOVE_SHOP_FILTER = 'REMOVE_SHOP_FILTER'

export function addShopFilter(category) {
  return {
    type: ADD_SHOP_FILTER,
    category
  }
}

export function removeShopFilter(category) {
  return {
    type: REMOVE_SHOP_FILTER,
    category
  }
}

export function changeShopFilter(category) {
  return (dispatch, getState) => {
    const { shopCurrencyFilter } = getState()
    if(shopCurrencyFilter.indexOf(category) != -1) {
      dispatch(removeShopFilter(category))
    } else {
      dispatch(addShopFilter(category))
    }
  }
}
