const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let angle = 0;
let spinning = false;
let speed = 0;

const inputs = document.querySelectorAll(".inputs input");

function getItems() {
  return Array.from(inputs).map(i => i.value || "메뉴");
}

function drawRoulette() {
  const items = getItems();
  const arc = (2 * Math.PI) / items.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  items.forEach((item, i) => {
    const start = angle + i * arc;

    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, start, start + arc);
    ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff6666";
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#000";
    ctx.fillText(item, 100, 5);
    ctx.restore();
  });
}

function animate() {
  if (spinning) {
    angle += speed;
    speed *= 0.99;

    if (speed < 0.002) {
      spinning = false;
      alertResult();
    }
  }

  drawRoulette();
  requestAnimationFrame(animate);
}

function startSpin() {
  if (!spinning) {
    speed = Math.random() * 0.3 + 0.3;
    spinning = true;
  }
}

function stopSpin() {
  speed *= 0.95;
}

function alertResult() {
  const items = getItems();
  const arc = (2 * Math.PI) / items.length;
  const index = Math.floor(((2 * Math.PI - angle) % (2 * Math.PI)) / arc);
  alert("오늘 저녁은: " + items[index]);
}

document.getElementById("spinBtn").addEventListener("click", startSpin);
canvas.addEventListener("click", stopSpin);
canvas.addEventListener("touchstart", stopSpin);

inputs.forEach(input => input.addEventListener("input", drawRoulette));

animate();