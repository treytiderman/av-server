// Send query to server
export async function get(uri, origin = document.location.origin) {
  
  // Fetch options
  const url = `${origin}${uri}`
  const options = {
    method: 'GET',
  }

  // Fetch
  let failed = false
  let response = await fetch(url, options).catch(error => failed = true)
  if (failed) {
    return null
  }
  else if (!response.ok) {
    return "not a json"
  }
  else {
    const res = await response.json()
    return res
  }

}

// Send query to server
export async function post(uri, body, origin = document.location.origin) {

  // Fetch options
  const url = `${origin}${uri}`
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  }

  // Fetch
  let failed = false
  let response = await fetch(url, options).catch(error => failed = true)
  if (failed) {
    return null
  }
  else if (!response.ok) {
    return "not a json"
  }
  else {
    const res = await response.json()
    return res
  }

}

