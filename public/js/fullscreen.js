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
