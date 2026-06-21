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

  const container = document.getElementById("svg-container");
  container.innerHTML = svgText;

  const paths = [...container.querySelectorAll("path")];

  if (!paths.length) {
    throw new Error("No paths found");
  }

  // Find bounds of all paths
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  paths.forEach((path) => {
    const box = path.getBBox();

    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  });

  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  const scale = Math.min(
    canvas.width / svgWidth,
    canvas.height / svgHeight
  ) * 0.8;

  const offsetX =
    (canvas.width - svgWidth * scale) / 2;

  const offsetY =
    (canvas.height - svgHeight * scale) / 2;

  const hearts = [];

  paths.forEach((path) => {
    const length = path.getTotalLength();

    for (let i = 0; i < 120; i++) {
      hearts.push({
        path,
        length,
        offset: Math.random() * length,
        speed: 0.5 + Math.random(),
        size: 2 + Math.random() * 2
      });
    }
  });

  function drawHeart(x, y, size) {
    ctx.save();
    ctx.translate(x, y);

    ctx.beginPath();

    ctx.moveTo(0, size);

    ctx.bezierCurveTo(
      size,
      -size,
      size * 2,
      size / 2,
      0,
      size * 2
    );

    ctx.bezierCurveTo(
      -size * 2,
      size / 2,
      -size,
      -size,
      0,
      size
    );

    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffeb3b";
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.restore();
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hearts.forEach((heart) => {
      heart.offset += heart.speed;

      if (heart.offset > heart.length) {
        heart.offset = 0;
      }

      const p =
        heart.path.getPointAtLength(
          heart.offset
        );

      const x =
        (p.x - minX) * scale + offsetX;

      const y =
        (p.y - minY) * scale + offsetY;

      drawHeart(x, y, heart.size);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

start().catch(console.error);
