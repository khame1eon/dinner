const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let angle = 0;
let spinning = false;
let speed = 0;

const inputs = document.querySelectorAll(".inputs input");

const colors = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#B983FF",
  "#FF9F1C",
  "#2EC4B6",
  "#E71D36"
];

function getItems() {
  return Array.from(inputs)
    .map(i => i.value.trim())
    .filter(v => v !== "");
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
    ctx.fillStyle = colors[i % colors.length];
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

  // 각도 정규화 (0 ~ 2π)
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;

  // 포인터 기준 보정 (위쪽 기준)
  const pointerAngle = (2 * Math.PI - normalized + Math.PI / 2) % (2 * Math.PI);

  let index = Math.floor(pointerAngle / arc);

  // 안전 처리 (undefined 방지)
  index = index % items.length;

  const result = items[index] || "결과 없음";

  alert("오늘 저녁은: " + result);
}

document.getElementById("spinBtn").addEventListener("click", startSpin);
canvas.addEventListener("click", stopSpin);
canvas.addEventListener("touchstart", stopSpin);

inputs.forEach(input => input.addEventListener("input", drawRoulette));

animate();