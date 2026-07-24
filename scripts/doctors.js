let doctors = [];

let searchInput = document.getElementById("searchInput");

let specializationFilter = document.getElementById("specializationFilter");

let sortDoctors = document.getElementById("sortDoctors");

let doctorList = document.getElementById("doctorList");

let doctorCount = document.getElementById("doctorCount");

let averageRating = document.getElementById("avgRatingText");

let loadingState = document.getElementById("loadingState");

let emptyState = document.getElementById("emptyState");

function showLoading () {
  if (elements.loadingState) {
    elements.loadingState.classList.remove("d-none");
  }

  if (elements.doctorList) {
    elements.doctorList.classList.add("d-none");
  }

  if (elements.emptyState) {
    elements.emptyState.classList.add("d-none");
  }
}

const hideLoading = () => {
  if (elements.loadingState) {
    elements.loadingState.classList.add("d-none");
  }
};

const showEmptyState = () => {
  if (elements.emptyState) {
    elements.emptyState.classList.remove("d-none");
  }

  if (elements.doctorList) {
    elements.doctorList.classList.add("d-none");
  }
};

const showDoctors = () => {
  if (elements.emptyState) {
    elements.emptyState.classList.add("d-none");
  }

  if (elements.doctorList) {
    elements.doctorList.classList.remove("d-none");
  }
};

const updateStatistics = (doctorList) => {
  if (elements.doctorCount) {
    elements.doctorCount.textContent = `${doctorList.length} Doctor${doctorList.length !== 1 ? "s" : ""} Found`;
  }

  if (!doctorList.length) {
    if (elements.averageRating) {
      elements.averageRating.textContent = "";
    }

    return;
  }

  let totalRating=0;

for(let i=0;i<doctorList.length;i++){

totalRating+=doctorList[i].rating;

}

let average=(totalRating/doctorList.length).toFixed(1);

  const average = (totalRating / doctorList.length).toFixed(1);

  if (elements.averageRating) {
    elements.averageRating.textContent = `Average Rating ⭐ ${average}`;
  }
};

const fetchDoctors = async () => {
  showLoading();

  try {
    const response = await fetch("./data/doctors.json");

    if (!response.ok) {
      throw new Error(`Status: ${response.status}`);
    }

    doctors = await response.json();

    applyFilters();
  } catch (error) {
    console.error("Doctors loading error:", error);

    if (elements.loadingState) {
      elements.loadingState.innerHTML = `

                <div class="alert alert-danger">

                    Failed to load doctors data.

                </div>

            `;

      elements.loadingState.classList.remove("d-none");
    }
  } finally {
    hideLoading();
  }
};

const filterDoctors = () => {
  let searchValue = "";

  let specialization = "";

  if (elements.searchInput) {
    searchValue = elements.searchInput.value.trim().toLowerCase();
  }

  if (elements.specializationFilter) {
    specialization = elements.specializationFilter.value;
  }

  return doctors.filter((doctor) => {
    const name = doctor.name ? doctor.name.toLowerCase() : "";

    const matchesName = name.includes(searchValue);

    const matchesSpecialization =
      !specialization || doctor.specialization === specialization;

    return matchesName && matchesSpecialization;
  });
};

const sortDoctorList = (doctorList) => {
  const sortedDoctors = [...doctorList];

  let sortValue = "default";

  if (elements.sortDoctors) {
    sortValue = elements.sortDoctors.value;
  }

  if (sortValue === "rating-desc") {
    sortedDoctors.sort((a, b) => {
      return Number(b.rating) - Number(a.rating);
    });
  } else if (sortValue === "exp-desc") {
    sortedDoctors.sort((a, b) => {
      return Number(b.experience) - Number(a.experience);
    });
  } else {
    sortedDoctors.sort((a, b) => {
      return a.id - b.id;
    });
  }

  return sortedDoctors;
};

const createDoctorCard = (doctor) => {
  const { id, name, specialization, rating, experience, biography, image } =
    doctor;

  return `


    <div class="col-md-6 col-lg-4">


        <article class="card h-100 shadow-sm border-0 doctor-card">


            <div class="card-body text-center">


                <img
                    src="${image || "images/default-avatar.png"}"
                    alt="Photo of ${name}"
                    class="doctor-img rounded-circle mb-3"
                    width="120"
                    height="120"
                    loading="lazy">



                <h3 class="h5 fw-bold">

                    ${name}

                </h3>




                <p class="text-primary fw-semibold">

                    ${specialization}

                </p>





                <p class="text-muted small">

                    ${biography || "No biography available."}

                </p>





               <div class="d-flex justify-content-center gap-3 mb-3">


                <span>
                    <i class="fa-solid fa-star text-warning me-1"
                    aria-hidden="true"></i>

                    ${rating}
                </span>



                <span>
                    <i class="fa-solid fa-briefcase text-primary me-1"
                    aria-hidden="true"></i>

                    ${experience} Years
                </span>



                </div>





                <div class="d-flex flex-column gap-2">



                    <a
                      href="doctor-profile.html?id=${id}"
                      class="btn btn-outline-primary">


                        View Profile


                    </a>





                    <button class="btn btn-primary book-btn">
                        Book Appointment
                    </button>




                </div>



            </div>


        </article>


    </div>


    `;
};

const renderDoctors = (doctorList) => {
  updateStatistics(doctorList);

  if (!doctorList.length) {
    showEmptyState();

    if (elements.doctorList) {
      elements.doctorList.innerHTML = "";
    }

    return;
  }

  showDoctors();

  if (elements.doctorList) {
    elements.doctorList.innerHTML = doctorList.map(createDoctorCard).join("");
  }
};

const applyFilters = () => {
  const filtered = filterDoctors();

  const sorted = sortDoctorList(filtered);

  renderDoctors(sorted);
};

const setupEventListeners = () => {
  if (elements.searchInput) {
    elements.searchInput.addEventListener("input", applyFilters);
  }

  if (elements.specializationFilter) {
    elements.specializationFilter.addEventListener("change", applyFilters);
  }

  if (elements.sortDoctors) {
    elements.sortDoctors.addEventListener("change", applyFilters);
  }
};

const init = async () => {
  setupEventListeners();

  await fetchDoctors();
};

document.addEventListener("DOMContentLoaded", init);
