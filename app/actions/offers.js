export const CHANGE_OFFERS = 'CHANGE_OFFERS'

export function changeOffers(offers) {
  return{
    type: CHANGE_OFFERS,
    offers,
  }
}
