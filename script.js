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

// ================= SEARCH FILTER =================
function runFilter() {

    const type =
        document.getElementById("typeFilter")?.value.toLowerCase() || "";

    const category =
        document.getElementById("categoryFilter")?.value.toLowerCase() || "";

    const location =
        document.getElementById("locationFilter")?.value.toLowerCase() || "";

    const bedrooms =
        document.getElementById("bedroomFilter")?.value || "";

    const minPrice =
        document.getElementById("minPrice")?.value || "";

    const maxPrice =
        document.getElementById("maxPrice")?.value || "";

    const keyword =
        document.getElementById("keyword")?.value.toLowerCase() || "";

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

// ================= FILTER BAR =================
function showFilterBar(type, category, location, bedrooms, count) {

    const container = document.getElementById("activeFilters");

    if (!container) return;

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

    document.getElementById("clearFilters")
        ?.addEventListener("click", resetAllFilters);
}

// ================= RESET FILTERS =================
function resetAllFilters() {

    document.querySelectorAll(".search-box select, .search-box input")
        .forEach(el => el.value = "");

    document.querySelectorAll(".featured-card")
        .forEach(card => card.style.display = "block");

    const activeFilters = document.getElementById("activeFilters");

    if (activeFilters) {
        activeFilters.innerHTML = "";
    }
}

// ================= COMING SOON =================
function showComingSoon() {

    const popup = document.getElementById("comingSoonPopup");

    if (!popup) return;

    popup.classList.add("active");

    setTimeout(() => {
        popup.classList.remove("active");
    }, 2000);
}

// ================= DOM LOADED =================
document.addEventListener("DOMContentLoaded", () => {

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
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // ================= INTRO SCREEN =================
    const intro = document.getElementById("intro-screen");

    if (intro) {

        if (localStorage.getItem("introPlayed")) {

            intro.remove();

        } else {

            setTimeout(() => {

                intro.classList.add("hide");

                setTimeout(() => {

                    intro.remove();
                    localStorage.setItem("introPlayed", "true");

                }, 1000);

            }, 3000);
        }
    }

    // ================= MOBILE MENU =================
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector(".navbar nav");
    const navLinks = document.querySelectorAll(".navbar nav a");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");

            menuToggle.textContent =
                nav.classList.contains("active")
                    ? "✖"
                    : "☰";
        });

        // CLOSE MENU AFTER LINK CLICK
        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.textContent = "☰";
            });
        });
    }

    // ================= CONTACT MODAL =================
    const openBtn = document.getElementById("openContact");
    const closeBtn = document.getElementById("closeContact");
    const modal = document.getElementById("contactModal");

    if (openBtn && closeBtn && modal) {

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
    }

    // ================= SCROLL BUTTONS =================
    const scrollBtn = document.getElementById("scrollTop");
    const contactBtn = document.getElementById("openContact");
    const contactSection = document.querySelector(".contact");

    if (contactSection) {

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

        contactObserver.observe(contactSection);
    }

    if (scrollBtn) {

        scrollBtn.onclick = () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

    // ================= ACCORDION =================
    document.querySelectorAll(".accordion-item").forEach(item => {

        const header = item.querySelector(".accordion-header");

        header?.addEventListener("click", () => {

            document.querySelectorAll(".accordion-item").forEach(i => {

                if (i !== item) {
                    i.classList.remove("active");
                }
            });

            item.classList.toggle("active");
        });
    });

    // ================= HERO SLIDESHOW =================
    const slides = document.querySelectorAll(".slideshow img");

    if (slides.length) {

        let index = 0;

        slides[index].classList.add("active");

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

                        setTimeout(() => {
                            img.classList.add("show");
                        }, i * 200);
                    });

                    observer.unobserve(adStrip);
                }
            });

        }, { threshold: 0.4 });

        observer.observe(adStrip);
    }

    // ================= FILTER EVENTS =================
    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", runFilter);
    }

    document.querySelectorAll(".search-box select, .search-box input")
        .forEach(el => {
            el.addEventListener("input", runFilter);
        });

    // ================= LOCATION CARDS =================
    document.querySelectorAll(".location-card").forEach(card => {

        card.addEventListener("click", () => {

            const location = card.dataset.location;

            // RESET FILTERS
            document.querySelectorAll(".search-box select, .search-box input")
                .forEach(el => el.value = "");

            // APPLY LOCATION
            const locationFilter =
                document.getElementById("locationFilter");

            if (locationFilter) {
                locationFilter.value = location;
            }

            // RUN FILTER
            runFilter();

            // SCROLL
            scrollToFeatured();
        });
    });

    // ================= MORE LOCATIONS =================
    let locationsExpanded = false;

    document.querySelectorAll(".properties-section .more-btn")
        .forEach(btn => {

            btn.addEventListener("click", (e) => {

                e.preventDefault();

                const hiddenCard =
                    document.querySelector(".hidden-location");

                if (!hiddenCard) return;

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

    // ================= FEATURED MORE BUTTON =================
    document.querySelectorAll(".featured-section .more-btn")
        .forEach(btn => {

            btn.addEventListener("click", (e) => {

                e.preventDefault();

                if (isFiltered()) {

                    resetAllFilters();

                    const featured =
                        document.getElementById("featured");

                    if (featured) {

                        window.scrollTo({
                            top: featured.offsetTop - 80,
                            behavior: "smooth"
                        });
                    }

                } else {

                    showComingSoon();
                }
            });
        });

    // ================= LIKE ICONS =================
    document.querySelectorAll(".like-icon").forEach(icon => {

        icon.addEventListener("click", (e) => {

            e.stopPropagation();

            icon.classList.toggle("liked");
        });
    });

    // ================= FEATURED CARD NAVIGATION =================
    document.querySelectorAll(".featured-card").forEach(card => {

        // SKIP LOCATION CARDS
        if (card.classList.contains("location-card")) return;

        card.addEventListener("click", (e) => {

            // IGNORE ICON CLICKS
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

            e.stopPropagation();

            const card = icon.closest(".featured-card");

            if (!card) return;

            const title =
                card.querySelector("h3")?.innerText
                || "Megapex Property";

            const price =
                card.querySelector("p")?.innerText
                || "";

            const link = card.dataset.link
                ? window.location.origin + card.dataset.link
                : window.location.href;

            const shareData = {
                title: title,
                text: `${title} - ${price}`,
                url: link
            };

            // MOBILE SHARE
            if (navigator.share) {

                try {

                    await navigator.share(shareData);

                } catch (err) {

                    console.log("Share cancelled");
                }

            } else {

                // DESKTOP FALLBACK
                try {

                    await navigator.clipboard.writeText(link);

                    alert("Link copied to clipboard!");

                } catch {

                    alert("Copy failed");
                }
            }
        });
    });

    // ================= PHOTOS ICON =================
    document.querySelectorAll(".photos-icon").forEach(icon => {

        icon.addEventListener("click", (e) => {

            e.stopPropagation();

            const link = icon.dataset.link;

            if (!link) return;

            window.location.href = `${link}#gallery`;
        });
    });

    // ================= SCROLL HINT =================
    const strips = document.querySelectorAll(".ad-strip, .gallery");

    strips.forEach(strip => {

        const container =
            strip.closest(".ad-strip-section, .property-details, .section")
            || strip.parentElement;

        const hint = container?.querySelector(".scroll-hint");

        if (!hint) return;

        let hidden = false;

        const hideHint = () => {

            if (hidden) return;

            hidden = true;

            hint.classList.add("scroll-hide");
        };

        strip.addEventListener("scroll", hideHint, { passive: true });
        strip.addEventListener("touchstart", hideHint, { passive: true });
        strip.addEventListener("wheel", hideHint, { passive: true });
        strip.addEventListener("pointerdown", hideHint, { passive: true });
    });

    // ================= CONTACT FORM VALIDATION =================
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function(e) {

            e.preventDefault();

            const name =
                document.getElementById("name")?.value.trim();

            const email =
                document.getElementById("email")?.value.trim();

            const phone =
                document.getElementById("phone")?.value.trim();

            const message =
                document.getElementById("message")?.value.trim();

            // EMPTY CHECK
            if (!name || !email || !phone || !message) {

                alert("Please fill in all fields.");
                return;
            }

            // EMAIL VALIDATION
            const emailPattern =
                /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;

            if (!email.match(emailPattern)) {

                alert("Please enter a valid email address.");
                return;
            }

            // PHONE VALIDATION
            const phonePattern = /^[0-9]{10}$/;

            if (!phone.match(phonePattern)) {

                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            // SUCCESS
            alert("Message sent successfully!");

            contactForm.reset();
        });
    }

});