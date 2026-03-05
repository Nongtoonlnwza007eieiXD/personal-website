let randomNumber = Math.floor(Math.random() * 100) + 1
let attempts = 0
let score = 0
let time = 0

const timerElement = document.getElementById("timer")

setInterval(() => {
    time++
    timerElement.textContent = time
}, 1000)


function checkGuess(){

const guess = Number(document.getElementById("guessInput").value)

const message = document.getElementById("message")

attempts++
document.getElementById("attempts").textContent = attempts


if(guess === randomNumber){

message.textContent = "🎉 ถูกต้อง!"
message.style.color = "green"

document.getElementById("winSound").play()

let points = Math.max(100 - attempts*10 - time,10)

score += points

document.getElementById("score").textContent = score

}

else if(guess > randomNumber){

message.textContent = "📉 มากเกินไป"

}

else{

message.textContent = "📈 น้อยเกินไป"

}

}



function restartGame(){

randomNumber = Math.floor(Math.random()*100)+1

attempts = 0
time = 0

document.getElementById("attempts").textContent = 0
document.getElementById("timer").textContent = 0
document.getElementById("message").textContent = ""
document.getElementById("guessInput").value = ""

}