// Send query to server
async function get(uri) {
  
  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const options = {
    method: 'GET',
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return }
  const res = await response.json();
  return res;

}

// Send query to server
async function post(uri, data) {

  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const options = {
    method: 'POST',
    body: JSON.stringify(data)
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return }
  const res = await response.json();
  return res;

}

// Send query to server
async function getAuth(uri) {
  
  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    headers: {'Authorization': `Bearer ${token}`}
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { console.log("I'm not ok"); return }

  // Not logged in
  if (response.redirected) { return `not logged in` }

  // Logged in
  const res = await response.json();
  return res;

}

// Send query to server
async function postAuth(uri, data) {

  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const token = localStorage.getItem('token');
  const options = {
    method: 'POST',
    headers: {'Authorization': `Bearer ${token}`},
    body: JSON.stringify(data)
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { console.log("I'm not ok"); return }

  // Not logged in
  if (response.redirected) { return false }

  // Logged in
  const res = await response.json();
  return res;

}
