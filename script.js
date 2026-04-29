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

document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("intro-screen");

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

const toggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".navbar nav");

toggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    // optional: change icon
    toggle.textContent = nav.classList.contains("active") ? "✖" : "☰";
});

// CLOSE MENU WHEN LINK IS CLICKED
document.querySelectorAll(".navbar nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
        toggle.textContent = "☰";
    });
});

const openBtn = document.getElementById("openContact");
const closeBtn = document.getElementById("closeContact");
const modal = document.getElementById("contactModal");

openBtn.onclick = () => {
    modal.classList.add("active");
};

closeBtn.onclick = () => {
    modal.classList.remove("active");
};

// close when clicking outside
window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
};

const scrollBtn = document.getElementById("scrollTop");
const contactBtn = document.getElementById("openContact");

const contactSection = document.querySelector(".contact");

window.addEventListener("scroll", () => {
    const rect = contactSection.getBoundingClientRect();

    const inView = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (inView) {
        scrollBtn.classList.add("show");
        contactBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
        contactBtn.classList.remove("show");
    }
});

// scroll to top
scrollBtn.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {

        items.forEach(i => {
            if (i !== item) {
                i.classList.remove("active");
            }
        });

        item.classList.toggle("active");
    });
});
