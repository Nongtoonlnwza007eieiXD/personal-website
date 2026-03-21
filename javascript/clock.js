// [1] ===== CLOCK SYSTEM =====

/**
 * ฟังก์ชันอัปเดตเวลารีลไทม์ (ทั้ง Analog และ Digital)
 */
function updateClock() {
    const now = new Date();

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    /* [DIGITAL CLOCK LOGIC] */
    // จัดรูปแบบ 00:00:00 โดยใช้ padStart(2, "0") เพื่อความสวยงาม
    const digitalDisplay = 
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0");

    const digitalEl = document.getElementById("digitalTime");
    if (digitalEl) digitalEl.textContent = digitalDisplay;

    // แสดงวันที่และวันในสัปดาห์โดยใช้ Built-in Locale String
    const dateEl = document.getElementById("date");
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString("en-US", { 
            day: "numeric", 
            month: "long", 
            year: "numeric" 
        });
    }

    const dayEl = document.getElementById("day");
    if (dayEl) {
        dayEl.textContent = now.toLocaleDateString("en-US", { weekday: "long" });
    }

    /* [ANALOG CLOCK LOGIC - MATHEMATICS] */
    /**
     * การคำนวณองศา (Degree Calculation):
     * 1. ชั่วโมง: 1 รอบมี 12 ชม. (360/12 = 30 องศาต่อชม.) 
     * บวกเพิ่มตามนาที (30/60 = 0.5 องศาต่อนามี) เพื่อให้เข็มค่อยๆ ขยับ
     * 2. นาที: 1 รอบมี 60 นาที (360/60 = 6 องศาต่อนาที)
     * 3. วินาที: 1 รอบมี 60 วินาที (360/60 = 6 องศาต่อวินาที)
     */
    const hourDeg = (h % 12) * 30 + m * 0.5;
    const minuteDeg = m * 6;
    const secondDeg = s * 6 + ms * 0.006; // บวก ms เพื่อให้เข็มวินาทีเดินแบบกวาด (Sweep second)

    // อัปเดต CSS Transform โดยรักษาค่า translateX(-50%) เพื่อให้เข็มอยู่ตรงกลาง
    const hourHand = document.getElementById("hour");
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("second");

    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    if (secHand) secHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;

    // [BEST PRACTICE] ใช้ requestAnimationFrame แทน setInterval เพื่อประสิทธิภาพการเรนเดอร์ที่ดีกว่า
    requestAnimationFrame(updateClock);
}

// เริ่มการทำงานของนาฬิกา
updateClock();



// [2] ===== STOPWATCH SYSTEM =====

let running = false;
let stopWatchTime = 0; // ใช้ชื่อตัวแปรที่ชัดเจนเพื่อไม่ให้สับสนกับตัวแปรอื่น
let stopwatchInterval;

/**
 * ฟังก์ชันเริ่มหรือหยุดตัวจับเวลา
 */
function startStop() {
    const displayEl = document.getElementById("stopwatch");

    if (!running) {
        running = true;
        // ตั้งค่า Interval ทุกๆ 10ms เพื่อความแม่นยำของทศนิยม
        stopwatchInterval = setInterval(() => {
            stopWatchTime += 10;

            let seconds = Math.floor(stopWatchTime / 1000);
            let minutes = Math.floor(seconds / 60);
            let displaySeconds = seconds % 60;
            let ms = Math.floor((stopWatchTime % 1000) / 10);

            if (displayEl) {
                displayEl.textContent = 
                    String(minutes).padStart(2, "0") + ":" +
                    String(displaySeconds).padStart(2, "0") + "." +
                    String(ms).padStart(2, "0");
            }
        }, 10);
    } else {
        running = false;
        clearInterval(stopwatchInterval);
    }
}

/**
 * ฟังก์ชันรีเซ็ตตัวจับเวลา
 */
function resetStop() {
    running = false;
    clearInterval(stopwatchInterval);
    stopWatchTime = 0;
    const displayEl = document.getElementById("stopwatch");
    if (displayEl) displayEl.textContent = "00:00.00";
}