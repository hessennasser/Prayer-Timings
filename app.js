// calender
var showBtn = document.getElementById('show-button'),
    cal = new Calendar(true, 0, false, true);
document.getElementById('calendar').appendChild(cal.getElement());
showMe();

cal.onHide = function () {
    showBtn.style.display = 'block';
};

function showMe() {
    showBtn.style.display = 'none';
    cal.show();
}
// calender



// aladhan times 
const fajr = document.querySelector(".Fajr .time");
const sunrise = document.querySelector(".Sunrise .time");
const dhuhr = document.querySelector(".Dhuhr .time");
const asr = document.querySelector(".Asr .time");
const maghrib = document.querySelector(".Maghrib .time");
const isha = document.querySelector(".Isha .time");

let hijriByWords = document.querySelector(".hijri .byWords");
let gregorianByWords = document.querySelector(".gregorian .byWords");

let hijriByNumber = document.querySelector(".hijri  .byNumber");
let gregorianByNumber = document.querySelector(".gregorian .byNumber");

let latitude = localStorage.getItem("latitude");
let longitude = localStorage.getItem("longitude");

if (!latitude || !longitude) {
    navigator.geolocation.getCurrentPosition(
        position => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);

            // rest of the code here
        }
    );
}

let getTiming = () => {
            const currentDate = new Date();
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear().toString();
            const formattedDate = `${day}-${month}-${year}`;

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch(`https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    switch (result.data.date.gregorian.month.number) {
                        case 1:
                            result.data.date.gregorian.month.number = "يناير";
                            break;
                        case 2:
                            result.data.date.gregorian.month.number = "فبراير";
                            break;
                        case 3:
                            result.data.date.gregorian.month.number = "مارس";
                            break;
                        case 4:
                            result.data.date.gregorian.month.number = "أبريل";
                            break;
                        case 5:
                            result.data.date.gregorian.month.number = "مايو";
                            break;
                        case 6:
                            result.data.date.gregorian.month.number = "يونيو";
                            break;
                        case 7:
                            result.data.date.gregorian.month.number = "يوليو";
                            break;
                        case 8:
                            result.data.date.gregorian.month.number = "أغسطس";
                            break;
                        case 9:
                            result.data.date.gregorian.month.number = "سبتمبر";
                            break;
                        case 10:
                            result.data.date.gregorian.month.number = "أكتوبر";
                            break;
                        case 11:
                            result.data.date.gregorian.month.number = "نوفمبر";
                            break;
                        case 12:
                            result.data.date.gregorian.month.number = "ديسمبر";
                            break;
                    }
                    hijriByWords.textContent = `${result.data.date.hijri.day} ${result.data.date.hijri.month.ar} ${result.data.date.hijri.year} هـ`;
                    gregorianByWords.textContent = ` ${result.data.date.gregorian.day} ${result.data.date.gregorian.month.number} ${result.data.date.gregorian.year} م`;

                    hijriByNumber.textContent = `${result.data.date.hijri.date}`;
                    gregorianByNumber.textContent = `${result.data.date.gregorian.date}`;
                    let convertTime12HourFormat = (time) => {
                        let timeArr = time.split(":");
                        let hours = parseInt(timeArr[0]);
                        let minutes = timeArr[1];
                        let amOrPm = hours >= 12 ? "م" : "ص";
                        hours = hours % 12 || 12;
                        return hours + ":" + minutes + " " + amOrPm;
                    };
                    fajr.textContent = convertTime12HourFormat(result.data.timings.Fajr);
                    sunrise.textContent = convertTime12HourFormat(result.data.timings.Sunrise);
                    dhuhr.textContent = convertTime12HourFormat(result.data.timings.Dhuhr);
                    asr.textContent = convertTime12HourFormat(result.data.timings.Asr);
                    maghrib.textContent = convertTime12HourFormat(result.data.timings.Maghrib);
                    isha.textContent = convertTime12HourFormat(result.data.timings.Isha);
                    console.log(result.data.timings.Asr);
                })
                .catch(error => console.log('error', error));
        }
        
window.addEventListener("load", () => {
    getTiming();
    getTimeNow();
});

let getTimeNow = () => {
    setInterval(() => {
        let hoursSpan = document.querySelector(".hours");
        let minutesSpan = document.querySelector(".minutes");
        let secondsSpan = document.querySelector(".seconds");
        let pmOrAmSpan = document.querySelector(".pmOrAm");

        const currentTime = new Date();
        let hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        let amOrPm = "AM";

        // Convert hours to 12-hour format
        if (hours > 12) {
            hours -= 12;
            amOrPm = "PM";
        } else if (hours === 0) {
            hours = 12;
        }

        hoursSpan.textContent = hours;
        minutesSpan.textContent = minutes;
        secondsSpan.textContent = seconds;
        pmOrAmSpan.textContent = amOrPm;

    }, 1000);
};
