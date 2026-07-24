const userName = document.getElementById("un");
const userEmail = document.getElementById("em");
const userPhone = document.getElementById("up");
const userSubject = document.getElementById("us");
const userMessage = document.getElementById("um");
const contactForm = document.getElementById("contactForm");
const clinicStatus = document.getElementById("clinicStatus");

let messagesContainer = [];
//Save Data in Local storage
if (localStorage.getItem("Messages") != null) {
    messagesContainer = JSON.parse(localStorage.getItem("Messages"));
}


function addMessage() {

    if (
        validateName() &&
        validateEmail() &&
        validatePhone() &&
        validateSubject() &&
        validateMessage()
    ) {
        const message = {
            name: userName.value.trim(),
            email: userEmail.value.trim(),
            phone: userPhone.value.trim(),
            subject: userSubject.value.trim(),
            message: userMessage.value.trim()
        };
        messagesContainer.push(message);
        //Save Data in Local storage
        localStorage.setItem("Messages", JSON.stringify(messagesContainer));
        //console.log(messagesContainer);
        //console.log(localStorage.getItem("Messages"));

        clearInput();

        Swal.fire({
            icon: "success",
            title: "Message Sent!",
            text: "Thank you for contacting us. We'll get back to you soon.",
            confirmButtonColor: "#293681"
        })
    }
    else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all required fields correctly.",
            confirmButtonColor: "#293681"
        })
    }
}

//Clear Inputs after each entry

function clearInput() {
    userName.value = "";
    userEmail.value = "";
    userPhone.value = "";
    userSubject.value = "";
    userMessage.value = "";


    userName.classList.remove("is-valid");
    userEmail.classList.remove("is-valid");
    userPhone.classList.remove("is-valid");
    userSubject.classList.remove("is-valid");
    userMessage.classList.remove("is-valid");

}

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addMessage();
});

function validateName() {
    const regex = /^[A-Za-z][a-zA-Z\s]{2,29}$/;
    if (regex.test(userName.value.trim())) {
        userName.classList.remove("is-invalid");
        userName.classList.add("is-valid");
        return true;
    }
    else {
        userName.classList.remove("is-valid");
        userName.classList.add("is-invalid");
        return false;
    }
}

function validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(userEmail.value.trim())) {
        userEmail.classList.remove("is-invalid");
        userEmail.classList.add("is-valid");
        return true;
    }
    else {
        userEmail.classList.remove("is-valid");
        userEmail.classList.add("is-invalid");
        return false;
    }
}

function validatePhone() {
    const regex = /^01[0125][0-9]{8}$/;
    if (regex.test(userPhone.value.trim())) {
        userPhone.classList.remove("is-invalid");
        userPhone.classList.add("is-valid");
        return true;
    }
    else {
        userPhone.classList.remove("is-valid");
        userPhone.classList.add("is-invalid");
        return false;
    }
}

function validateSubject() {
    const regex = /^.{3,50}$/;
    if (regex.test(userSubject.value.trim())) {
        userSubject.classList.remove("is-invalid");
        userSubject.classList.add("is-valid");
        return true;
    }
    else {
        userSubject.classList.remove("is-valid");
        userSubject.classList.add("is-invalid");
        return false;
    }
}

function validateMessage() {
    const regex = /^.{10,500}$/;
    if (regex.test(userMessage.value.trim())) {
        userMessage.classList.remove("is-invalid");
        userMessage.classList.add("is-valid");
        return true;
    }
    else {
        userMessage.classList.remove("is-valid");
        userMessage.classList.add("is-invalid");
        return false;
    }
}

// Clinic Status


function workingHours() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();//for  Days
    const currnetHours = currentDate.getHours();//for Hours

    if (currentDay === 5) {
        clinicStatus.innerHTML = "Closed Today";
        clinicStatus.classList.remove("bg-success");
        clinicStatus.classList.remove("bg-danger");
        clinicStatus.classList.add("bg-warning");
        return;


    }
    else if (currnetHours >= 9 && currnetHours < 20) {
        clinicStatus.innerHTML = "Open Now";
        clinicStatus.classList.remove("bg-danger");
        clinicStatus.classList.add("bg-success");
    }
    else {
        clinicStatus.innerHTML = "Closed Now";
        clinicStatus.classList.remove("bg-success");
        clinicStatus.classList.add("bg-danger");
    }
}

workingHours();
