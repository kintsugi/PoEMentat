export const CHANGE_SETTINGS = 'CHANGE_SETTINGS'

export function changeSettings(settings) {
  return{
    type: CHANGE_SETTINGS,
    settings,
  }
}
