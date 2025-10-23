let bookedDates = {};
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

async function fetchBookedDates() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to view the calendar.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("/api/events/booked-dates", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                alert("Session expired. Please log in again.");
                window.location.href = "/login";
            }
            throw new Error("Failed to fetch booked dates");
        }

        bookedDates = await response.json();
    } catch (err) {
        console.error("Failed to fetch booked dates:", err);
        bookedDates = {};
    } finally {
        renderCalendar(currentYear, currentMonth);
    }
}

function renderCalendar(year, month) {
    const calendar = document.getElementById("calendar");
    const monthYearText = document.getElementById("monthYear");
    calendar.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

    monthYearText.innerText = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const div = document.createElement("div");
        div.classList.add("weekday");
        div.innerText = day;
        calendar.appendChild(div);
    });

    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= totalDays; day++) {
        const div = document.createElement("div");
        div.classList.add("day");
        div.innerText = day;

        if (bookedDates[monthStr] && bookedDates[monthStr][day]) {
            div.classList.add("booked");
            div.onclick = () => showPopup(bookedDates[monthStr][day]);
        }

        calendar.appendChild(div);
    }
}

function showPopup(eventsForDay) {
    const titleEl = document.getElementById("eventTitle");
    const detailsEl = document.getElementById("eventDetails");

    titleEl.innerText = "Events on this day:";
    detailsEl.innerHTML = "";

    eventsForDay.forEach(eventInfo => {
        const p = document.createElement("p");
        p.innerText = `• ${eventInfo.event} (Hall: ${eventInfo.halls})`;
        detailsEl.appendChild(p);
    });

    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
}

window.onload = fetchBookedDates;
