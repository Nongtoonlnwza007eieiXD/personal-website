// Clock system ใช้สำหรับแสดงเวลาแบบ real-time ทั้ง digital และ analog

/**
 * updateClock()
 * อัปเดตเวลา ปรับเข็มนาฬิกา และแสดงวันที่/วัน
 */
function updateClock() {

    // ดึงเวลาปัจจุบันจากระบบ
    const now = new Date();

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();

    // Digital clock แสดงเวลาในรูปแบบ HH:MM:SS
    const digitalDisplay =
        String(h).padStart(2, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0");

    const digitalEl = document.getElementById("digitalTime");
    if (digitalEl) digitalEl.textContent = digitalDisplay;

    // แสดงวันที่
    const dateEl = document.getElementById("date");
    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    // แสดงวันในสัปดาห์
    const dayEl = document.getElementById("day");
    if (dayEl) {
        dayEl.textContent = now.toLocaleDateString("en-US", {
            weekday: "long"
        });
    }

    // คำนวณองศาของเข็มนาฬิกา
    const hourDeg = (h % 12) * 30 + m * 0.5;
    const minuteDeg = m * 6;
    const secondDeg = s * 6 + ms * 0.006;

    const hourHand = document.getElementById("hour");
    const minHand = document.getElementById("minute");
    const secHand = document.getElementById("second");

    // หมุนเข็มนาฬิกา
    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
    if (secHand) secHand.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;

    // ใช้ requestAnimationFrame เพื่อให้ animation ลื่น
    requestAnimationFrame(updateClock);
}

// เริ่มทำงานทันทีเมื่อโหลดหน้า
updateClock();



// Stopwatch system ใช้สำหรับจับเวลา

let running = false;        // สถานะการทำงาน
let stopWatchTime = 0;     // เวลา (millisecond)
let stopwatchInterval;     // เก็บ interval

/**
 * startStop()
 * เริ่มหรือหยุด stopwatch
 */
function startStop() {

    const displayEl = document.getElementById("stopwatch");

    if (!running) {
        running = true;

        // เพิ่มเวลาทุก 10ms
        stopwatchInterval = setInterval(() => {

            stopWatchTime += 10;

            let seconds = Math.floor(stopWatchTime / 1000);
            let minutes = Math.floor(seconds / 60);
            let displaySeconds = seconds % 60;
            let ms = Math.floor((stopWatchTime % 1000) / 10);

            // แสดงผล
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
 * resetStop()
 * รีเซ็ตเวลาเป็นค่าเริ่มต้น
 */
function resetStop() {

    running = false;
    clearInterval(stopwatchInterval);
    stopWatchTime = 0;

    const displayEl = document.getElementById("stopwatch");
    if (displayEl) displayEl.textContent = "00:00.00";
}