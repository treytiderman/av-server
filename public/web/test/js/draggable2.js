// ** How to **
// Use the data attribute data-draggable="grid"
// or for a vertical list data-draggable="list"
// or to turn off data-draggable="no"
// on the parent of the list of cards that you 
// want to make draggable

// Example
/*

<h1>A Draggable List</h1>
<div class="flex">
  <p>Draggable?</p>
  <div>
    <input type="radio" name="radioSet2" id="rad3" onclick="setDraggable('listId', true)" checked>
    <label for="rad1">true</label>
  </div>
  <div>
    <input type="radio" name="radioSet2" id="rad4" onclick="setDraggable('listId', false)">
    <label for="rad2">false</label>
  </div>
</div>
<div class="grid width-md" data-draggable="list" id="listId">
  <style> .row { height: 4rem; } </style>
  <button class="a30 row"> 00 </button>
  <button class="r30 row"> 01 </button>
  <button class="g30 row"> 02 </button>
  <button class="b30 row"> 03 </button>
  <button class="y30 row"> 04 </button>
  <div class="gap grow w30 radius"> </div>
</div>

*/

// Global
function setDraggable(id, state) {

}

// Internal
(() => {

// Elements + Variables
const draggablesArray = document.querySelectorAll("[data-draggable]");
let mouseDown = false;
let dragElement;
let dropElement;

// Add CSS classes
const css = `
  [data-draggable] > .onDrag {
    filter: brightness(150%);
  }
  [data-draggable] > .onDrop {
    transform: scale(1);
    cursor: grabbing;
  }
  [data-draggable="grid"] > .onDrop {
    transform: translateX(calc(var(--gap)/2));
  }
  [data-draggable="list"] > .onDrop {
    transform: translateY(calc(var(--gap)/2));
  }
  [data-draggable] > .onDrop::after {
    content: "";
    background-color: var(--w70);
    border-radius: 99px;
    z-index: 1;
    position: absolute;
  }
  [data-draggable="grid"] > .onDrop::after {
    width: 0px;
    height: 100%;
    padding-left: 1px;
    padding-right: 1px;
    top: 0;
    left: calc(-1*var(--gap)/2 - 2px);
    left: calc(-3*var(--gap)/4 - 3px);
  }
  [data-draggable="list"] > .onDrop::after {
    width: 100%;
    height: 0px;
    padding-top: 1px;
    padding-bottom: 1px;
    left: 0;
    top: calc(-1*var(--gap)/2 - 2px);
    top: calc(-3*var(--gap)/4 - 3px);
  }`
const gridToList400 = `
  @media (max-width: 400px) {      
    [data-draggable="grid"] > .onDrop {
      transform: translateY(calc(var(--gap)/2));
    }
    [data-draggable="grid"] > .onDrop::after {
      width: 100%;
      height: 0px;
      padding-top: 1px;
      padding-bottom: 1px;
      left: 0;
      top: calc(-1*var(--gap)/2 - 2px);
      top: calc(-3*var(--gap)/4 - 3px);
    }
  }`
const cssElement = document.createElement('div');
cssElement.innerHTML = `<style> ${css} ${gridToList400} </style>`;
document.body.appendChild(cssElement);

// Functions
function handleMouseDown(event) {
  dragElement = event.target;
  console.log(dragElement.parentElement);
  mouseDown = true;
  if (dragElement.parentElement.dataset.draggable === 'no') { mouseDown = false }
  dragElement.classList.add("onDrag");
  dropElement = event.target;
}
function handleMouseEnter(i, event) {
  if (event.target.parentElement === draggablesArray[i] && mouseDown === true) {
    dropElement.classList.remove("onDrop");
    dropElement = event.target;
    dropElement.classList.add("onDrop");
  }
}
function handleMouseUp(event) {
  if (mouseDown === true) {
    console.log('handleMouseUp');
    dropElement.parentElement.insertBefore(dragElement, dropElement);
  }
  dropElement.classList.remove("onDrop");
  dragElement.classList.remove("onDrag");
  mouseDown = false;
}
function handleMouseLeave(event) {
  dropElement.classList.remove("onDrop");
  dragElement.classList.remove("onDrag");
  mouseDown = false;
}

function handleTouchStart(event) {
  mouseDown = true;
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX,touch.clientY);
  dragElement = element;
  dragElement.classList.add("onDrag");
  dropElement = element;
}
function handleTouchMove(i, event) {
  event.preventDefault();
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX,touch.clientY);
  if (element.parentElement === draggablesArray[i] && mouseDown === true) {
    dropElement.classList.remove("onDrop");
    dropElement = element;
    dropElement.classList.add("onDrop");
  }
}
function handleTouchEnd(event) {
  if (mouseDown === true) {
    dropElement.parentElement.insertBefore(dragElement, dropElement);
    dropElement.classList.remove("onDrop");
  }
  dragElement.classList.remove("onDrag");
  mouseDown = false;
}

// Add Event Listeners
for (let i = 0; i < draggablesArray.length; i++) {
  draggablesArray[i].addEventListener('mouseleave', handleMouseLeave);
  let draggables = draggablesArray[i].children;
  draggables[draggables.length-1].addEventListener("mouseenter", event => handleMouseEnter(i, event));
  draggables[draggables.length-1].addEventListener("mouseup", handleMouseUp);
  draggables[draggables.length-1].addEventListener('touchmove', event => handleTouchMove(i, event));
  draggables[draggables.length-1].addEventListener("touchend", handleTouchEnd);
  for (let j = 0; j < draggables.length-1; j++) {
    draggables[j].addEventListener("mousedown", handleMouseDown);
    draggables[j].addEventListener("mouseenter", event => handleMouseEnter(i, event));
    draggables[j].addEventListener("mouseup", handleMouseUp);
    draggables[j].addEventListener("touchstart", handleTouchStart);
    draggables[j].addEventListener('touchmove', event => handleTouchMove(i, event));
    draggables[j].addEventListener("touchend", handleTouchEnd);
  }
}

})()
