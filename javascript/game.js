// [1] ===== CACHE DOM ELEMENTS =====
// เก็บ Reference ของ HTML Elements ไว้ใน Object เพื่อเพิ่ม Performance (ไม่ต้องค้นหาใหม่ทุกครั้ง)
const el = {
  leaderboard: document.getElementById("leaderboard"),
  highScore: document.getElementById("highScore"),
  highScoreGame: document.getElementById("highScoreGame"),
  attempts: document.getElementById("attempts"),
  timer: document.getElementById("timer"),
  score: document.getElementById("score"),
  message: document.getElementById("message"),
  input: document.getElementById("guessInput"),
  startScreen: document.getElementById("startScreen"),
  gameArea: document.getElementById("gameArea"),
  winSound: document.getElementById("winSound")
};

// [2] ===== DATA MANAGEMENT =====
// ดึงข้อมูลจาก LocalStorage ถ้าไม่มีให้ใช้ค่าเริ่มต้น (Default Value)
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [0, 0, 0, 0, 0];
let highScore = Number(localStorage.getItem("highScore")) || 0;

// Game State Variables
let secretNumber;
let attempts = 0;
let time = 0;
let timerInterval;
let gameOver = false;

// [3] ===== INITIALIZATION =====
// แสดงผล High Score ทันทีเมื่อโหลดหน้าเว็บ (ถ้ามี Element นั้นอยู่)
if (el.highScore) el.highScore.textContent = highScore;
if (el.highScoreGame) el.highScoreGame.textContent = highScore;

// [4] ===== LEADERBOARD LOGIC =====
/**
 * อัปเดตการแสดงผลตารางอันดับ
 * ใช้ Method .map() และ .join() ในการสร้าง HTML String จาก Array
 */
function updateLeaderboardDisplay() {
  if (!el.leaderboard) return;
  el.leaderboard.innerHTML = leaderboard
    .map(score => `<li>${score}</li>`)
    .join("");
}

// [5] ===== GAME CORE FUNCTIONS =====

/**
 * ฟังก์ชันเริ่มเกม: รีเซ็ตสถานะและเริ่มจับเวลา
 */
function startGame() {
  // สลับหน้าจอด้วย CSS Display และ Hidden Property
  if (el.startScreen) el.startScreen.style.display = "none";
  if (el.gameArea) el.gameArea.hidden = false;

  // สุ่มตัวเลข 1 - 100
  secretNumber = Math.floor(Math.random() * 100) + 1;

  // รีเซ็ตค่าสถิติต่างๆ
  attempts = 0;
  time = 0;
  gameOver = false;

  el.attempts.textContent = 0;
  el.timer.textContent = 0;
  el.score.textContent = 0;
  el.message.textContent = "";
  el.input.value = "";

  // จัดการ Timer: เคลียร์ค่าเก่าก่อนเริ่มใหม่เพื่อป้องกัน Memory Leak
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    el.timer.textContent = time;
  }, 1000);

  el.input.focus(); // ให้ Cursor ไปอยู่ที่ช่องกรอกทันที
}

/**
 * ฟังก์ชันตรวจสอบการทายตัวเลข
 */
function checkGuess() {
  if (gameOver) return;

  const value = el.input.value.trim();

  // Validation: ตรวจสอบความถูกต้องของ Input
  if (!value) {
    alert("กรุณากรอกตัวเลข");
    return;
  }

  const guess = Number(value);
  if (guess < 1 || guess > 100) {
    alert("กรุณากรอกเลข 1 - 100 เท่านั้น");
    el.input.value = "";
    el.input.focus();
    return;
  }

  attempts++;
  el.attempts.textContent = attempts;

  // เปรียบเทียบค่า (Game Logic)
  if (guess === secretNumber) {
    handleWin();
  } else {
    el.message.textContent = guess > secretNumber ? "📉 มากเกินไป" : "📈 น้อยเกินไป";
    el.message.style.color = "#d32f2f"; // เปลี่ยนสีเพื่อเน้นข้อความ
  }

  el.input.value = "";
  el.input.focus();
}

/**
 * จัดการเมื่อผู้เล่นชนะเกม
 */
function handleWin() {
  clearInterval(timerInterval);
  gameOver = true;
  el.message.textContent = "🎉 ถูกต้อง!";
  el.message.style.color = "#2e7d32";

  // การคำนวณคะแนนแบบไดนามิก
  let score = Math.max(0, 1000 - (attempts * 20) - (time * 5));
  el.score.textContent = score;

  // เล่นเสียง (Optional Chaining เพื่อป้องกัน Error ถ้าไฟล์เสียงโหลดไม่เข้า)
  el.winSound?.play();

  // จัดการ High Score & LocalStorage
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    if (el.highScore) el.highScore.textContent = highScore;
    if (el.highScoreGame) el.highScoreGame.textContent = highScore;
  }

  // จัดการ Leaderboard (Top 5)
  leaderboard = [...leaderboard, score]
    .sort((a, b) => b - a)
    .slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboardDisplay();
}

/**
 * ฟังก์ชันเริ่มใหม่
 */
function restartGame() {
  startGame();
}

// [6] ===== INITIAL LOAD =====
updateLeaderboardDisplay();