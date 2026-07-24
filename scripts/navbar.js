document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("navbarContainer", "components/navbar.html"),
    loadComponent("footerContainer", "components/footer.html"),
  ]);

  highlightActiveLink();
  renderAuthUI();
  updateFooterYear();
  setupProtectedBookingButtons();
});

async function loadComponent(elementId, filepath) {
  const container = document.getElementById(elementId);

  if (!container) return false;

  try {
    const response = await fetch(filepath);

    if (!response.ok) {
      throw new Error(`Failed to load ${filepath}`);
    }

    container.innerHTML = await response.text();
    return true;
  } catch (error) {
    console.error(`Error loading ${filepath}:`, error);
    return false;
  }
}

function highlightActiveLink() {
  let currentPage = window.location.pathname.split("/").pop();

  if (!currentPage) {
    currentPage = "home.html";
  }

  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    const linkPage = new URL(link.href).pathname.split("/").pop();
    link.classList.toggle("active", linkPage === currentPage);
  });
}

function renderAuthUI() {
  const authContainer = document.getElementById("auth-container");

  if (!authContainer) return;

  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
  } catch (error) {
    console.error("Invalid user data:", error);
    localStorage.removeItem("currentUser");
  }

  if (!currentUser) return;

  const avatar = currentUser.avatar || "images/default-avatar.png";

  const dashboardPage =
    currentUser.role === "doctor"
      ? "doctor-dashboard.html"
      : "patient-dashboard.html";

  authContainer.innerHTML = `
    <div class="user-profile-menu d-flex align-items-center">

      <a href="${dashboardPage}" class="d-flex align-items-center gap-2 text-decoration-none">
        <img
          src="${avatar}"
          alt="${currentUser.name || "User"}"
          class="user-avatar"
        >

        <span class="fw-semibold text-dark d-none d-lg-inline">
          ${currentUser.name || "Account"}
        </span>
      </a>

      <button id="logout-btn" class="btn btn-logout ms-lg-2">
        <i class="fa-solid fa-right-from-bracket me-1"></i>
        Logout
      </button>

    </div>
  `;

  document
    .getElementById("logout-btn")
    ?.addEventListener("click", handleLogout);
}

function handleLogout() {
  localStorage.removeItem("currentUser");
  window.location.href = "home.html";
}

function updateFooterYear() {
  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ===============================
// Protected Booking Buttons
// ===============================

function setupProtectedBookingButtons() {
  const bookingButtons = document.querySelectorAll(".book-btn");

  bookingButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (currentUser) {
        window.location.href = "appointment.html";
      } else {
        window.location.href = "login.html";
      }
    });
  });
}