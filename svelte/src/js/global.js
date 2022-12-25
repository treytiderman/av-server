import { writable } from 'svelte/store'

// Parse simple querystring parameters
export function parseQuerystring(string) {
  let searchObj = {}

  // Split by "&"
  const urlSearchs = string.split('&')

  // Split by "="
  urlSearchs.forEach(urlSearch => {
    let pair = urlSearch.split("=")
    let key = pair[0]
    let value = pair[1]
    searchObj[key] = value
  })

  // Return
  return searchObj

}

// Get Screen Size
export function getScreenSize() {
  return {
    width: document.documentElement.offsetWidth,
    height: document.documentElement.offsetHeight,
    dpr: window.devicePixelRatio
  }
}

// Export Stores
export const global = writable({})
