// Scale id to fill the window size
// Add: onload="scaleToWindow('main')" to body
function scaleToWindow() {
  const element = document.querySelector('main');

  const scaleX = window.innerWidth / element.offsetWidth;
  const scaleY = window.innerHeight / element.offsetHeight;

  let scale = scaleX;
  if (scaleX > scaleY) scale = scaleY;

  element.style.transformOrigin = 'top';
  element.style.transform = `scale(${scale})`;
}
scaleToWindow();
