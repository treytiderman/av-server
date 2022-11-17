// Send query to server
// uri = the end part of the url
// Example google.com/puppy (uri = puppy)
async function get(uri) {
  
  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const options = {
    method: 'GET',
  };
  
  // Fetch
  console.log('GET:', url);
  let response = await fetch(url, options);
  if (!response.ok) { return 'REQUEST FAILED' }
  const res = await response.json();
  return res;

}
async function post(uri, data) {

  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  console.log('POST:', url, data);
  const options = {
    method: 'POST',
    body: JSON.stringify(data)
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return 'REQUEST FAILED' }
  const res = await response.json();
  return res;

}
async function getAuth(uri) {
  
  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const token = localStorage.getItem('token');
  if (token === null) { location.href = "/api/login"; return }
  const options = {
    method: 'GET',
    headers: {'Authorization': `Bearer ${token}`}
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return 'REQUEST FAILED' }

  // Not logged in
  if (response.redirected) { return 'NOT LOGGED IN' }

  // Logged in
  const res = await response.json();
  return res;

}
async function postAuth(uri, data) {

  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}${uri}`;
  const token = localStorage.getItem('token');
  if (token === null) { location.href = "/api/login"; return }
  const options = {
    method: 'POST',
    headers: {'Authorization': `Bearer ${token}`},
    body: JSON.stringify(data)
  };

  // Fetch
  let response = await fetch(url, options);
  if (!response.ok) { return 'REQUEST FAILED' }

  // Not logged in
  if (response.redirected) { return 'NOT LOGGED IN' }

  // Logged in
  const res = await response.json();
  return res;

}
