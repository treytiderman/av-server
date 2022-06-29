// Send query to server
async function get(uri) {
  
  // Fetch options
  const origin = document.location.origin;
  const url = `${origin}/api${uri}`;
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
  const url = `${origin}/api${uri}`;
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
  const url = `${origin}/api${uri}`;
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
  const url = `${origin}/api${uri}`;
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



// Other

function toggleHidden(id) {
  const element = document.getElementById(id);
  element.hidden = !element.hidden
}



// Run the callback function if 1s has passed since the last time debounce() has ran
function debounce(cb, delay = 1000) {
  let timeout;  
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

// Run the callback function imidietly and every 1s afterwards
function throttle(cb, delay = 1000) {
  let shouldWait = false
  let waitingArgs
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false
    } else {
      cb(...waitingArgs)
      waitingArgs = null
      setTimeout(timeoutFunc, delay)
    }
  }

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args
      return
    }

    cb(...args)
    shouldWait = true

    setTimeout(timeoutFunc, delay)
  }
}

// Get random number between min and max
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}



// Scale id to fill the window size
// Add: onload="scaleToWindow('main')" to body
function scaleToWindow(id) {
  console.log('scaleToWindow', id);
  const element = document.getElementById(id);

  const scaleX = window.innerWidth / element.offsetWidth;
  const scaleY = window.innerHeight / element.offsetHeight;

  let scale = scaleX;
  if (scaleX > scaleY) scale = scaleY;

  element.style.transformOrigin = 'top';
  element.style.transform = `scale(${scale})`;
}

// Turn a video tag into a HSL Stream
// <script src="https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js"></script>
// const src = '/stream/output.m3u8';
function hslStream(src, id) {
  const video = document.getElementById(id);
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
    });
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
  }
}



function cancelFullscreen() {
  var el = document;
  var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen || el.webkitExitFullscreen;
  if (requestMethod) { requestMethod.call(el) }
}

function requestFullscreen(el) {
  var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  if (requestMethod) { requestMethod.call(el) }
  return false
}

function toggleFullscreen(el) {
  if (!el) { el = document.body } // Default to body
  var isInFullScreen = document.fullScreenElement || document.mozFullScreen || document.webkitIsFullScreen;
  if (isInFullScreen) { cancelFullscreen() }
  else { requestFullscreen(el) }
  return false;
}


function numMinMax(num, min, max){
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}