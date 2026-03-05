const btn = document.getElementById("themeToggle")

btn.addEventListener("click", () => {

document.body.classList.toggle("dark")

if(document.body.classList.contains("dark")){
btn.textContent="☀️"
}else{
btn.textContent="🌙"
}

})