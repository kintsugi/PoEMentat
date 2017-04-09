export const ADD_FILTER = 'ADD_FILTER'
export const REMOVE_FILTER = 'REMOVE_FILTER'

export function addFilter(category) {
  return {
    type: ADD_FILTER,
    category
  }
}

export function removeFilter(category) {
  return {
    type: REMOVE_FILTER,
    category
  }
}

export function changeFilter(category) {
  return (dispatch, getState) => {
    const { currencyFilter } = getState()
    if(currencyFilter.indexOf(category) != -1) {
      dispatch(removeFilter(category))
    } else {
      dispatch(addFilter(category))
    }
  }
}
