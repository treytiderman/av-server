
// Helper Functions
function log(...params) { if (true) console.log("http.js |", ...params) }
function err(...params) { if (true) console.error("http.js |", ...params) }

// Build URL
function buildURL(path, options = {}) {
  const ip = options.ip ?? document.location.hostname
  const port = options.port ?? document.location.port
  const protocol = options.protocol ?? document.location.protocol
  const host = options.protocol === 'https:' ? `${ip}` : `${ip}:${port}`
  return `${protocol}//${host}${path}`
}

// GET JSON response
async function getJSON(path, options = {}) {

  // URL
  const url = buildURL(path, options)
  log(`get(${url})`)

  // Fetch options
  const fetch_options = {
    method: 'GET',
  }

  // Fetch
  try {
    const response = await fetch(url, fetch_options)
    log(`get(${url})`, response)
    if (!response.ok) return "not ok"

    // Parse JSON
    try {
      const json = await response.json()
      return json
    }
    catch (error) {
      err(`get(${url})`, "response not a json")
      return "not a json"
    }
  }
  
  // Errors
  catch (error) { return err(error) }

}

// POST JSON and JSON response
async function postJSON(path, body, options = {}) {

  // URL
  const url = buildURL(path, options)
  log(`postJSON(${url}, ...)`, body)

  // Fetch options
  const fetch_options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  }

  // Fetch
  try {
    const response = await fetch(url, fetch_options)
    log(`postJSON(${url}, ...)`, response)
    if (!response.ok) return "not ok"

    // Parse JSON
    try {
      const json = await response.json()
      return json
    }
    catch (error) {
      err(`postJSON(${url}, ...)`, "response not a json")
      return "not a json"
    }
  }
  
  // Errors
  catch (error) { return err(error) }

}

// Login
async function login(username, password, options = {}) {
  return await postJSON("/login", {
    username: username,
    password: password
  }, options)
}

// Exports
export const http = {
  login: login,
  buildURL: buildURL,
  get: {
    json: getJSON,

  },
  post: {
    json: postJSON,

  },
}