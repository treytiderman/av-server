// Send query to server
export async function get(uri, origin = document.location.origin) {
  
  // Fetch options
  const url = `${origin}${uri}`;
  const options = {
    method: 'GET',
  };

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
    const res = await response.json();
    return res;
  }

}

// Send query to server
export async function post(uri, data) {

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

// Run the callback function if 1s has passed since the last time debounce() was called
export function debounce(cb, delay = 1000) {
  let timeout;  
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

// Run the callback function immediately and every 1s afterwards
// Example: A sliders value changes rapidly,
// so instead of running a function every small value change
// only run the function every 100ms (save on network traffic)
export function throttle(cb, delay = 100) {
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
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Force number to range
export function numMinMax(num, min, max) {
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}

// Date Object to Time (4:37 PM)
export function dateObjToTime(date) {
  let time = new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date)
  return time
}

// Date Object to Date (11/13/2022)
export function dateObjToDate(date) {
  let time = new Intl.DateTimeFormat().format(date)
  return time
}

