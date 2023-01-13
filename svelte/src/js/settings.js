import { writable } from 'svelte/store'
import { http } from './http'

// export async function getThemes() {

//   // Get all themes in /public/themes
//   const themesResponse = await get("/api/files")
//   const themesFolder = themesResponse.folders.find(folder => folder.path === "/themes/")
//   const head = document.getElementsByTagName('head')[0]

//   // Import each theme
//   themesFolder.files.forEach(file => {
//     const themeName = file.replace('.css', '')

//     // Add to settings store
//     settings.update(store => {
//       store.themes.push(themeName)
//       return store
//     })

//     // Add link tag to HTML <head>
//     const link = document.createElement('link')
//     link.rel = 'stylesheet'
//     link.type = 'text/css'
//     link.href = `${document.location.protocol}//${document.location.hostname}:4620/themes/${file}`
//     head.appendChild(link)

//   })
// }

// Startup
// getThemes()

// Export Stores
export const settings = writable({
  "offline": false,
  "theme": "dark",
  "themes": ["dark", "light"],
  "font_size": 14,
  "animation_ms": 100,
  "hex_spacer": " "
})