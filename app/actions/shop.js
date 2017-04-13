export const CHANGE_SHOP = 'CHANGE_SHOP'
export const CHANGE_SHOP_ORDER = 'CHANGE_SHOP_ORDER'

export function changeShop(shop) {
  return{
    type: CHANGE_SHOP,
    shop,
  }
}

export function changeShopOrder(mainCurrencyId, alternateCurrencyId, order) {
  return {
    type: CHANGE_SHOP_ORDER,
    mainCurrencyId,
    alternateCurrencyId,
    order,
  }
}
