const servicesData = [
  {
    "id": 1,
    "name": "Dental Checkup & Cleaning",
    "price": 300,
    "duration": "30 Minutes",
    "description": "Professional cleaning to remove plaque and tartar.",
    "image": "images/services/cleaning.jpg"
  },
  {
    "id": 2,
    "name": "Teeth Whitening",
    "price": 450,
    "duration": "45 Minutes",
    "description": "Advanced laser whitening treatment for a bright smile.",
    "image": "images/services/whitening.jpg"
  },
  {
    "id": 3,
    "name": "Dental Fillings",
    "price": 250,
    "duration": "40 Minutes",
    "description": "Tooth-colored composite restoration to repair cavities.",
    "image": "images/services/filling.jpg"
  },
  {
    "id": 4,
    "name": "Root Canal Treatment",
    "price": 850,
    "duration": "75 Minutes",
    "description": "Painless endodontic therapy to save natural teeth.",
    "image": "images/services/root_canal.jpg"
  },
  {
    "id": 5,
    "name": "Tooth Extraction",
    "price": 200,
    "duration": "35 Minutes",
    "description": "Gentle and comfortable removal of damaged teeth.",
    "image": "images/services/extraction.jpg"
  },
  {
    "id": 6,
    "name": "Dental Implants",
    "price": 1200,
    "duration": "90 Minutes",
    "description": "Permanent titanium tooth replacement fixture with crown.",
    "image": "images/services/implant.jpg"
  },
  {
    "id": 7,
    "name": "Orthodontics",
    "price": 150,
    "duration": "45 Minutes",
    "description": "Comprehensive orthodontic assessment & 3D scan.",
    "image": "images/services/braces.jpg"
  }
];

let currentServices = [...servicesData];

document.addEventListener('DOMContentLoaded', () => {
  loadServicesData();
});

async function loadServicesData() {
  try {
    const response = await fetch('services.json');
    if (response.ok) {
      const data = await response.json();
      currentServices = data;
    }
  } catch (error) {
    currentServices = servicesData;
  }
  
  renderCards(currentServices);
}

function renderCards(servicesList) {
  const container = document.getElementById('services-grid');
  
  if (!container) return;

  if (servicesList.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">No services found</h4>
      </div>
    `;
    return;
  }

  container.innerHTML = servicesList.map(service => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card Card h-100 shadow-sm">
        
        <div class="card-img-container">
          <img src="${service.image}" class="card-img-top" alt="${service.name}">
          <span class="price-badge">$${service.price}</span>
        </div>

        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold text-dark">${service.name}</h5>
          
          <p class="card-text text-muted flex-grow-1 fs-6">
            ${service.description}
          </p>

          <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span class="badge bg-light text-dark border">
              <i class="far fa-clock text-primary me-1"></i> ${service.duration}
            </span>
            
            <button class="btn btn-primary book-btn">
                Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  `).join('');
} 
setupBookButtons();
function setupBookButtons() {
    const buttons = document.querySelectorAll(".book-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {

            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (currentUser) {
                window.location.href = "appointment.html";
            } else {
                window.location.href = "login.html";
            }

        });
    });
}
