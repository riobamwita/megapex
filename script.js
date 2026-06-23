let properties = [];
let updateViewMore = null;
let filterActive = false;

document.addEventListener("DOMContentLoaded", async () => {

    setupOffers();
    setupSlideshow();

    await loadProperties();
    
    setupDynamicPropertyFilters();

    setupPropertySearch();
    setupViewMore();
     
    restoreFilters();
    restoreSelectedProperty();

});

async function loadProperties() {

try {

    const response = await fetch("properties.json");
    properties = await response.json();

    populatePropertyFilters();

    renderProperties();

} catch (error) {

    console.error("Error loading properties:", error);

}

}

function renderProperties() {

    const grid = document.getElementById("propertiesGrid");

    if (!grid) return;

    grid.innerHTML = "";

    properties.forEach(property => {

        const card = document.createElement("a");

        card.href = `property.html?id=${property.id}`;
        card.className = "property-card";

        card.dataset.id = property.id;
        card.dataset.type = property.type;
        card.dataset.location = property.location;
        card.dataset.deal = property.deal || "";
        card.dataset.bedrooms = property.bedrooms || "";
        card.dataset.size = property.size || "";

        card.addEventListener("click", () => {

        sessionStorage.setItem(
        "selectedProperty",
        property.id
    );

});

        card.innerHTML = `
            <img src="${property.thumbnail}" alt="${property.title}">
            <div class="property-info">
                <h3>${property.shortTitle}</h3>
                <p>${property.location}</p>
                <small>${property.type}</small><br>
                <span>${property.formattedPrice}</span>
            </div>
        `;

        grid.appendChild(card);

    });

    if (typeof updateViewMore === "function") {
        updateViewMore();
    }

}

function populatePropertyFilters() {

fillSelect(
    "propertyTypeFilter",
    [...new Set(properties.map(p => p.type))]
);

fillSelect(
    "propertyLocationFilter",
    [...new Set(properties.map(p => p.location))]
);

fillSelect(
    "propertyDealFilter",
    [...new Set(properties.map(p => p.deal))]
);

fillSelect(
    "propertyBedroomsFilter",
    [...new Set(
        properties
            .filter(p => p.bedrooms)
            .map(p => p.bedrooms)
    )]
);

fillSelect(
    "propertySizeFilter",
    [...new Set(
        properties
            .filter(p => p.size)
            .map(p => p.size)
    )]
);

}

function fillSelect(id, values) {

    const select = document.getElementById(id);

    if (!select) return;

    const firstOption = select.options[0];

    select.innerHTML = "";

    select.appendChild(firstOption);

    values.forEach(value => {

        const option = document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);

    });

}

function resetCards() {

    document
        .querySelectorAll(".property-card")
        .forEach(card => {

            card.style.display = "";
            card.classList.remove("hidden");

        });

}

clearBtn.addEventListener("click", () => {

    filterActive = false;

    document
        .querySelectorAll(".search-box select")
        .forEach(select => {

            select.value = "";

        });

    resetCards();

    toggleNoResults(true);

    if (typeof updateViewMore === "function") {
    updateViewMore();
}

searchBtn.style.display = "";
    clearBtn.style.display = "none";

});

function setupPropertySearch() {

const searchBtn =
    document.getElementById("propertySearchBtn");

const clearBtn =
    document.getElementById("propertyClearBtn");

if (!searchBtn || !clearBtn) return;

searchBtn.addEventListener("click", () => {

    filterActive = true;

    const type =
        document.getElementById("propertyTypeFilter").value;

    const location =
        document.getElementById("propertyLocationFilter").value;

    const deal =
        document.getElementById("propertyDealFilter").value;

    const bedrooms =
        document.getElementById("propertyBedroomsFilter").value;

    const size =
        document.getElementById("propertySizeFilter").value;

    let found = false;

    document
        .querySelectorAll(".property-card")
        .forEach(card => {

            let show = true;

            if (type && card.dataset.type !== type)
                show = false;

            if (location && card.dataset.location !== location)
                show = false;

            if (deal && card.dataset.deal !== deal)
                show = false;

            if (bedrooms && card.dataset.bedrooms !== bedrooms)
                show = false;

            if (size && card.dataset.size !== size)
                show = false;

            card.style.display =
                show ? "" : "none";

            if (show)
                found = true;

        });

    toggleNoResults(found);

sessionStorage.setItem(
    "propertyFilters",
    JSON.stringify({
        type,
        location,
        deal,
        bedrooms,
        size
    })
);

if (typeof updateViewMore === "function") {
    updateViewMore();
}

searchBtn.style.display = "none";
clearBtn.style.display = "";

});

clearBtn.addEventListener("click", () => {

    document
        .querySelectorAll(".property-search select")
        .forEach(select => {

            select.value = "";

        });

    resetCards();

toggleNoResults(true);

filterActive = false;

sessionStorage.removeItem(
    "propertyFilters"
);

if (typeof updateViewMore === "function") {
    updateViewMore();
}

searchBtn.style.display = "";
clearBtn.style.display = "none";

});

}

function toggleNoResults(found) {

const box =
    document.getElementById("noResults");

if (!box) return;

box.style.display =
    found ? "none" : "block";

}

function setupOffers() {

const btn =
    document.getElementById("offersToggle");

const container =
    document.getElementById("offersContainer");

const cards =
    document.querySelectorAll(".offer-card");

if (!btn || !container) return;

btn.addEventListener("click", () => {

    const opening =
        !container.classList.contains("active");

    container.classList.toggle("active");

    btn.textContent =
        container.classList.contains("active")
            ? "Hide Offers"
            : "View Offers";

    if (opening) {

        cards.forEach((card, index) => {

            card.classList.remove("show");

            setTimeout(() => {

                card.classList.add("show");

            }, index * 600);

        });

    }

});

}

function setupSlideshow() {

const slides =
    document.querySelectorAll(".slideshow img");

if (!slides.length) return;

let current = 0;

setInterval(() => {

    slides[current]
        .classList.remove("active");

    current =
        (current + 1) % slides.length;

    slides[current]
        .classList.add("active");

}, 5000);

}

function setupViewMore() {

    const btn = document.getElementById("viewMoreBtn");

    if (!btn) return;

    let expanded =
        sessionStorage.getItem("viewMoreExpanded") === "true";

    function limit() {

        const width = window.innerWidth;

        if (width <= 768) return 4;
        if (width <= 1200) return 6;

        return 8;
    }

    function update() {

        const cards = [
            ...document.querySelectorAll(".property-card")
        ].filter(card => card.style.display !== "none");

        if (filterActive) {

            cards.forEach(card => {
                card.classList.remove("hidden");
            });

            btn.style.display = "none";

            return;
        }

        cards.forEach((card, index) => {

            card.classList.toggle(
                "hidden",
                !expanded && index >= limit()
            );

        });

        btn.style.display =
            cards.length > limit()
                ? "block"
                : "none";

        btn.textContent =
            expanded
                ? "View Less"
                : "View More";
    }

    updateViewMore = update;

    btn.addEventListener("click", () => {

        expanded = !expanded;

        sessionStorage.setItem(
            "viewMoreExpanded",
            expanded
        );

        update();

        if (!expanded) {

            setTimeout(() => {

                btn.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 50);

        }

    });

    update();

    window.addEventListener("resize", update);
}

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle?.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    menuToggle.textContent =
        navMenu.classList.contains("active")
            ? "✕"
            : "☰";

});

document
    .querySelectorAll("#navMenu a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");
            menuToggle.textContent = "☰";

        });

    });

function restoreFilters() {

    const saved =
        sessionStorage.getItem("propertyFilters");

    if (!saved) return;

    const filters = JSON.parse(saved);

    document.getElementById(
        "propertyTypeFilter"
    ).value = filters.type || "";

    document.getElementById(
        "propertyLocationFilter"
    ).value = filters.location || "";

    document.getElementById(
        "propertyDealFilter"
    ).value = filters.deal || "";

    document.getElementById(
        "propertyBedroomsFilter"
    ).value = filters.bedrooms || "";

    document.getElementById(
        "propertySizeFilter"
    ).value = filters.size || "";

    const bedroomsWrapper =
    document.getElementById("bedroomsWrapper");

const sizeWrapper =
    document.getElementById("sizeWrapper");

bedroomsWrapper.style.display =
    filters.type === "House"
        ? ""
        : "none";

sizeWrapper.style.display =
    filters.type === "Land"
        ? ""
        : "none";

    filterActive = true;

    let found = false;

    document
        .getElementById("propertySearchBtn")
        .click();
}

function restoreSelectedProperty() {

    const selectedProperty =
        sessionStorage.getItem(
            "selectedProperty"
        );

    if (!selectedProperty) return;

    setTimeout(() => {

        const card =
            document.querySelector(
                `[data-id="${selectedProperty}"]`
            );

        if (!card) return;

        card.scrollIntoView({
            behavior: "instant",
            block: "center"
        });

    }, 300);

}

function setupDynamicPropertyFilters() {

    const typeFilter =
        document.getElementById("propertyTypeFilter");

    const bedroomsWrapper =
        document.getElementById("bedroomsWrapper");

    const sizeWrapper =
        document.getElementById("sizeWrapper");

    if (!typeFilter) return;

    function updateFilters() {

    const type = typeFilter.value;

    bedroomsWrapper.style.display = "none";
    sizeWrapper.style.display = "none";

    document.getElementById(
        "propertyBedroomsFilter"
    ).value = "";

    document.getElementById(
        "propertySizeFilter"
    ).value = "";

    if (type === "House") {
        bedroomsWrapper.style.display = "";
    }

    if (type === "Land") {
        sizeWrapper.style.display = "";
    }
}

    typeFilter.addEventListener(
        "change",
        updateFilters
    );

    updateFilters();
}