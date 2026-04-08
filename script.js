const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let angle = 0;
let spinning = false;
let speed = 0;

const inputs = document.querySelectorAll(".inputs input");

const colors = [
  "#FF6B6B","#FFD93D","#6BCB77","#4D96FF",
  "#B983FF","#FF9F1C","#2EC4B6","#E71D36"
];

// 항상 5칸 유지
function getItems() {
  return Array.from(inputs).map(i => i.value.trim() || "메뉴");
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
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(item, 120, 0);
    ctx.restore();
  });

  drawPointer();
}

// 🔺 포인터
function drawPointer() {
  ctx.beginPath();
  ctx.moveTo(200, 10);
  ctx.lineTo(190, 30);
  ctx.lineTo(210, 30);
  ctx.fillStyle = "#000";
  ctx.fill();
}

// 🎯 자연스러운 감속
function animate() {
  if (spinning) {
    angle += speed;
    speed *= 0.985;

    if (speed < 0.002) {
      spinning = false;
      speed = 0;
      showResult();
    }
  }

  drawRoulette();
  requestAnimationFrame(animate);
}

// ▶ 시작 (빠른 회전)
function startSpin() {
  if (!spinning) {
    speed = Math.random() * 0.6 + 0.6;
    spinning = true;
  }
}

// ⛔ 터치 시 감속
function stopSpin() {
  speed *= 0.9;
}

// 🎉 결과 계산
function showResult() {
  const items = getItems();
  const arc = (2 * Math.PI) / items.length;

  // 각도 정규화
  let normalized = angle % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;

  // 🎯 핵심: 포인터는 "12시 방향 = -π/2"
  const pointerAngle = (normalized + Math.PI / 2) % (2 * Math.PI);

  // 인덱스 계산 (반시계 → 시계 방향 보정)
  let index = Math.floor((2 * Math.PI - pointerAngle) / arc) % items.length;

  const result = items[index];
  showOverlay(result);
}

// 📱 결과 UI (alert 제거)
function showOverlay(text) {
  let overlay = document.getElementById("resultOverlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "resultOverlay";

    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 999;

    overlay.innerHTML = `
      <div style="
        background:white;
        padding:30px;
        border-radius:20px;
        text-align:center;
        font-size:20px;
      ">
        🍽 오늘 저녁은<br><br>
        <b>${text}</b><br><br>
        <button onclick="document.body.removeChild(this.parentNode.parentNode)">
          닫기
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
  }
}

// 이벤트
document.getElementById("spinBtn").addEventListener("click", startSpin);
canvas.addEventListener("click", stopSpin);
canvas.addEventListener("touchstart", stopSpin);

// 입력 변경 시 초기화 (버그 방지 핵심)
inputs.forEach(input => 
  input.addEventListener("input", () => {
    angle = 0;
    drawRoulette();
  })
);

animate();