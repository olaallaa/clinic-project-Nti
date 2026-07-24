

const form = document.getElementById("registerForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");



document.addEventListener("DOMContentLoaded", initializePage);

function initializePage() {
  if (!form) {
    return;
  }

  form.addEventListener("submit", registerUser);
}

function registerUser(event) {
  event.preventDefault();

  const first = firstName.value.trim();

  const last = lastName.value.trim();

  const userEmail = email.value.trim().toLowerCase();

  const userPhone = phone.value.trim();

  const userPassword = password.value.trim();

  const confirm = confirmPassword.value.trim();

  if (
    first === "" ||
    last === "" ||
    userEmail === "" ||
    userPhone === "" ||
    userPassword === "" ||
    confirm === ""
  ) {
    alert("Please fill all fields.");

    return;
  }

  if (userPassword.length < 8) {
    alert("Password must be at least 8 characters.");

    return;
  }

  if (userPassword !== confirm) {
    alert("Passwords do not match.");

    return;
  }

  let users = [];

  try {
    users = JSON.parse(localStorage.getItem("users"));

    if (!users) {
      users = [];
    }
  } catch (error) {
    users = [];
  }

  const emailExists = users.some(function (user) {
    return user.email.toLowerCase() === userEmail;
  });

  if (emailExists) {
    alert("Email already exists.");

    return;
  }

  let newUser = {
    id: Date.now(),

    role: "patient",

    firstName: first,

    lastName: last,

    name: `${first} ${last}`,

    email: userEmail,

    phone: userPhone,

    password: userPassword,

    avatar: "images/default-avatar.png",
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully.");

  window.location.href = "login.html";

  window.location.href = "patient-dashboard.html";
}

