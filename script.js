const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

async function start() {
  const response = await fetch("./assets/text.svg");
  const svgText = await response.text();

  const parser = new DOMParser();
  const svg = parser.parseFromString(svgText, "image/svg+xml");

  document.body.appendChild(svg.documentElement);

  const text = svg.querySelector("text");

  if (!text) {
    console.error("No text found.");
    return;
  }

  const length = text.getComputedTextLength();

  const particles = [];

  for (let i = 0; i < 800; i++) {
    particles.push({
      offset: Math.random() * length,
      speed: 1 + Math.random(),
      size: 2 + Math.random() * 2
    });
  }

  function drawHeart(x, y, s) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, s);

    ctx.bezierCurveTo(
      s,
      -s,
      s * 2,
      s / 2,
      0,
      s * 2
    );

    ctx.bezierCurveTo(
      -s * 2,
      s / 2,
      -s,
      -s,
      0,
      s
    );

    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffeb3b";
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.offset += p.speed;

      if (p.offset > length) {
        p.offset = 0;
      }

      const ratio = p.offset / length;

      const x =
        canvas.width * 0.15 +
        ratio * canvas.width * 0.55;

      const y =
        canvas.height / 2 +
        Math.sin(ratio * Math.PI * 4) * 20;

      drawHeart(x, y, p.size);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

start();
