let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;

document.addEventListener("DOMContentLoaded", () => {
    updateCartDisplay();
});

function addToCart() {
    cartCount++;

    localStorage.setItem("cartCount", cartCount);

    updateCartDisplay();

    showSuccessMessage();
}

function updateCartDisplay() {
    const cartCountEl = document.getElementById("cartCount");

    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
    }
}

function showSuccessMessage() {
    const msg = document.getElementById("successMsg");

    if (msg) {
        msg.classList.remove("d-none");

        setTimeout(() => {
            msg.classList.add("d-none");
        }, 1500);
    }
}