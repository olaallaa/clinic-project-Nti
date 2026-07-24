const profileContainer = document.getElementById("profileContainer");

let doctors = [];

let selectedDoctor = null;

document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {

    await Promise.all([

        loadComponent(
            "navbarContainer",
            "components/navbar.html"
        ),

        loadComponent(
            "footerContainer",
            "components/footer.html"
        )

    ]);

    // لازم يكونوا هنا مباشرة
    highlightActiveLink();
    renderAuthUI();
    updateFooterYear();

    const doctorId = getDoctorId();

    if (doctorId === null) {
        showInvalidDoctor();
        return;
    }

    doctors = await fetchDoctors();

    selectedDoctor = findDoctorById(doctorId);

    if (!selectedDoctor) {
        showDoctorNotFound();
        return;
    }

    renderDoctorProfile(selectedDoctor);

    initializeBookButton();
}

function getDoctorId() {
  const params = new URLSearchParams(window.location.search);

  const value = params.get("id");

  if (!value) {
    return null;
  }

  const id = Number(value);

  if (isNaN(id)) {
    return null;
  }

  return id;
}

async function fetchDoctors() {
  try {
    const response = await fetch("./data/doctors.json");

    if (!response.ok) {
      throw new Error("Failed to load doctors");
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    showLoadError();

    return [];
  }
}

function findDoctorById(id) {
  return doctors.find((doctor) => doctor.id === id);
}

function renderDoctorProfile(doctor) {
  const image = doctor.image || "images/default-avatar.png";

  let qualifications = "<li>No qualifications available</li>";

  if (Array.isArray(doctor.qualifications) && doctor.qualifications.length) {
    qualifications = doctor.qualifications
      .map((item) => {
        return `

                <li class="mb-2">

                    <i class="fa-solid fa-award text-primary me-2"></i>

                    ${item}

                </li>

                `;
      })
      .join("");
  }

  let certificates = "<li>No certificates available</li>";

  if (Array.isArray(doctor.certificates) && doctor.certificates.length) {
    certificates = doctor.certificates
      .map((item) => {
        return `

                <li class="mb-2">

                    <i class="fa-solid fa-certificate text-success me-2"></i>

                    ${item}

                </li>

                `;
      })
      .join("");
  }

  let gallery = "";

  if (
    Array.isArray(doctor.beforeAfterImages) &&
    doctor.beforeAfterImages.length
  ) {
    gallery = doctor.beforeAfterImages
      .map((image) => {
        return `

                <div class="col-md-6">

                    <img
                        src="${image}"
                        class="before-after-img rounded shadow-sm"
                        alt="Before and After dental case">

                </div>

                `;
      })
      .join("");
  }

  profileContainer.innerHTML = `



<div class="row g-4">



<!-- Doctor Main Info -->

<div class="col-lg-4">


<div class="profile-card text-center">


<img

src="${image}"

alt="Photo of ${doctor.name}"

class="doctor-profile-img rounded-circle mb-3">





<h3 class="profile-name fw-bold">

${doctor.name}

</h3>





<p class="profile-specialization">

${doctor.specialization}

</p>







<div class="d-flex justify-content-center gap-4 mb-4">



<span>

<i class="fa-solid fa-star text-warning me-1"></i>

${doctor.rating}

</span>




<span>

<i class="fa-solid fa-user-doctor text-primary me-1"></i>

${doctor.experience} Years

</span>



</div>






<div class="profile-info mb-3">


<p>

<i class="fa-solid fa-calendar-days me-2"></i>

<strong>
Working Days
</strong>

<br>

${doctor.availableDays || "Not Available"}

</p>




<p class="mb-0">

<i class="fa-solid fa-clock me-2"></i>

<strong>
Working Hours
</strong>

<br>

${doctor.workingHours || "Not Available"}

</p>



</div>





<button

id="bookAppointmentBtn"

class="btn btn-primary book-btn w-100">


Book Appointment


</button>



</div>


</div>









<!-- Details -->

<div class="col-lg-8">






<div class="profile-card mb-4">



<h4 class="section-title">

Biography

</h4>




<p class="text-muted">

${doctor.biography || "No biography available."}

</p>



</div>









<div class="row g-4">





<div class="col-md-6">


<div class="profile-card h-100">


<h4 class="section-title">

Qualifications

</h4>


<ul class="list-unstyled qualification-list">

${qualifications}

</ul>



</div>


</div>









<div class="col-md-6">


<div class="profile-card h-100">


<h4 class="section-title">

Certificates

</h4>



<ul class="list-unstyled qualification-list">

${certificates}

</ul>



</div>


</div>






</div>









${
  gallery
    ? `

<div class="profile-card mt-4">


<h4 class="section-title">

Before / After Cases

</h4>



<div class="row g-3">

${gallery}

</div>


</div>

`
    : ""
}





</div>



</div>



`;
}

function initializeBookButton() {
  const button = document.getElementById("bookAppointmentBtn");

  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    window.location.href = "appointment.html";
  });
}

function showInvalidDoctor() {
  profileContainer.innerHTML = `


<div class="alert alert-danger text-center">


<h4>
Invalid Doctor ID
</h4>



<a href="doctors.html"
class="btn btn-primary">

Back To Doctors

</a>


</div>


`;
}

function showDoctorNotFound() {
  profileContainer.innerHTML = `


<div class="alert alert-warning text-center">


<h4>
Doctor Not Found
</h4>



<a href="doctors.html"
class="btn btn-primary">

Back To Doctors

</a>


</div>


`;
}

function showLoadError() {
  profileContainer.innerHTML = `


<div class="alert alert-danger text-center">


<h4>
Unable To Load Doctors Data
</h4>


</div>


`;
}


