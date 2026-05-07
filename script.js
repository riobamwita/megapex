// ================= UTIL: CHECK IF FILTERED =================
function isFiltered() {
    const inputs = document.querySelectorAll(".search-box select, .search-box input");

    let hasValue = false;

    inputs.forEach(el => {
        if (el.value && el.value.trim() !== "") {
            hasValue = true;
        }
    });

    return hasValue;
}

// ================= SCROLL TO FEATURED =================
function scrollToFeatured() {
    const featuredSection = document.getElementById("featured");

    if (!featuredSection) return;

    window.scrollTo({
        top: featuredSection.offsetTop - 100,
        behavior: "smooth"
    });
}

// ================= NAVIGATION SCROLL =================
document.querySelectorAll('.navbar nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        const text = this.textContent.trim().toLowerCase();

        if (text === "about us") return;

        e.preventDefault();

        let targetId = "";

        if (text === "home") targetId = ".hero";
        if (text === "properties") targetId = ".properties-section";
        if (text === "contacts") targetId = ".contact";

        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});


// ================= INTRO SCREEN =================
document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("intro-screen");
    if (!intro) return;

    if (localStorage.getItem("introPlayed")) {
        intro.remove();
        return;
    }

    setTimeout(() => {
        intro.classList.add("hide");

        setTimeout(() => {
            intro.remove();
            localStorage.setItem("introPlayed", "true");
        }, 1000);

    }, 3000);
});


// ================= MOBILE MENU =================
const toggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".navbar nav");

if (toggle && nav) {
    toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        toggle.textContent = nav.classList.contains("active") ? "✖" : "☰";
    });
}


// ================= CONTACT MODAL =================
document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openContact");
    const closeBtn = document.getElementById("closeContact");
    const modal = document.getElementById("contactModal");

    if (!openBtn || !closeBtn || !modal) return;

    openBtn.addEventListener("click", () => modal.classList.add("active"));
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });
});


// ================= SCROLL BUTTONS =================
const scrollBtn = document.getElementById("scrollTop");
const contactBtn = document.getElementById("openContact");
const contactSection = document.querySelector(".contact");

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
}, { threshold: 0.3 });

if (contactSection) contactObserver.observe(contactSection);

if (scrollBtn) {
    scrollBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}


// ================= ACCORDION =================
document.querySelectorAll(".accordion-item").forEach(item => {
    const header = item.querySelector(".accordion-header");

    header?.addEventListener("click", () => {
        document.querySelectorAll(".accordion-item").forEach(i => {
            if (i !== item) i.classList.remove("active");
        });

        item.classList.toggle("active");
    });
});


// ================= HERO SLIDESHOW =================
const slides = document.querySelectorAll(".slideshow img");

if (slides.length) {
    let index = 0;

    setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
    }, 4000);
}


// ================= AD STRIP =================
const adStrip = document.getElementById("adStrip");
const adImages = document.querySelectorAll("#adStrip img");

if (adStrip) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                adImages.forEach((img, i) => {
                    setTimeout(() => img.classList.add("show"), i * 200);
                });
                observer.unobserve(adStrip);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(adStrip);
}


// ================= SEARCH FILTER =================
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

        const show =
            (!type || card.dataset.type === type) &&
            (!category || card.dataset.category === category) &&
            (!location || card.dataset.location === location) &&
            (!bedrooms || card.dataset.bedrooms === bedrooms) &&
            (!minPrice || parseInt(card.dataset.price) >= parseInt(minPrice)) &&
            (!maxPrice || parseInt(card.dataset.price) <= parseInt(maxPrice)) &&
            (!keyword || card.innerText.toLowerCase().includes(keyword));

        card.style.display = show ? "block" : "none";
        if (show) visibleCount++;
    });

    showFilterBar(type, category, location, bedrooms, visibleCount);

scrollToFeatured();

}


// ================= FILTER EVENTS =================
document.getElementById("searchBtn").addEventListener("click", runFilter);

document.querySelectorAll(".search-box select, .search-box input")
    .forEach(el => el.addEventListener("input", runFilter));


// ================= FILTER BAR =================
function showFilterBar(type, category, location, bedrooms, count) {

    const container = document.getElementById("activeFilters");

    let filters = [];

    if (type) filters.push(`Type: ${type}`);
    if (category) filters.push(`Category: ${category}`);
    if (location) filters.push(`Location: ${location}`);
    if (bedrooms) filters.push(`Bedrooms: ${bedrooms}`);

    if (!filters.length) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = `
        <div class="filter-bar">
            <span>${filters.join(" | ")} (${count} results)</span>
            <button id="clearFilters">View All</button>
        </div>
    `;

    document.getElementById("clearFilters").addEventListener("click", resetAllFilters);
}


// ================= RESET FILTERS =================
function resetAllFilters() {

    document.querySelectorAll(".search-box select, .search-box input")
        .forEach(el => el.value = "");

    document.querySelectorAll(".featured-card")
        .forEach(card => card.style.display = "block");

    document.getElementById("activeFilters").innerHTML = "";
}


// ================= COMING SOON =================
function showComingSoon() {
    const popup = document.getElementById("comingSoonPopup");

    popup.classList.add("active");

    setTimeout(() => popup.classList.remove("active"), 2000);
}


// ================= LOCATION CARDS =================
document.querySelectorAll(".location-card").forEach(card => {

    card.addEventListener("click", () => {

        const location = card.dataset.location;

        // Reset search inputs first
        document.querySelectorAll(".search-box select, .search-box input")
            .forEach(el => el.value = "");

        // Set selected location in filter
        document.getElementById("locationFilter").value = location;

        // Run normal filter system
        runFilter();

        // Scroll properly
        scrollToFeatured();
    });

});


let locationsExpanded = false;

document.querySelectorAll(".properties-section .more-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const hiddenCard = document.querySelector(".hidden-location");

        if (!hiddenCard) return;

        // TOGGLE
        locationsExpanded = !locationsExpanded;

        if (locationsExpanded) {
            hiddenCard.classList.add("show");
            btn.textContent = "View Less";
        } else {
            hiddenCard.classList.remove("show");
            btn.textContent = "More Locations";
        }
    });
});


// 2. VIEW MORE FEATURED → ONLY IF NOT FILTERED
document.querySelectorAll(".featured-section .more-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        if (isFiltered()) {
            resetAllFilters();
            const featured = document.getElementById("featured");

window.scrollTo({
    top: featured.offsetTop - 80,
    behavior: "smooth"
});
        } else {
            showComingSoon();
        }
    });
});


// ================= LIKE ICONS =================
document.querySelectorAll(".like-icon").forEach(icon => {
    icon.addEventListener("click", () => {
        icon.classList.toggle("liked");
    });
});

// ================= FEATURED CARD NAVIGATION =================
document.querySelectorAll(".featured-card").forEach(card => {

    // SKIP location cards
    if (card.classList.contains("location-card")) return;

    card.addEventListener("click", (e) => {

        // Ignore icon clicks
        if (e.target.closest(".featured-icons")) return;

        const link = card.dataset.link;

        if (link) {
            window.location.href = link;
        } else {
            showComingSoon();
        }
    });

});

// ================= SHARE FUNCTION =================
document.querySelectorAll(".share-icon").forEach(icon => {
    icon.addEventListener("click", async (e) => {
        e.stopPropagation(); // prevent card click navigation

        const card = icon.closest(".featured-card");

        const title = card.querySelector("h3")?.innerText || "Megapex Property";
        const price = card.querySelector("p")?.innerText || "";
        const link = card.dataset.link
            ? window.location.origin + card.dataset.link
            : window.location.href;

        const shareData = {
            title: title,
            text: `${title} - ${price}`,
            url: link
        };

        // 🌐 Modern phones (WhatsApp, native share, etc.)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Share cancelled");
            }
        } 
        // 📋 Fallback (desktop)
        else {
            try {
                await navigator.clipboard.writeText(link);
                alert("Link copied to clipboard!");
            } catch {
                alert("Copy failed");
            }
        }
    });
});

// ================= PHOTOS ICON NAVIGATION =================
document.querySelectorAll(".photos-icon").forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.stopPropagation(); // prevents card click conflict

        const link = icon.dataset.link;

        if (!link) return;

        // open property page and go to gallery
        window.location.href = `${link}#gallery`;
    });
});