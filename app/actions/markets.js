export const CHANGE_MARKETS = 'CHANGE_MARKETS'

export function changeMarkets(markets) {
  return{
    type: CHANGE_MARKETS,
    markets,
  }
}
