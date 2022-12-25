import { writable } from 'svelte/store'

// Export Stores
export const settings = writable({
  "theme": "dark",
  "themes": ["dark"],
  "font_size": 16,
  "hex_spacer": " "
})
