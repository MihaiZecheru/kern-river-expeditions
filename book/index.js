function get(id) {
  return document.getElementById(id);
}
const login_cookie = window.localStorage.getItem("login_cookie");
if (!login_cookie) window.location.href = "/login";

if (login_cookie && JSON.parse(login_cookie).isAdmin === true) {
  get("icons-list").innerHTML += `<li class="nav-item me-3 me-lg-0"><a class="nav-link" href="/admin"><i class="fas fa-lock"></i></a></li>`;
}

function get_activity() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('a');
}

// function clear_url_search_params() {
//   const url = new URL(window.location.href);
//   url.search = '';
//   const new_url = url.toString();
//   window.history.replaceState({}, document.title, new_url);
// }
// clear_url_search_params();


const activity = get_activity();
const activitySelect = new mdb.Select(document.getElementById('activity-select'));
activitySelect.setValue(activity);

const datepickerElement = document.querySelector('.datepicker-disable-past')
const datepicker = new mdb.Datepicker(datepickerElement, {
  disablePast: true,
  format: 'mm/dd/yyyy'
});

const availableTimesListElement = document.getElementById('available-times-list');

function populate_available_times_list(availableTimes) {
  availableTimesListElement.innerHTML = '';
  availableTimes.map((timeObj) => {
    if (timeObj.disabled) {
      availableTimesListElement.innerHTML += `
        <li class="list-group-item px-3 border-0 user-select-none disabled">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span><strike>${timeObj.time}</strike></span>
            <h5><span class="badge rounded-pill badge-danger">Booked</span></h5>
          </div>
        </li>
      `;
    } else {
      availableTimesListElement.innerHTML += `
        <li class="list-group-item px-3 border-0 user-select-none">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${timeObj.time}</span>
            <h5><span class="badge rounded-pill badge-success">Available</span></h5>
          </div>
        </li>
      `;
    }
  });

  const listItems = document.querySelectorAll('#available-times-list li');
  listItems.forEach((li) => {
    li.addEventListener('click', () => {
      listItems.forEach((_li) => {
        _li.classList.remove('active');
        _li.ariaCurrent = 'false';
      });

      li.classList.add('active');
      li.ariaCurrent = 'true';
    });
  });
}

// TODO: get from database
function get_times(_activity, _date) {
  return [
    { time: '10:00 AM', disabled: false },
    { time: '11:00 AM', disabled: false },
    { time: '12:00 PM', disabled: false },
    { time: '1:00 PM', disabled: true },
    { time: '2:00 PM', disabled: false },
    { time: '3:00 PM', disabled: false },
    { time: '4:00 PM', disabled: true },
    { time: '5:00 PM', disabled: false },
    { time: '6:00 PM', disabled: false },
  ];
}

datepickerElement.addEventListener("close.mdb.datepicker", (e) => {
  const selectedDate = datepickerElement.querySelector('input').value;
  if (selectedDate && selectedDate !== '')
    populate_available_times_list(
      get_times(activity, selectedDate)
    );
});

function gen_id() {
  return Math.random().toString(36).substr(2, 9);
}

const get_name = {
  "rr": "White Water River Rafting",
  "atv": "Off-Road ATV",
  "gh": "Guided Hike",
  "f": "Fishing"
}

const get_img = {
  "rr": "/static/white-water-river-rafting.jpg",
  "atv": "/static/atv.jpg",
  "gh": "/static/hikers.jpg",
  "f": "/static/fishing.jpg"
}

const get_pricePerPerson = {
  "rr": 75,
  "atv": 100,
  "gh": 25,
  "f": 40
}

const get_maxPeople = {
  "rr": 4,
  "atv": 8,
  "gh": 15,
  "f": 10
}

document.getElementById("book-btn").addEventListener("click", async () => {
  const selectedTime = availableTimesListElement?.querySelector('.active span')?.textContent;
  const selectedDate = datepickerElement.querySelector('input').value;
  if (!selectedDate || !selectedTime) return;

  const activity_id = activitySelect.value;

  const booking = {
    name: get_name[activity_id],
    id: gen_id(),
    date: selectedDate,
    time: selectedTime,
    img: get_img[activity_id],
    pricePerPerson: get_pricePerPerson[activity_id],
    people: 1,
    discount: 0,
    maxPeople: get_maxPeople[activity_id]
  };

  window.localStorage.setItem("cart", JSON.stringify([booking].concat(JSON.parse(window.localStorage.getItem("cart"))) || [booking]));
  window.location.href = "/cart";
});

const stepper = new mdb.Stepper(get("stepper"), {
  stepperLinear: true
});