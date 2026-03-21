// ===== CACHE DOM =====
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
}


// ===== DATA =====
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [0,0,0,0,0]
let highScore = Number(localStorage.getItem("highScore")) || 0

let secretNumber
let attempts = 0
let time = 0
let timerInterval
let gameOver = false


// ===== INIT =====
if (el.highScore) el.highScore.textContent = highScore
if (el.highScoreGame) el.highScoreGame.textContent = highScore


// ===== LEADERBOARD =====
function updateLeaderboardDisplay(){

  if(!el.leaderboard) return

  el.leaderboard.innerHTML = leaderboard
    .map(score => `<li>${score}</li>`)
    .join("")
}


// ===== START GAME =====
function startGame(){

  el.startScreen.style.display = "none"
  el.gameArea.hidden = false

  secretNumber = Math.floor(Math.random() * 100) + 1

  attempts = 0
  time = 0
  gameOver = false

  el.attempts.textContent = 0
  el.timer.textContent = 0
  el.score.textContent = 0
  el.message.textContent = ""
  el.input.value = ""

  clearInterval(timerInterval)

  timerInterval = setInterval(() => {
    time++
    el.timer.textContent = time
  }, 1000)

  el.input.focus()
}


// ===== CHECK GUESS =====
function checkGuess(){

  if(gameOver) return

  const value = el.input.value.trim()

  if(!value){
    alert("กรุณากรอกตัวเลข")
    return
  }

  const guess = Number(value)

  if(guess < 1 || guess > 100){
    alert("กรุณากรอกเลข 1 - 100 เท่านั้น")
    el.input.value = ""
    el.input.focus()
    return
  }

  attempts++
  el.attempts.textContent = attempts

  if(guess === secretNumber){

    clearInterval(timerInterval)
    gameOver = true

    el.message.textContent = "🎉 ถูกต้อง!"

    let score = Math.max(0, 1000 - (attempts * 20) - (time * 5))
    el.score.textContent = score

    el.winSound?.play()

    // HIGH SCORE
    if(score > highScore){
      highScore = score
      localStorage.setItem("highScore", highScore)

      if (el.highScore) el.highScore.textContent = highScore
      if (el.highScoreGame) el.highScoreGame.textContent = highScore
    }

    // LEADERBOARD
    leaderboard = [...leaderboard, score]
      .sort((a,b) => b - a)
      .slice(0,5)

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
    updateLeaderboardDisplay()

  }
  else{
    el.message.textContent = guess > secretNumber
      ? "📉 มากเกินไป"
      : "📈 น้อยเกินไป"
  }

  el.input.value = ""
  el.input.focus()
}


// ===== RESTART =====
function restartGame(){
  startGame()
}


// ===== LOAD =====
updateLeaderboardDisplay()