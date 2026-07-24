document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const togglePassword = document.querySelector("#togglePassword");
  const toggleIcon = document.querySelector("#toggleIcon");


  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    if (toggleIcon) {
      toggleIcon.classList.toggle("fa-eye");
      toggleIcon.classList.toggle("fa-eye-slash");
    }
  });


  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();

    const password = passwordInput.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (user) =>
        user.email.toLowerCase() === email && user.password === password,
    );

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
      });

      return;
    }

    const currentUser = {
      id: user.id,

      role: user.role,

      name: `${user.firstName} ${user.lastName}`,

      email: user.email,

      phone: user.phone,
    };

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    Swal.fire({
      icon: "success",
      title: "Welcome Back!",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      if (user.role === "patient") {
        window.location.href = "patient-dashboard.html";
      } else if (user.role === "doctor") {
        window.location.href = "doctor-dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    }, 1500);
  });
});
