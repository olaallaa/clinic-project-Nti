document.addEventListener("DOMContentLoaded", () => {
  const medicineSearchForm = document.getElementById("medicineSearchForm");
  const medicineQueryInput = document.getElementById("medicineQuery");
  const resultsContainer = document.getElementById("medicineResultsContainer");

  if (!medicineSearchForm) return;

  medicineSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = medicineQueryInput.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = `
      <div class="text-center py-5 bg-white rounded shadow-sm">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Searching OpenFDA database for "${query}"...</p>
      </div>`;

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(query)}"+openfda.brand_name:"${encodeURIComponent(query)}"+description:"${encodeURIComponent(query)}"&limit=3`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          resultsContainer.innerHTML = `
            <div class="alert alert-warning text-center p-4">
              <i class="fa-solid fa-triangle-exclamation fa-2x mb-2 text-warning"></i>
              <h5>No Medicine Found</h5>
              <p class="mb-0">No drug records matched "${query}". Please check the spelling or try searching another term like <em>Amoxicillin</em> or <em>Ibuprofen</em>.</p>
            </div>`;
          return;
        }
        throw new Error("FDA API error");
      }

      const data = await response.json();
      renderMedicineResults(data.results);
      medicineQueryInput.blur();
    } catch (error) {
      console.error("OpenFDA Fetch Error:", error);
      resultsContainer.innerHTML = `
        <div class="alert alert-danger text-center p-4">
          <i class="fa-solid fa-circle-exclamation fa-2x mb-2 text-danger"></i>
          <h5>Failed to Retrieve Drug Information</h5>
          <p class="mb-0">Unable to connect to OpenFDA API. Please check your network connection and try again.</p>
        </div>`;
    }
  });

  function renderMedicineResults(drugs) {
    if (drugs.length === 0) {
      resultsContainer.innerHTML =
        '<div class="alert alert-warning">No Results Found</div>';

      return;
    }
    const html = drugs
      .map((drug, index) => {
        const openfda = drug.openfda || {};

        const genericName = openfda.generic_name
          ? openfda.generic_name.join(", ")
          : "N/A";

        const brandName = openfda.brand_name
          ? openfda.brand_name.join(", ")
          : "Generic or N/A";

        const purpose = drug.purpose
          ? drug.purpose.join(" ")
          : drug.indications_and_usage
            ? drug.indications_and_usage.join(" ")
            : "Purpose details not explicitly provided.";

        const warnings = drug.warnings
          ? drug.warnings.join(" ")
          : "No specific warnings listed.";

        const sideEffects = drug.adverse_reactions
          ? drug.adverse_reactions.join(" ")
          : "No specific adverse reaction details provided.";

        return `
        <div class="card border-0 shadow-sm p-4 mb-4">
          <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
            <div>
              <span class="badge bg-primary mb-1">Drug Record #${index + 1}</span>
              <h4 class="fw-bold text-dark mb-0">${brandName}</h4>
            </div>
            <span class="badge bg-light text-secondary border">FDA Label Record</span>
          </div>

          <div class="row g-3">
            <!-- Generic Name -->
            <div class="col-md-6">
              <div class="p-3 bg-light rounded h-100">
                <h6 class="fw-bold text-primary mb-1"><i class="fa-solid fa-vial me-2"></i>Generic Name</h6>
                <p class="mb-0 text-dark font-monospace">${genericName}</p>
              </div>
            </div>

            <!-- Brand Name -->
            <div class="col-md-6">
              <div class="p-3 bg-light rounded h-100">
                <h6 class="fw-bold text-primary mb-1"><i class="fa-solid fa-prescription-bottle-medical me-2"></i>Brand Name(s)</h6>
                <p class="mb-0 text-dark fw-semibold">${brandName}</p>
              </div>
            </div>

            <!-- Purpose -->
            <div class="col-12">
              <div class="p-3 bg-light rounded">
                <h6 class="fw-bold text-dark mb-1"><i class="fa-solid fa-bullseye text-success me-2"></i>Purpose & Indications</h6>
                <p class="text-muted small mb-0 leading-relaxed">${truncateText(purpose, 400)}</p>
              </div>
            </div>

            <!-- Warnings -->
            <div class="col-12">
              <div class="p-3 bg-warning-subtle rounded border border-warning">
                <h6 class="fw-bold text-dark mb-1"><i class="fa-solid fa-triangle-exclamation text-warning me-2"></i>Warnings</h6>
                <p class="text-dark small mb-0 leading-relaxed">${truncateText(warnings, 400)}</p>
              </div>
            </div>

            <!-- Side Effects -->
            <div class="col-12">
              <div class="p-3 bg-danger-subtle rounded border border-danger-subtle">
                <h6 class="fw-bold text-danger mb-1"><i class="fa-solid fa-notes-medical me-2"></i>Side Effects & Adverse Reactions</h6>
                <p class="text-dark small mb-0 leading-relaxed">${truncateText(sideEffects, 400)}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    resultsContainer.innerHTML = html;
  }

  function truncateText(text, maxLength) {
    if (!text) return "N/A";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }
});
