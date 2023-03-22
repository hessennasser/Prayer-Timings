// calender
var showBtn = document.getElementById('show-button'),
    cal = new Calendar(true, 1, false, true);
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

// Select elements
const fajr = document.querySelector(".Fajr .time");
const sunrise = document.querySelector(".Sunrise .time");
const dhuhr = document.querySelector(".Dhuhr .time");
const asr = document.querySelector(".Asr .time");
const maghrib = document.querySelector(".Maghrib .time");
const isha = document.querySelector(".Isha .time");
const hijriByWords = document.querySelector(".hijri .byWords");
const gregorianByWords = document.querySelector(".gregorian .byWords");
const hijriByNumber = document.querySelector(".hijri .byNumber");
const gregorianByNumber = document.querySelector(".gregorian .byNumber");

let numberOfCount;

// Get location from local storage or ask for permission
let latitude = localStorage.getItem("latitude");
let longitude = localStorage.getItem("longitude");
if (!latitude || !longitude) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);

            getTiming();
        },
        (error) => {
            console.error(error);
        }
    );
} else {
    getTiming();
}

// Helper function to convert 24-hour format to 12-hour format
const convertTime12HourFormat = (time) => {
    let timeArr = time.split(":");
    let hours = parseInt(timeArr[0]);
    let minutes = timeArr[1];
    let amOrPm = hours >= 12 ? "م" : "ص";
    hours = hours % 12 || 12;
    return hours + ":" + minutes + " " + amOrPm;
};

// Fetch prayer times from API and update UI
function getTiming() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();
    const formattedDate = `${day}-${month}-${year}`;
    const requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    fetch(
        `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}`,
        requestOptions
    )
        .then((response) => response.json())
        .then((result) => {
            // Update date in UI
            hijriByWords.textContent = `${result.data.date.hijri.day} ${result.data.date.hijri.month.ar} ${result.data.date.hijri.year} هـ`;
            gregorianByWords.textContent = ` ${result.data.date.gregorian.day} ${result.data.date.gregorian.month.en
                } ${result.data.date.gregorian.year} م`;

            hijriByNumber.textContent = `${result.data.date.hijri.date}`;
            gregorianByNumber.textContent = `${result.data.date.gregorian.date}`;

            // Update prayer times in UI
            fajr.textContent = convertTime12HourFormat(result.data.timings.Fajr);
            sunrise.textContent = convertTime12HourFormat(result.data.timings.Sunrise);
            dhuhr.textContent = convertTime12HourFormat(result.data.timings.Dhuhr);
            asr.textContent = convertTime12HourFormat(result.data.timings.Asr);
            maghrib.textContent = convertTime12HourFormat(result.data.timings.Maghrib);
            isha.textContent = convertTime12HourFormat(result.data.timings.Isha);
        })
        .catch(error => console.log('error', error));
}

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


// import adhkar file 

let namesOfAdhkar = document.querySelector(".namesOfAdhkar");
let TextOfAdhkar = document.querySelector(".TextOfAdhkar");

let getAdhkarName = () => {
    fetch('adhkar.json')
        .then(response => response.json())
        .then(data => {
            for (result of data) {
                let liItem = document.createElement("li");
                liItem.classList.add("dhkr-name");
                liItem.setAttribute("idNumber", result.id);
                liItem.innerHTML = `${result.category}`;
                namesOfAdhkar.appendChild(liItem);
            }
            let dhkrName = document.querySelectorAll(".dhkr-name");
            dhkrName.forEach(element => {
                element.addEventListener("click", () => {
                    getAdhkarText(Number(element.attributes.idNumber.value - 1));
                    console.log();
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
};
function getAdhkarText(number) {
    fetch('adhkar.json')
        .then(response => response.json())
        .then(data => {
            TextOfAdhkar.innerHTML = "";
            document.querySelector(".titleOfAdhkar").textContent = data[number].category;
            for (result in data[number].array) {
                let liItemText = document.createElement("li");
                liItemText.innerHTML = `
                <p>${data[number].array[result].text}</p>
                <p class="number-count">${data[number].array[result].count}</p>
                `;
                TextOfAdhkar.appendChild(liItemText);
            }
            numberOfCount = document.querySelectorAll(".number-count");
            numberOfCount.forEach(ele => {
                ele.addEventListener("click", ()=> {
                    allCount = Number(ele.textContent);
                    
                    if (ele.textContent > 0) {
                        nowCount = ele.textContent = Number(ele.textContent) - 1;
                    }
                    perCount = ((allCount - nowCount) / allCount);
                    ele.style.backgroundColor = `rgba(10, 183, 144,${perCount})`;
                    if (ele.textContent == 0) {
                    }
                })
            })
        })
        .catch(error => {
            console.error('Error:', error);
        });
};


window.addEventListener("load", () => {
    getTiming();
    getTimeNow();
    getAdhkarName();
    getAdhkarText(0);
});

let menuIcon = document.querySelector(".menu-icon");
let leftSide = document.querySelector(".left-side");
menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("active");
    leftSide.classList.toggle("hidden");
});

