// Elements
let attemts = 0;
const password = document.querySelector('input');
const submit = document.querySelector('button');
const result = document.querySelector('p');

// Login | POST password for token
async function login() {

  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}/api/login`;
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'password': password.value})
  };

  // Fetch
  const response = await fetch(url, options);
  if (!response.ok) { console.log("I'm not ok"); return }

  // Password failed
  if (response.redirected) { 
    attemts++;
    result.innerHTML = `wrong password ${attemts}`;
    localStorage.clear();
    return
  }

  // Password accepted
  const token = await response.json();
  localStorage.setItem('token', token);
  result.innerHTML = 'correct password, token added to local storage';
  history.back();
  return

}

// Submit clicked
submit.addEventListener('click', () => {
  login();
});

// Enter pressed when password field is focused
password.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    submit.click();
  }
});
