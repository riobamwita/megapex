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
const scrollBtn = document.getElementById("scrollTop");
const contactBtn = document.getElementById("openContact");

window.addEventListener("scroll", () => {
    if (scrollBtn && contactBtn) {
        if (window.scrollY > 300) {
            scrollBtn.classList.add("show");
            contactBtn.classList.add("show");
        } else {
            scrollBtn.classList.remove("show");
            contactBtn.classList.remove("show");
        }
    }
});

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