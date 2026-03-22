// เก็บ reference ของ HTML elements ไว้ใน object เพื่อให้เรียกใช้สะดวกและลดการค้นหา DOM ซ้ำ
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

// ดึงข้อมูล leaderboard และ high score จาก localStorage
// ถ้ายังไม่มีข้อมูล ให้ใช้ค่าเริ่มต้นแทน
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [0, 0, 0, 0, 0];
let highScore = Number(localStorage.getItem("highScore")) || 0;

// ตัวแปรสถานะของเกม
let secretNumber;
let attempts = 0;
let time = 0;
let timerInterval;
let gameOver = false;

// แสดงค่า high score ทันทีเมื่อโหลดหน้าเว็บ
if (el.highScore) el.highScore.textContent = highScore;
if (el.highScoreGame) el.highScoreGame.textContent = highScore;

/**
 * อัปเดตการแสดงผล leaderboard บนหน้าเว็บ
 * ใช้ map() เพื่อสร้างรายการ <li> จากข้อมูลใน array
 */
function updateLeaderboardDisplay() {
  if (!el.leaderboard) return;

  el.leaderboard.innerHTML = leaderboard
    .map(score => `<li>${score}</li>`)
    .join("");
}

/**
 * เริ่มเกมใหม่
 * ฟังก์ชันนี้จะรีเซ็ตสถานะเกม สุ่มเลขใหม่ และเริ่มนับเวลา
 */
function startGame() {
  // ซ่อนหน้าเริ่มต้นและแสดงพื้นที่เกม
  if (el.startScreen) el.startScreen.style.display = "none";
  if (el.gameArea) el.gameArea.hidden = false;

  // สุ่มเลขลับในช่วง 1 ถึง 100
  secretNumber = Math.floor(Math.random() * 100) + 1;

  // รีเซ็ตค่าทุกอย่างก่อนเริ่มเกมรอบใหม่
  attempts = 0;
  time = 0;
  gameOver = false;

  if (el.attempts) el.attempts.textContent = 0;
  if (el.timer) el.timer.textContent = 0;
  if (el.score) el.score.textContent = 0;
  if (el.message) el.message.textContent = "";
  if (el.input) el.input.value = "";

  // ล้าง interval เดิมก่อน เพื่อไม่ให้มีตัวจับเวลาซ้อนกัน
  clearInterval(timerInterval);

  // เริ่มนับเวลาทีละ 1 วินาที
  timerInterval = setInterval(() => {
    time++;
    if (el.timer) el.timer.textContent = time;
  }, 1000);

  // ย้าย cursor ไปที่ช่อง input ทันที เพื่อให้เล่นต่อได้สะดวก
  if (el.input) el.input.focus();
}

/**
 * ตรวจสอบค่าที่ผู้เล่นทาย
 * ถ้าค่าถูกต้องจะเข้าสู่การชนะเกม
 * ถ้าผิดจะแสดงคำใบ้ว่าเลขมากไปหรือน้อยไป
 */
function checkGuess() {
  // ถ้าเกมจบแล้ว ไม่ต้องให้ตรวจซ้ำ
  if (gameOver) return;

  const value = el.input.value.trim();

  // ตรวจสอบว่าผู้ใช้กรอกข้อมูลหรือไม่
  if (!value) {
    alert("กรุณากรอกตัวเลข");
    return;
  }

  const guess = Number(value);

  // ตรวจสอบว่าค่าอยู่ในช่วง 1 - 100 หรือไม่
  if (guess < 1 || guess > 100) {
    alert("กรุณากรอกเลข 1 - 100 เท่านั้น");
    el.input.value = "";
    el.input.focus();
    return;
  }

  // เพิ่มจำนวนครั้งที่ทาย
  attempts++;
  if (el.attempts) el.attempts.textContent = attempts;

  // เปรียบเทียบค่าที่ทายกับเลขลับ
  if (guess === secretNumber) {
    handleWin();
  } else {
    if (el.message) {
      el.message.textContent = guess > secretNumber ? "📉 มากเกินไป" : "📈 น้อยเกินไป";
      el.message.style.color = "#d32f2f";
    }
  }

  // ล้าง input และโฟกัสกลับเพื่อให้กรอกใหม่ได้ทันที
  el.input.value = "";
  el.input.focus();
}

/**
 * จัดการเมื่อผู้เล่นทายถูก
 * หยุดเวลา คำนวณคะแนน อัปเดต high score และ leaderboard
 */
function handleWin() {
  clearInterval(timerInterval);
  gameOver = true;

  if (el.message) {
    el.message.textContent = "🎉 ถูกต้อง!";
    el.message.style.color = "#2e7d32";
  }

  // คำนวณคะแนนจากจำนวนครั้งที่ทายและเวลาที่ใช้
  let score = Math.max(0, 1000 - (attempts * 20) - (time * 5));
  if (el.score) el.score.textContent = score;

  // อัปเดต high score ถ้าคะแนนรอบนี้สูงกว่าเดิม
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);

    if (el.highScore) el.highScore.textContent = highScore;
    if (el.highScoreGame) el.highScoreGame.textContent = highScore;
  }

  // เพิ่มคะแนนรอบนี้เข้า leaderboard แล้วเก็บเฉพาะ 5 อันดับแรก
  leaderboard = [...leaderboard, score]
    .sort((a, b) => b - a)
    .slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  updateLeaderboardDisplay();
}

/**
 * เริ่มเกมใหม่อีกครั้ง
 * ใช้ startGame() เดิมเพราะมี logic reset ครบแล้ว
 */
function restartGame() {
  startGame();
}

// แสดง leaderboard ทันทีเมื่อเปิดหน้าเว็บ
updateLeaderboardDisplay();