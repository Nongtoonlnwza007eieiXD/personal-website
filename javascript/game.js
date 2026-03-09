// ===== LEADERBOARD =====

let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [0,0,0,0,0]

function updateLeaderboardDisplay(){

let list = document.getElementById("leaderboard")
if(!list) return

list.innerHTML = ""

leaderboard.forEach(function(score){

let li = document.createElement("li")
li.textContent = score
list.appendChild(li)

})

}


// ===== HIGH SCORE =====

let highScore = localStorage.getItem("highScore") || 0
document.getElementById("highScore").textContent = highScore


// ===== GAME VARIABLES =====

let secretNumber
let attempts = 0
let time = 0
let timerInterval
let gameOver = false


// ===== START GAME =====

function startGame(){

document.getElementById("startScreen").style.display = "none"
document.getElementById("gameArea").style.display = "block"

secretNumber = Math.floor(Math.random() * 100) + 1

attempts = 0
time = 0
gameOver = false

document.getElementById("attempts").textContent = 0
document.getElementById("timer").textContent = 0
document.getElementById("score").textContent = 0
document.getElementById("message").textContent = ""
document.getElementById("guessInput").value = ""

clearInterval(timerInterval)

timerInterval = setInterval(function(){

time++
document.getElementById("timer").textContent = time

},1000)

document.getElementById("guessInput").focus()

}


// ===== CHECK GUESS =====

function checkGuess(){

if(gameOver) return

let input = document.getElementById("guessInput")
let guess = Number(input.value)

if(input.value === ""){
alert("กรุณากรอกตัวเลข")
return
}

if(guess < 1 || guess > 100){
alert("กรุณากรอกเลข 1 - 100 เท่านั้น")
input.value = ""
input.focus()
return
}

attempts++
document.getElementById("attempts").textContent = attempts


if(guess === secretNumber){

clearInterval(timerInterval)

gameOver = true

document.getElementById("message").textContent = "🎉 ถูกต้อง!"

// สูตรคะแนนใหม่ (ไม่ติดลบง่าย)
let score = 1000 - (attempts * 20) - (time * 5)

if(score < 0){
score = 0
}

document.getElementById("score").textContent = score

document.getElementById("winSound").play()


// ===== HIGH SCORE =====

if(score > highScore){

highScore = score

localStorage.setItem("highScore", highScore)

document.getElementById("highScore").textContent = highScore

}


// ===== LEADERBOARD =====

leaderboard.push(score)

leaderboard.sort(function(a,b){
return b - a
})

leaderboard = leaderboard.slice(0,5)

localStorage.setItem("leaderboard", JSON.stringify(leaderboard))

updateLeaderboardDisplay()

}

else if(guess > secretNumber){

document.getElementById("message").textContent = "📉 มากเกินไป"

}

else{

document.getElementById("message").textContent = "📈 น้อยเกินไป"

}


// ล้างช่องกรอก
input.value = ""
input.focus()

}


// ===== RESTART GAME =====

function restartGame(){

startGame()

}


// ===== LOAD DATA =====

updateLeaderboardDisplay()