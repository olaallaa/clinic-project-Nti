
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCounter = () => {
            const target = +counter.getAttribute('data');
            const current = +counter.innerText;
            const increment = target / 80;
            if (current < target) {
                counter.innerText = `${Math.ceil(current + increment)}`;
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });

    displayArticles(localArticles);
});

//************************************ */

const localArticles = [
    { 
        title: "How to Brush Correctly", 
        text: "Mastering the right brushing technique is essential for removing plaque and keeping your gums healthy.", 
        image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=500",
        date: "JULY 10, 2026",
    },
    { 
        title: "Causes of Tooth Decay",
        text: "Understand how dietary habits, bacteria, and poor oral hygiene lead to cavities and enamel damage.", 
        image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=500",
        date: "JUNE 28, 2026",
    },
    { 
        title: "Benefits of Dental Floss", 
        text: "Flossing reaches the tight spaces between your teeth that a standard toothbrush completely misses.", 
        image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=500",
        date: "JUNE 15, 2026",
    }
];

function displayArticles(articlesList) {
    const articlesContainer = document.getElementById("articles-content");
    if (!articlesContainer) {
        return;
    }
    
    articlesContainer.innerHTML = '';
    
    articlesList.forEach(article => {
        articlesContainer.innerHTML += `
            <div class="single-card">
                <div class="articles-img">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="articles-content">
                    <span class="blog-date">${article.date}</span>
                    <h3>${article.title}</h3>
                    <p class="articles-content-p">${article.text.substring(0, 90)}...</p>
                    <a href="#" target="_blank">Read More <i class="fa-solid fa-arrow-right-long"></i></a>
                </div>
            </div>
        `;
    });
}




//********************************* */
let scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

