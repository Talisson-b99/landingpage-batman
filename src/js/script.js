const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let w,
  h,
  balls = [];
let mouse = {
  x: undefined,
  y: undefined,
};

const colors = [
  "rgb(0, 0, 0)", // Preto
  "rgb(255, 215, 0)", // Amarelo (Gold)
];

function init() {
  reziseReset();
  animationLoop();
}

function reziseReset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function animationLoop() {
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  drawBalls();

  let temp = [];
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].time <= balls[i].ttl) {
      temp.push(balls[i]);
    }
  }

  balls = temp;

  requestAnimationFrame(animationLoop);
}

function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].draw();
  }
}

// define a variavel let com o posicionamento do mouse na posição x e y
function mousemove(e) {
  mouse.x = e.x;
  mouse.y = e.y;

  for (let i = 0; i < 2; i++) {
    balls.push(new Bat());
  }
}

// define a variavel let para undefined quando o mouse é retirado da página
function mouseout(e) {
  mouse.x = undefined;
  mouse.y = undefined;
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

class Bat {
  constructor() {
    this.start = {
      x: mouse.x + getRandomInt(-10, 20),
      y: mouse.y + getRandomInt(-10, 20),
      size: getRandomInt(20, 20),
    };
    this.end = {
      x: this.start.x + getRandomInt(-200, 200),
      y: this.start.y + getRandomInt(-200, 200),
    };
    this.x = this.start.x;
    this.y = this.start.y;
    this.size = this.start.size;

    this.style = colors[getRandomInt(0, colors.length)];

    this.time = 0;
    this.ttl = 120;
  }

  draw() {
    ctx.fillStyle = this.style;
    ctx.beginPath();
    // Desenhando a forma do logo do Batman - versão simplificada
    const w = this.size;
    const h = this.size * 0.6;
    ctx.moveTo(this.x, this.y - h * 0.2);
    ctx.lineTo(this.x + w * 0.5, this.y - h * 0.5);
    ctx.lineTo(this.x + w * 0.6, this.y - h);
    ctx.lineTo(this.x + w * 0.7, this.y - h * 0.3);
    ctx.lineTo(this.x + w, this.y - h * 0.2);
    ctx.lineTo(this.x + w * 0.85, this.y + h * 0.1);
    ctx.lineTo(this.x + w * 0.95, this.y + h * 0.5);
    ctx.lineTo(this.x + w * 0.5, this.y + h * 0.35);
    ctx.lineTo(this.x, this.y + h * 0.5);
    ctx.lineTo(this.x - w * 0.5, this.y + h * 0.35);
    ctx.lineTo(this.x - w * 0.95, this.y + h * 0.5);
    ctx.lineTo(this.x - w * 0.85, this.y + h * 0.1);
    ctx.lineTo(this.x - w, this.y - h * 0.2);
    ctx.lineTo(this.x - w * 0.7, this.y - h * 0.3);
    ctx.lineTo(this.x - w * 0.6, this.y - h);
    ctx.lineTo(this.x - w * 0.5, this.y - h * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    if (this.time <= this.ttl) {
      let progress = 1 - (this.ttl - this.time) / this.ttl;

      this.size = this.start.size * (1 - easeOutQuart(progress));
      this.x = this.x + (this.end.x - this.x) * 0.01;
      this.y = this.y + (this.end.y - this.y) * 0.01;
    }
    this.time++;
  }
}

// Funções auxiliares
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

// Supondo que você já tenha um contexto de canvas `ctx`,

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", reziseReset);
window.addEventListener("mousemove", mousemove);
window.addEventListener("mouseout", mouseout);

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#main",
    start: "50% 50%",
    end: "100% 50%",
    scrub: 2,
    pin: true,
  },
});
tl.to("#top", { top: "-51%" });
tl.to("#bottom", { bottom: "-51%" }, "<");

document.getElementById("next").onclick = function () {
  let lists = document.querySelectorAll(".item");

  document.getElementById("slide").appendChild(lists[0]);
};

document.getElementById("prev").onclick = function () {
  let lists = document.querySelectorAll(".item");

  document.getElementById("slide").prepend(lists[lists.length - 1]);
};

const items = document.querySelectorAll(".item-accordion");

const expand = (item, i) => {
  items.forEach((it, ind) => {
    if (i === ind) return;
    it.clicked = false;
  });

  gsap.to(items, {
    width: item.clicked ? "15vw" : "8vw",
    duration: 2,
    ease: "elastic(1, 0.6)",
  });

  item.clicked = !item.clicked;

  gsap.to(item, {
    width: item.clicked ? "42vw" : "15vw",
    duration: 2.5,
    ease: "elastic(1, 0.6)",
  });
};

items.forEach((item, i) => {
  item.clicked = false;
  item.addEventListener("click", () => expand(item, i));
});
