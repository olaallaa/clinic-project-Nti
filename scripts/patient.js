document.addEventListener("DOMContentLoaded", init);

function init() {

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || currentUser.role != "patient") {
    window.location.href = "login.html";
    return;
  }

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  renderProfile(currentUser);
  renderAppointments(currentUser, appointments);
  attachEvents(currentUser);
}

function renderProfile(user) {
  let name = "Patient";

  if (user.name) {
    name = user.name;
  } else if (user.firstName || user.lastName) {
    name = ((user.firstName || "") + " " + (user.lastName || "")).trim();
  }

  const greeting = document.getElementById("dashGreetingName");

  if (greeting) {
    greeting.textContent = name;
  }

  const patientName = document.getElementById("cardPatientName");

  if (patientName) {
    patientName.textContent = name;
  }

  const email = document.getElementById("cardPatientEmail");

  if (email) {
    email.textContent = user.email || "patient@email.com";
  }

  const phone = document.getElementById("cardPatientPhone");

  if (phone) {
    phone.textContent = user.phone || "+20 100 000 0000";
  }

  const avatar = document.getElementById("cardPatientImage");

  if (avatar) {
    avatar.src = user.image || "images/default-avatar.png";
  }
}

function renderAppointments(user, appointments) {
  const container = document.getElementById("dashAppointmentsList");

  if (!container) {
    return;
  }

  const userAppointments = appointments.filter(function (appointment) {
    return appointment.patientId === user.id;
  });

  const count = document.getElementById("appointmentCount");

  if (count) {
    count.textContent = userAppointments.length;
  }

  if (userAppointments.length === 0) {
    container.innerHTML = `

        <div class="text-center py-4">

            <i class="fa-regular fa-calendar-xmark fa-2x text-secondary mb-3"></i>

            <h6 class="fw-bold">

                No Upcoming Appointments

            </h6>

            <p class="text-muted small">

                You don't have any appointments yet.

            </p>

        </div>

        `;

    return;
  }

  userAppointments.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  
  let cartona = "";

for (let i = 0; i < userAppointments.length; i++) {

  cartona += createAppointmentCard(userAppointments[i]);

}

container.innerHTML = cartona;
}

function createAppointmentCard(app) {
  return `

<div class="card border-0 shadow-sm rounded-4 p-3">

<div class="d-flex justify-content-between">

<div>

<h6 class="fw-bold mb-1">

${app.doctorName || "Doctor"}

</h6>

<p class="small text-muted mb-1">

<i class="fa-regular fa-calendar text-primary me-1"></i>

${app.date || "N/A"}

</p>

<p class="small text-muted mb-0">

<i class="fa-regular fa-clock text-primary me-1"></i>

${app.time || "N/A"}

</p>

</div>



</div>

${
  app.status === "Upcoming"
    ? `

<button
class="btn btn-outline-danger btn-sm mt-3 cancel-btn"
data-id="${app.id}">

Cancel Appointment

</button>

`
    : ""
}

</div>

`;
}

function attachEvents(user) {
  const container = document.getElementById("dashAppointmentsList");

  if (!container) {
    return;
  }

  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("cancel-btn")) {

    cancelAppointment(Number(event.target.dataset.id), user);

    }
    if (!button) {
      return;
    }

    cancelAppointment(Number(button.dataset.id), user);
  });
}

function cancelAppointment(id, user) {
  let appointments = [];

  try {
    const storedAppointments = localStorage.getItem("appointments");

    if (storedAppointments) {
      appointments = JSON.parse(storedAppointments);
    }
  } catch (error) {
    console.error("Failed to load appointments", error);
    return;
  }

  appointments = appointments.filter(function (appointment) {
    return appointment.id !== id;
  });

  localStorage.setItem("appointments", JSON.stringify(appointments));

  renderAppointments(user, appointments);
}

