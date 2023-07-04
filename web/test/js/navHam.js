// Open nav by ID
let navScrollY;
function navOpen(id) {
  // Get the current scroll position and 
  // set the body to not scroll under the nav overlay
  navScrollY = document.documentElement.scrollTop;
  document.body.style.position = 'fixed';
  // Show Nav
  const nav = document.getElementById(id);
  nav.style.display = 'flex';
  const button = document.querySelector('button.navHam');
  button.classList = 'navHam close';
}

// Close nav by ID
function navClose(id) {
  // Return to scroll position
  document.body.style.position = '';
  document.documentElement.scrollTop = navScrollY;
  // Hide Nav
  const nav = document.getElementById(id);
  nav.style.display = "none";
  const button = document.querySelector('button.navHam');
  button.classList = 'navHam';
}

// Toggle nav by ID
function navToggle(id) {
  const nav = document.getElementById(id);
  if (nav.style.display === 'flex') navClose(id);
  else navOpen(id);
}
