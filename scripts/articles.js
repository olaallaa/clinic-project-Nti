const articleContainer = document.getElementById("articlesContainer");
const searchInput = document.getElementById("srch");
const categoryLinks = document.querySelectorAll(".categories li");

let articles = [];

async function getArticles() {
    const response = await fetch("data/articles.json");
    const articlesData = await response.json();
    //console.log(articlesData);

    return articlesData;
}

async function startApp() {
    const articlesData = await getArticles();
    articles = articlesData.articles;
    display(articles);

}

startApp();

function display(data) {
    let cartona = ``;
    for (let i = 0; i < data.length; i++) {
        cartona += `<div class="col-lg-4 col-md-6">
            <div class="article-card">
                <div class="article-img">
                    <img src="${data[i].image}"
                    class="w-100"
                    alt="${data[i].title}"
                    onerror="this.src='https://i.pinimg.com/236x/87/92/9f/87929ff34cd193dc92625af08e344f36.jpg'">
                </div>
                <div class="article-content">
                    <span>${data[i].category}</span>
                    <h3>${data[i].title}</h3>
                    <p>${data[i].description}</p>
                    <a href="${data[i].url}" target="_blank">Read More</a>
                </div>
            </div>
        </div>`;
    }

    articleContainer.innerHTML = cartona;
}

function searchArticles(name) {
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(name.toLowerCase()) ||
        article.category.toLowerCase().includes(name.toLowerCase()) ||
        article.description.toLowerCase().includes(name.toLowerCase())
    );

    display(filteredArticles);
}
searchInput.addEventListener("input", function () {
    if (searchInput.value.trim() == "") {
        display(articles);
    }
    else {
        searchArticles(searchInput.value);
    }
});

for (let i = 0; i < categoryLinks.length; i++) {
    categoryLinks[i].addEventListener("click", function () {
        for (let j = 0; j < categoryLinks.length; j++) {
            categoryLinks[j].classList.remove("active");
        }

        this.classList.add("active");
        const category = this.getAttribute("category");
        if (category == "All") {
            display(articles);
        }
        else {
            const filteredArticles = articles.filter(article =>
                article.category.toLowerCase() === category.toLowerCase()
            );
            display(filteredArticles);
        }
    });
}
