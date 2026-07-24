document.addEventListener("DOMContentLoaded", startPage);

let medicineSearchForm = document.getElementById("medicineSearchForm");
let medicineQuery = document.getElementById("medicineQuery");
let medicineResultsContainer = document.getElementById("medicineResultsContainer");

function startPage() {

    if (!medicineSearchForm) {
        return;
    }

    medicineSearchForm.addEventListener("submit", searchMedicine);
}

async function searchMedicine(e) {

    e.preventDefault();

    let query = medicineQuery.value.trim();

    if (query == "") {
        return;
    }

    medicineResultsContainer.innerHTML = `

    <div class="text-center py-5 bg-white rounded shadow-sm">

        <div class="spinner-border text-primary"></div>

        <p class="mt-2">
            Searching...
        </p>

    </div>

    `;

    let response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${query}"+openfda.brand_name:"${query}"&limit=3`
    );

    if (response.status == 404) {

        medicineResultsContainer.innerHTML = `

        <div class="alert alert-warning text-center">

            <h5>No Medicine Found</h5>

            <p>Try another medicine name.</p>

        </div>

        `;

        return;
    }

    let data = await response.json();

    displayMedicine(data.results);

    medicineQuery.blur();
}

function displayMedicine(drugs) {

    if (drugs.length == 0) {

        medicineResultsContainer.innerHTML =
            "<div class='alert alert-warning'>No Results Found</div>";

        return;
    }

    let cartoona = "";

    for (let i = 0; i < drugs.length; i++) {

        let drug = drugs[i];

        let genericName = "N/A";

        if (drug.openfda && drug.openfda.generic_name) {
            genericName = drug.openfda.generic_name.join(", ");
        }

        let brandName = "N/A";

        if (drug.openfda && drug.openfda.brand_name) {
            brandName = drug.openfda.brand_name.join(", ");
        }

        let purpose = "No Purpose";

        if (drug.purpose) {
            purpose = drug.purpose.join(" ");
        }
        else if (drug.indications_and_usage) {
            purpose = drug.indications_and_usage.join(" ");
        }

        let warnings = "No Warnings";

        if (drug.warnings) {
            warnings = drug.warnings.join(" ");
        }

        let sideEffects = "No Side Effects";

        if (drug.adverse_reactions) {
            sideEffects = drug.adverse_reactions.join(" ");
        }

        cartoona += `

        <div class="card border-0 shadow-sm p-4 mb-4">

            <h4 class="fw-bold mb-3">

                ${brandName}

            </h4>

            <p>

                <strong>Generic Name:</strong>

                ${genericName}

            </p>

            <p>

                <strong>Purpose:</strong>

                ${shortText(purpose)}

            </p>

            <p>

                <strong>Warnings:</strong>

                ${shortText(warnings)}

            </p>

            <p>

                <strong>Side Effects:</strong>

                ${shortText(sideEffects)}

            </p>

        </div>

        `;
    }

    medicineResultsContainer.innerHTML = cartoona;
}

function shortText(text) {

    if (!text) {
        return "N/A";
    }

    if (text.length > 400) {
        return text.substring(0, 400) + "...";
    }

    return text;
}
