// Loading screen
// Create loading screen
function showLoadingScreen(timeout = 0) {
  // Append the html to the body
  const loadingScreen = document.createElement('div');
  loadingScreen.classList = 'loadingScreen-black';
  loadingScreen.id = 'loadingScreen-black';
  document.body.appendChild(loadingScreen);
  const div = document.createElement('div');
  div.classList = "loadingScreen-spin"
  loadingScreen.appendChild(div);
  const icon = document.createElement('i');
  icon.classList = "fa fa-circle-notch loadingScreen-icon"
  let bigWidth = document.body.clientWidth > document.body.clientHeight
  if (bigWidth) icon.style.fontSize = '40vh';
  else icon.style.fontSize = '40vw';
  div.appendChild(icon);
  // Check for screen resizing
  window.addEventListener('resize', event => {
    bigWidth = document.body.clientWidth > document.body.clientHeight
    if (bigWidth) icon.style.fontSize = '40vh';
    else icon.style.fontSize = '40vw';
  }, true);
  if (timeout > 0) setTimeout(() => hideLoadingScreen(), timeout);
}

// Remove loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen-black');
  loadingScreen.remove();
}

// Show loading overlay
function showLoadingOverlay(id, timeout = 0) {
  const loadingOverlay = document.getElementById(id);
  loadingOverlay.classList.add("loadingOverlay");
  if (timeout > 0) setTimeout(() => hideLoadingOverlay(id), timeout);
}

// Remove loading overlay
function hideLoadingOverlay(id) {
  const loadingOverlay = document.getElementById(id);
  loadingOverlay.classList.remove("loadingOverlay");
}

// Enable/Disable Element by ID
function enableElement(id) {
  document.getElementById(id).disabled = false;
}
function disableElement(id, timeout = 0) {
  document.getElementById(id).disabled = true;
  if (timeout === 0) return 'NO TIMEOUT SET';
  setTimeout(() => {
    document.getElementById(id).disabled = false
  }, timeout);
}
function enableElements(ids) {
  ids.forEach(id => document.getElementById(id).disabled = false);
}
function disableElements(ids, timeout = 0) {
  ids.forEach(id => document.getElementById(id).disabled = true);
  if (timeout === 0) return 'NO TIMEOUT SET';
  setTimeout(() => {
    ids.forEach(id => document.getElementById(id).disabled = false)
  }, timeout);
}

// Toasts
// Create div for all toasts on load
const toaster = document.createElement('section');
toaster.id = 'toaster';
document.body.appendChild(toaster);

// Create Toast
function createToast(text, fb = 'neutral', closeIcon = false, timeout = 0) {
  const toast = document.createElement('section');
  toast.classList = ''
  if (closeIcon) toast.classList.add('exit');
  toast.dataset.toast = fb;
  toast.innerText = text;
  toast.addEventListener("click", event => toast.remove())
  toaster.prepend(toast);
  if (timeout > 0) setTimeout(() => toast.remove(), timeout);
}

// Set Feedback below element
function setFb(id, fb, text = '', timeout = 0) {
  // Get element
  const element = document.getElementById(id);
  const parent = element.parentElement;
  // Remove Old asides
  for (let i = 0; i < parent.children.length; i++) {
    const element = parent.children[i];
    if (element.localName === 'aside') element.remove();
  }
  // Add new feedback
  element.dataset.fb = fb;
  // Create adide (text below element)
  if (text !== '') {
    const aside = document.createElement('aside');
    parent.appendChild(aside)
    const icon = document.createElement('icon');
    aside.appendChild(icon);
    const small = document.createElement('small');
    small.innerText = ' ' + text;
    aside.appendChild(small);
    if (fb === 'confirm') icon.classList = 'fa fa-square-check';
    else if (fb === 'warning') icon.classList = 'fa fa-triangle-exclamation';
    else if (fb === 'error') icon.classList = 'fa fa-circle-exclamation';
  }
  // Set timeout
  if (timeout !== 0) setTimeout(() => element.dataset.fb = 'none', timeout);
}
