function updateClock(){

const now = new Date()

const h = now.getHours()
const m = now.getMinutes()
const s = now.getSeconds()
const ms = now.getMilliseconds()

/* DIGITAL */

document.getElementById("digitalTime").textContent =
String(h).padStart(2,"0")+":"+
String(m).padStart(2,"0")+":"+
String(s).padStart(2,"0")

document.getElementById("date").textContent =
now.toLocaleDateString("en-US",{day:"numeric",month:"long",year:"numeric"})

document.getElementById("day").textContent =
now.toLocaleDateString("en-US",{weekday:"long"})

/* ANALOG */

const hourDeg=(h%12)*30 + m*0.5
const minuteDeg=m*6
const secondDeg=s*6 + ms*0.006

document.getElementById("hour").style.transform=
`translateX(-50%) rotate(${hourDeg}deg)`

document.getElementById("minute").style.transform=
`translateX(-50%) rotate(${minuteDeg}deg)`

document.getElementById("second").style.transform=
`translateX(-50%) rotate(${secondDeg}deg)`

requestAnimationFrame(updateClock)

}

updateClock()


/* STOPWATCH */

let running=false
let time=0
let timer

function startStop(){

if(!running){

running=true

timer=setInterval(()=>{

time+=10

let seconds=Math.floor(time/1000)
let minutes=Math.floor(seconds/60)

seconds=seconds%60

let ms=Math.floor((time%1000)/10)

document.getElementById("stopwatch").textContent=

String(minutes).padStart(2,"0")+":"+
String(seconds).padStart(2,"0")+"."+
String(ms).padStart(2,"0")

},10)

}else{

running=false
clearInterval(timer)

}

}

function resetStop(){

running=false
clearInterval(timer)
time=0

document.getElementById("stopwatch").textContent="00:00.00"

}