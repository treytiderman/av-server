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
  const token = localStorage.getItem('token') ?? ""
  const fetch_options = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }

  // Fetch
  try {
    const response = await fetch(url, fetch_options)
    log(`get(${url})`, response)

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
  const token = localStorage.getItem('token') ?? ""
  const fetch_options = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }

  // Fetch
  try {
    const response = await fetch(url, fetch_options)
    log(`postJSON(${url}, ...)`, response)

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

  // Send username and password to login endpoint
  const token = await postJSON("/login", {
    username: username,
    password: password
  }, options)

  // Password incorrect
  if (token === "password incorrect") return token

  // User doesn't exist
  else if (token === "username doesn't exists") return token

  // Save Token to localStorage
  else {
    log("token saved")
    localStorage.setItem("token", token)
  }

}

// Logout
async function logout() {
  localStorage.removeItem("token")
}

// Role
async function user(options = {}) {
  const user = await getJSON("/user", options)
  log("user", user)
  return user
}

// Exports
export const http = {
  login: login,
  user: user,
  buildURL: buildURL,
  get: {
    json: getJSON,

  },
  post: {
    json: postJSON,

  },
}