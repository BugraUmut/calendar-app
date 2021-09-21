var today = new Date()
var currentMonth = today.getMonth()
var currentYear = today.getFullYear()
var selectYear = document.getElementById("year")
var selectMonth = document.getElementById("month")
var eventsContainer = document.getElementById("events-list")
var eventJson, lastSelectedDate

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest()
    rawFile.overrideMimeType("application/json")
    rawFile.open("GET", file, true)
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText)
        }
    }
    rawFile.send(null)
}

readTextFile("./test.json", function(text){
    eventJson = JSON.parse(text)
    showCalendar(currentMonth, currentYear)
})

createYear = generate_year_range(1970, (currentYear + 20))

document.getElementById("year").innerHTML = createYear

var calendar = document.getElementById("calendar")
var lang = calendar.getAttribute('data-lang')

var months = ""
var days = ""

var monthDefault = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

var dayDefault = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

if (lang == "en") {
    months = monthDefault
    days = dayDefault
} else if (lang == "tr") {
    months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    days = ["Pzr", "Pzt", "Sal", "Çrş", "Prş", "Cum", "Cts"]
} else {
    months = monthDefault
    days = dayDefault
}

var $dataHead = "<tr>"
for (dhead in days) {
    $dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + "</th>"
}

$dataHead += "</tr>"

document.getElementById("thead-month").innerHTML = $dataHead

monthAndYear = document.getElementById("monthAndYear")

function generate_year_range(start, end) {
    var years = ""
    for (var year = start; year <= end; year++) {
        years += "<option value='" + year + "'>" + year + "</option>"
    }
    return years
}


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear
    currentMonth = (currentMonth + 1) % 12
    showCalendar(currentMonth, currentYear)
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1
    showCalendar(currentMonth, currentYear)
}

function jump() {
    currentYear = parseInt(selectYear.value)
    currentMonth = parseInt(selectMonth.value)
    showCalendar(currentMonth, currentYear)
}

function showCalendar(month, year) {

    var firstDay = (new Date(year, month)).getDay()

    tbl = document.getElementById("calendar-body")

    tbl.innerHTML = ""

    monthAndYear.innerHTML = months[month] + " " + year
    selectYear.value = year
    selectMonth.value = month

    var date = 1
    for (var i = 0; i < 6; i++) {

        var row = document.createElement("tr")

        for (var j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td")
                cellText = document.createTextNode("")
                cell.appendChild(cellText)
                row.appendChild(cell)
            } else if (date > daysInMonth(month, year)) {
                break
            } else {
                let cell = document.createElement("td")
                cell.setAttribute("data-date", date)
                cell.setAttribute("data-month", month + 1)
                cell.setAttribute("data-year", year)
                cell.setAttribute("data-month_name", months[month])
                cell.setAttribute('title', `${date} ${months[month]} ${year}`)
                cell.setAttribute('data-full_date', `${date}-${month}-${year}`)
                cell.addEventListener('click', renderEvents)
                
                cell.className = "date-picker"
                cell.innerHTML = date

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    lastSelectedDate = cell
                    cell.click()
                    cell.className = "date-picker selected"
                }
                row.appendChild(cell)
                date++
            }


        }

        tbl.appendChild(row)
    }

    document.querySelector(".events-container").style.minHeight = '' +document.querySelector('.main-container').offsetHeight + 'px'
    document.querySelector(".events-container").style.maxHeight = '' +document.querySelector('.main-container').offsetHeight + 'px'
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate()
}

function renderEvents(e) {
    try {
        lastSelectedDate.className = "date-picker"
        lastSelectedDate = e.target

        let selectedDate = e.target.dataset.full_date
        let event = eventJson[selectedDate].events
        eventsContainer.innerHTML = ''
        event.forEach(ev => {
            eventsContainer.innerHTML += `<div class="event"><div class="event-date">${ev.eventTime}</div>
        <div class="event-name">${ev.eventName}</div></div>`
        });
    } catch (err) {
        console.log(err)
        eventsContainer.innerHTML = `<div class="event">${e.target.getAttribute("title")} Tarihinde Hiçbir Etkinliğiniz Bulunmamaktadır.</div>`
    }

    e.target.className = "date-picker selected"

    // if(eventsContainer.offsetTop < document.getElementById('events-container').offsetTop) {
    //     eventsContainer.style.marginTop = `calc(${document.getElementById('events-container').offsetTop}px + 4rem)`
    // } else {
    //     eventsContainer.style.marginTop = '0px'
    // }
}

let dark_mode_toggle = document.querySelector('.dark-mode-switch')

dark_mode_toggle.onclick = () => {
    document.querySelector('body').classList.toggle('light')
    document.querySelector('body').classList.toggle('dark')
}

let new_event_form_open = document.querySelector('.add-new-event')
let new_event_form_close = document.querySelector('#new-event-button')

new_event_form_open.onclick = changeWindows()

function changeWindows(elemToHide, elemToShow) {

}

// animate__backInDown
// animate__backOutDown