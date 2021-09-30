// const checkbox = (str) => {
//     return `<label class="checkbox-container">${str}
// <input type="checkbox" checked="checked">
// <span class="checkmark"></span>
// </label>`
// }

var today = new Date()
var currentMonth = today.getMonth()
var currentYear = today.getFullYear()
var selectYear = document.getElementById("year")
var selectMonth = document.getElementById("month")
var eventsContainer = document.getElementById("events-list")
var eventJson, lastSelectedDate
var isFirstTime = true

function loadEvents() {
    eventJson = JSON.parse(localStorage.getItem('events'))
    if(eventJson === null) {
        eventJson = {}
    }
}

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

(() => {
    loadEvents()
    showCalendar(currentMonth, currentYear)
})()

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
                let cellText_date = document.createElement("span")
                // let cellText_event = document.createElement("span")

                cellText_date.className = "cell-text-date"
                cellText_date.innerHTML = date

                // cellText_event.className = "cell-text-event-name"

                // try {
                //     let event = eventJson[`${date}-${month + 1}-${year}`].events
                //     cellText_event.innerHTML = event[0].eventHeader
                // } catch (err) {
                //     // skip the error
                // }

                let full_date = `${date}-${month + 1}-${year}`
                let cName = ""

                cell.setAttribute("data-date", date)
                cell.setAttribute("data-month", month + 1)
                cell.setAttribute("data-year", year)
                cell.setAttribute("data-month_name", months[month])
                cell.setAttribute('title', `${date} ${months[month]} ${year}`)
                cell.setAttribute('data-full_date', full_date)
                cell.addEventListener('click', renderEvents)

                try {
                    let selectedDate = full_date
                    let event = eventJson[selectedDate].events
                    let isThereAnyUnfinishedEvent = false
                    event.forEach(ev => {
                        if(ev.isFinished == false) {
                            cName = "unfinished-event"
                            isThereAnyUnfinishedEvent = true
                        } else if(!isThereAnyUnfinishedEvent) {
                            cName = "finished-event"
                        }
                    });
                } catch (err) {
                    // do nothing
                }

                cName +=  " date-picker"

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth() && isFirstTime === true) {
                    lastSelectedDate = cell
                    cName += " selected"
                    cell.className = cName
                    cell.click()
                    isFirstTime = false
                }
                cell.className = cName
                row.appendChild(cell)
                cell.appendChild(cellText_date)
                // cell.appendChild(document.createElement("br"))
                // cellText_event.style.maxWidth = cell.style.width + "px"
                // cell.appendChild(cellText_event)
                date++
            }


        }

        tbl.appendChild(row)
    }

    // document.querySelector(".events-container").style.minHeight = '' +document.querySelector('.main-container').offsetHeight + 'px'
    // document.querySelector(".events-container").style.maxHeight = '' +document.querySelector('.main-container').offsetHeight + 'px'

    lastSelectedDate.click()
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate()
}

function renderEvents(e) {
    let target
    if(!e.target.className.includes("date-picker")) {
        target = e.target.parentElement
    } else {
        target = e.target
    }
    try {
        lastSelectedDate.classList.remove("selected")
        lastSelectedDate = target
        
        let selectedDate = target.dataset.full_date
        let event = eventJson[selectedDate].events
        eventsContainer.innerHTML = ''
        for(let i = 0; i < event.length; i++) {
            // eventsContainer.innerHTML += checkbox(`<div class="event"><div class="event-date">${ev.eventTime}</div>
            // <div class="event-name">${ev.eventName}</div></div>`)

            let isChecked = event[i].isFinished ? "checked" : ""

            eventsContainer.innerHTML += `
            <div class="event">
                <input type="checkbox" data-full_date="${selectedDate}" data-index="${i}" onclick="testtt(this)" ${isChecked}>
                <div class="event-date">${event[i].eventTime}</div>
                <div class="event-name">${event[i].eventName}</div>
            </div>
            `
        }
    } catch (err) {
        eventsContainer.innerHTML = `<div class="event">${target.getAttribute("title")} Tarihinde Hiçbir Etkinliğiniz Bulunmamaktadır.</div>`
    }

    target.classList.add("selected")

    document.getElementsByClassName('checkbox-container')
}
function testtt(e) {
    eventJson[e.dataset.full_date].events[e.dataset.index].isFinished = e.checked
    localStorage.setItem('events', JSON.stringify(eventJson))
    console.log(lastSelectedDate)
    showCalendar(currentMonth, currentYear)
}
// let dark_mode_toggle = document.querySelector('.dark-mode-switch')

// dark_mode_toggle.onclick = () => {
//     document.querySelector('body').classList.toggle('light')
//     document.querySelector('body').classList.toggle('dark')
// }

let new_event_form = document.getElementById('new-event-form')
let main_area = document.getElementById('wrapper')

let new_event_form_open = document.getElementById('add-new-event-open')
let new_event_form_close = document.getElementById('add-new-event-close')

new_event_form_open.onclick = () => { changeWindows(main_area, new_event_form) }
new_event_form_close.onclick = () => { changeWindows(new_event_form, main_area) }

function changeWindows(elemToHide, elemToShow) {
    elemToHide.className = "animate__animated animate__backOutDown"
    elemToShow.className = "animate__animated animate__backInDown"
}

let new_event_button = document.getElementById('new-event-button')
new_event_button.onclick = () => { addNewEvent() }

function addNewEvent() {
    try {
        let new_event_header = document.getElementById('new-event-header').value
        let new_event_time = document.getElementById('new-event-time').value
        let new_event_desc = document.getElementById('new-event-text').value
        let new_event_date = lastSelectedDate.dataset.full_date
        
        
        if(eventJson[new_event_date] === undefined) {
            let eventObj = {
                "events": [
                    {
                        "eventHeader": new_event_header,
                        "eventName": new_event_desc,
                        "eventTime": new_event_time,
                        "isFinished": false
                    }
                ]
            }

            eventJson[new_event_date] = eventObj
        } else {
            eventJson[new_event_date].events.push({
                "eventHeader": new_event_header,
                "eventName": new_event_desc,
                "eventTime": new_event_time,
                "isFinished": false
            })
        }

        localStorage.setItem('events', JSON.stringify(eventJson))
        showCalendar(currentMonth, currentYear)
        launch_toast("Etkinlik", "Başarıyla Kaydedildi", false)
        new_event_form_close.click()
    } catch (error) {
        launch_toast("Etkinlik", "Kaydetme Başarısız", false)
    }
}

function launch_toast(icon, desc, isFailed) {
    var x = document.getElementById("toast")
    
    document.getElementById('img').innerHTML = icon
    document.getElementById('desc').innerHTML = desc

    if(isFailed) {
        x.className = "show failed"
    } else {
        x.className = "show successed"
    }

    setTimeout(() => {
        x.className = x.className = ""
    }, 5000)
    
}