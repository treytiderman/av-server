<!-- Javascript -->
<script>
  import { randomBetween,  } from "../js/helper";

  let canvasElement
  
  import { onMount } from "svelte";
  onMount(async () => {

    // Classes
    class Canvas {
      constructor(canvas, dpi) {
        this.canvas = canvasElement
        this.ctx = this.canvas.getContext('2d');
        this.dpi = dpi || window.devicePixelRatio;
        this.scale = this.dpi;
        this.frame = 0;
        this.fps = 0;
        this.time = {
          start: window.performance.now(),
          current: 0,
          last: 0
        };
        this.zoomRate = 0.1;
        this.addDebug(10);
        this.updateScreenSize();
      }
      clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      updateScreenSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.dpi;
        this.canvas.height = rect.height * this.dpi;
        this.ctx.scale(this.scale, this.scale);
      }
      updateFPS() {
        this.time.current = window.performance.now();
        if (this.time.current > this.time.last + 1000) {
          this.time.last = this.time.current;
          this.fps = this.frame/(this.time.last/1000);
        }
      }
      updateDebug() {
        this.debug.children[1].innerText = `Time: ${(this.time.current/1000).toFixed(0)}`
        this.debug.children[2].innerText = `FPS: ${this.fps.toFixed(2)}`
        this.debug.children[0].innerText = `Resolution: ${this.canvas.width} x ${this.canvas.height}`
      }
      update(render) {
        this.frame++;

        this.updateScreenSize();
        this.updateFPS();
        this.updateDebug();
        this.clear();
        
        render();

        // setTimeout(() => {this.update(render)}, 1000/120);
        requestAnimationFrame(() => {this.update(render)});
      }
      addDebug(children) {
        this.debug = document.createElement('div');
        document.querySelector('body').appendChild(this.debug);
        this.debug.classList = 'fixed gap a30-t';
        for (let i = 0; i < children; i++) {
          const p = document.createElement('div');
          this.debug.appendChild(p);
        }
        this.debug.hidden = true;
      }
      hideDebug() {
        this.debug.hidden = true;
      }
      showDebug() {
        this.debug.hidden = false;
      }
    }
    class Partical {

      constructor(x, y, xVel, yVel, radius, color) {

        // Possition
        this.x = x || 100;
        this.y = y || 100;
        
        // Circle
        this.radius = radius || 4;
        this.color = color || '#F80';
        
        // Velocity
        this.xVel = xVel || 0;
        this.yVel = yVel || 0;

      }

      draw() {

        // Move
        this.x += this.xVel
        this.y += this.yVel

        // Collision
        if (this.x <= this.radius || this.x + this.radius >= canvas.width / c.scale) this.xVel *= -1
        if (this.y <= this.radius || this.y + this.radius >= canvas.height / c.scale) this.yVel *= -1

        // Circle
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

      }

    }

    // Canvas
    let c = new Canvas();
    // c.showDebug();
    let canvas = c.canvas;
    let ctx = c.ctx;

    // Render
    let p = [];
    for (let i = 0; i < 2000; i++) {
      let radius = (randomBetween(5, 40)/50)+.5;
      let x = randomBetween(radius, canvas.width/c.dpi - radius);
      let y = randomBetween(radius, canvas.height/c.dpi - radius);
      let neg = 1 + randomBetween(1, 2)%2 * -2;
      let xVel = randomBetween(1, 1000) * neg / 20000;
      let yVel = randomBetween(1, 1000) * neg / 20000;
      let h = randomBetween(220, 290);
      let s = 100;
      let l = 70;
      let a = randomBetween(10, 100)/120;
      p[i] = new Partical(x, y, xVel, yVel, radius, `hsla(${h},${s}%,${l}%,${a})`);
    }
    c.update(() => {
      for (let i = 0; i < p.length; i++) {
        p[i].draw();
      }
    });
  })

  
</script>

<!-- HTML -->
<div>
  <slot/>
  <canvas bind:this={canvasElement}></canvas>
</div>

<style>
  div {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  canvas { 
    position: fixed;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    max-width: 100%;
  }
</style>