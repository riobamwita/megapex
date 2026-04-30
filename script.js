// NAVIGATION SCROLL
document.querySelectorAll('.navbar nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        const text = this.textContent.trim().toLowerCase();

        // About goes to separate page
        if (text === "about us") return;

        e.preventDefault();

        let targetId = "";

        if (text === "home") targetId = ".hero";
        if (text === "properties") targetId = ".properties-section";
        if (text === "contacts") targetId = ".contact";

        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// INTRO SCREEN
document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("intro-screen");

    if (!intro) return;

    const hasSeenIntro = localStorage.getItem("introPlayed");

    if (hasSeenIntro) {
        intro.style.display = "none";
        return;
    }

    setTimeout(() => {
        intro.classList.add("hide");
        localStorage.setItem("introPlayed", "true");

        setTimeout(() => {
            intro.style.display = "none";
        }, 1200);
    }, 2500);
});


// MOBILE MENU TOGGLE
const toggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".navbar nav");

if (toggle && nav) {
    toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        toggle.textContent = nav.classList.contains("active") ? "✖" : "☰";
    });

    // CLOSE MENU WHEN LINK IS CLICKED
    document.querySelectorAll(".navbar nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            toggle.textContent = "☰";
        });
    });
}

// CONTACT MODAL
let modal = null;

document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openContact");
    const closeBtn = document.getElementById("closeContact");
    modal = document.getElementById("contactModal");

    if (!openBtn || !closeBtn || !modal) return;

    openBtn.addEventListener("click", () => {
        modal.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });
});


// SCROLL BUTTONS
const contactSection = document.querySelector(".contact");
const scrollBtn = document.getElementById("scrollTop");
const contactBtn = document.getElementById("openContact");

const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            scrollBtn?.classList.add("show");
            contactBtn?.classList.add("show");
        } else {
            scrollBtn?.classList.remove("show");
            contactBtn?.classList.remove("show");
        }
    });
}, {
    threshold: 0.3
});

if (contactSection) {
    contactObserver.observe(contactSection);
}

// SCROLL TO TOP
if (scrollBtn) {
    scrollBtn.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
}


// ACCORDION
const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
    const header = item.querySelector(".accordion-header");

    if (!header) return;

    header.addEventListener("click", () => {
        items.forEach(i => {
            if (i !== item) {
                i.classList.remove("active");
            }
        });

        item.classList.toggle("active");
    });
});


// HERO SLIDESHOW
const slides = document.querySelectorAll(".slideshow img");

if (slides.length > 0) {
    let index = 0;

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, 4000);
}

// AD STRIP SCROLL ANIMATION
const adStrip = document.getElementById("adStrip");
const adImages = document.querySelectorAll("#adStrip img");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            adImages.forEach((img, index) => {
                setTimeout(() => {
                    img.classList.add("show");
                }, index * 200); // stagger effect (1 by 1)
            });

            observer.unobserve(adStrip); // run once only
        }
    });
}, {
    threshold: 0.4
});

observer.observe(adStrip);

// ================= SEARCH FUNCTION =================
function runFilter() {

    const type = document.getElementById("typeFilter").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value.toLowerCase();
    const location = document.getElementById("locationFilter").value.toLowerCase();
    const bedrooms = document.getElementById("bedroomFilter").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    const keyword = document.getElementById("keyword").value.toLowerCase();

    const cards = document.querySelectorAll(".featured-card");

    let visibleCount = 0;

    cards.forEach(card => {

        const cardType = card.dataset.type;
        const cardCategory = card.dataset.category;
        const cardLocation = card.dataset.location;
        const cardBedrooms = card.dataset.bedrooms;
        const cardPrice = parseInt(card.dataset.price);
        const cardText = card.innerText.toLowerCase();

        let show = true;

        if (type && cardType !== type) show = false;
        if (category && cardCategory !== category) show = false;
        if (location && cardLocation !== location) show = false;
        if (bedrooms && cardBedrooms !== bedrooms) show = false;

        if (minPrice && cardPrice < parseInt(minPrice)) show = false;
        if (maxPrice && cardPrice > parseInt(maxPrice)) show = false;

        if (keyword && !cardText.includes(keyword)) show = false;

        if (show) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }

    });

    // scroll to results
    document.querySelector(".featured-section").scrollIntoView({
        behavior: "smooth"
    });

    // show active filters
    showFilterBar(type, category, location, bedrooms, visibleCount);
}


// ================= BUTTON CLICK =================
document.getElementById("searchBtn").addEventListener("click", runFilter);


// ================= LIVE FILTER (AUTO) =================
document.querySelectorAll(".search-box select, .search-box input")
.forEach(el => {
    el.addEventListener("input", runFilter);
});


// ================= FILTER BAR =================
function showFilterBar(type, category, location, bedrooms, count) {

    const container = document.getElementById("activeFilters");

    let filters = [];

    if (type) filters.push(`Type: ${type}`);
    if (category) filters.push(`Category: ${category}`);
    if (location) filters.push(`Location: ${location}`);
    if (bedrooms) filters.push(`Bedrooms: ${bedrooms}`);

    // nothing selected → hide bar
    if (filters.length === 0) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <div class="filter-bar">
            <span>${filters.join(" | ")} (${count} results)</span>
            <button id="clearFilters">View All</button>
        </div>
    `;

    // CLEAR FILTERS BUTTON
    document.getElementById("clearFilters").addEventListener("click", () => {

        // reset inputs
        document.querySelectorAll(".search-box select").forEach(s => s.value = "");
        document.querySelectorAll(".search-box input").forEach(i => i.value = "");

        // show all cards
        document.querySelectorAll(".featured-card").forEach(card => {
            card.style.display = "block";
        });

        container.innerHTML = "";

        // scroll stays in place (optional)
    });
}

function showComingSoon() {
    const popup = document.getElementById("comingSoonPopup");

    popup.classList.add("active");

    setTimeout(() => {
        popup.classList.remove("active");
    }, 2000); // disappears after 2 seconds
}

// TARGET BUTTONS
document.querySelectorAll(
    ".view-btn, .more-btn, .more-properties button, .subscribe button"
).forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        showComingSoon();
    });
});

document.querySelectorAll(".like-icon").forEach(icon => {
    icon.addEventListener("click", () => {
        icon.classList.toggle("liked");
    });
});

// Coming Soon popup
const popup = document.getElementById("comingSoonPopup");

// Select all featured cards
const featuredCards = document.querySelectorAll(".featured-card");

featuredCards.forEach(card => {
    card.addEventListener("click", () => {
        popup.classList.add("active");

        // hide after 2 seconds
        setTimeout(() => {
            popup.classList.remove("active");
        }, 2000);
    });
});
