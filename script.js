const ui = document.getElementById("ui");

function heart(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

const words = [];
const COUNT = 120;

for (let i = 0; i < COUNT; i++) {
  const span = document.createElement("span");
  span.className = "love";
  span.textContent = "I love you";
  ui.appendChild(span);
  words.push(span);
}

let offset = 0;

function animate() {
  const scale =
    Math.min(window.innerWidth, window.innerHeight) / 45;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  words.forEach((el, i) => {
    const t = (i / COUNT) * Math.PI * 2 + offset;

    const p = heart(t);

    const layer = Math.floor(i / 20);

const x =
  cx +
  p.x * scale +
  layer * 15;

const y =
  cy -
  p.y * scale +
  layer * 15;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  });

  offset += 0.01;
  requestAnimationFrame(animate);
}

animate();
