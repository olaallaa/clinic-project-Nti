let doctors = [];

fetch("data/doctors.json")
  .then((response) => response.json())
  .then((data) => {
    doctors = data;
  })
  .catch((error) => {
    console.error("Failed to load doctors.", error);
  });

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "login.html";
}

let patientName = document.getElementById("pname");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let service = document.getElementById("service");
let date = document.getElementById("date");
let time = document.getElementById("time");
let doctor = document.getElementById("Doctor");
let notes = document.getElementById("notes");

let bookBtn = document.getElementById("bookBtn");
let updateBtn = document.getElementById("updateBtn");

let currentIndex = 0;

let patientArr = [];

if (localStorage.getItem("appointments")) {
  patientArr = JSON.parse(localStorage.getItem("appointments"));
}

displayAppointment(patientArr);

function bookAppointment() {
  if (!isClinicOpen(date.value)) {
    alert("The clinic is closed on Friday.");

    return;
  }

  if (!isDoctorAvailable()) {
    alert("This doctor is not available on the selected day.");

    return;
  }

  if (!validateAppointment()) {
    alert("This appointment time is already booked.");

    return;
  }

  var patient = {
    id: Date.now(),

    patientId: currentUser.id,

    patientName: patientName.value,

    patientEmail: email.value,

    phone: phone.value,

    service: service.value,

    date: date.value,

    time: time.value,

    doctorName: doctor.value,

    notes: notes.value,

    status: "Upcoming",
  };

  patientArr.push(patient);

  localStorage.setItem("appointments", JSON.stringify(patientArr));

  displayAppointment(patientArr);

  clear();
}
function displayAppointment(arr) {
  const tableBody = document.getElementById("tableBody");

  if (!tableBody) return;

  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
    cartoona += `
<tr>

<td>${arr[i].patientName}</td>

<td>${arr[i].patientEmail}</td>

<td>${arr[i].phone}</td>

<td>${arr[i].service}</td>

<td>${arr[i].date}</td>

<td>${arr[i].time}</td>

<td>${arr[i].doctorName}</td>

<td>${arr[i].notes}</td>

<td>
<button class="btn btn-outline-danger"
onclick="deleteRow(${i})">
Delete
</button>
</td>

<td>
<button class="btn btn-outline-primary"
onclick="updateForm(${i})">
Update
</button>
</td>

</tr>
`;
  }
  tableBody.innerHTML = cartoona;
}

function clear() {
  patientName.value = "";
  email.value = "";
  phone.value = "";
  service.value = "";
  date.value = "";
  time.value = "";
  doctor.value = "";
  notes.value = "";
}

function deleteRow(index) {
  patientArr.splice(index, 1);

  localStorage.setItem("appointments", JSON.stringify(patientArr));

  displayAppointment(patientArr);
}

function updateForm(index) {
  currentIndex = index;

  bookBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");

  patientName.value = patientArr[index].patientName;
  email.value = patientArr[index].patientEmail;
  phone.value = patientArr[index].phone;
  service.value = patientArr[index].service;
  date.value = patientArr[index].date;
  time.value = patientArr[index].time;
  doctor.value = patientArr[index].doctorName;
  notes.value = patientArr[index].notes;
}

function patientUpdate() {
  patientArr[currentIndex] = {
    ...patientArr[currentIndex],

    patientName: patientName.value,
    patientEmail: email.value,
    phone: phone.value,
    service: service.value,
    date: date.value,
    time: time.value,
    doctorName: doctor.value,
    notes: notes.value,
  };

  localStorage.setItem("appointments", JSON.stringify(patientArr));

  displayAppointment(patientArr);

  clear();

  bookBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
}

function validateName() {
  let regex = /^[A-Z][a-z]{2,8}\s[A-Z][a-z]{2,8}$/;

  return regex.test(patientName.value);
}

function validateAppointment() {
  for (let i = 0; i < patientArr.length; i++) {
    if (
      patientArr[i].doctorName === doctor.value &&
      patientArr[i].date === date.value &&
      patientArr[i].time === time.value
    ) {
      return false;
    }
  }

  return true;
}

function isDoctorAvailable() {
  const selectedDoctor = doctors.find(function (doc) {
    return doc.name === doctor.value;
  });

  if (!selectedDoctor) {
    return false;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const selectedDay = days[new Date(date.value).getDay()];

  return selectedDoctor.availableDays.includes(selectedDay);
}

function isClinicOpen(selectedDate) {
  const day = new Date(selectedDate).getDay();
  return day !== 5;
}
