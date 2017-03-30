export const CHANGE_INVENTORY = 'CHANGE_INVENTORY'

export function changeInventory(inventory) {
  return{
    type: CHANGE_INVENTORY,
    inventory,
  }
}
