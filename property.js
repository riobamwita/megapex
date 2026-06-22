let propertyData = null;
let galleryImages = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
    setupBackButton();
    setupLightbox();
    setupInquiryForm();
    await loadProperty();
});

async function loadProperty() {
    try {

        const response = await fetch("properties.json");

        if (!response.ok) {
            throw new Error("properties.json not found");
        }

        const properties = await response.json();

        const params =
            new URLSearchParams(window.location.search);

        const propertyId =
            params.get("id");

        propertyData =
            properties.find(
                property => property.id === propertyId
            );

        if (!propertyData) {

            document.getElementById(
                "propertyTitle"
            ).textContent = "Property Not Found";

            return;
        }

        populateProperty();

    } catch (error) {

        console.error(error);

        document.getElementById(
            "propertyTitle"
        ).textContent = "Failed To Load Property";
    }
}

function populateProperty() {

    document.getElementById(
        "propertyTitle"
    ).textContent = propertyData.title;

    document.getElementById(
        "propertyPrice"
    ).textContent = propertyData.formattedPrice;

    document.getElementById(
        "description"
    ).textContent = propertyData.description;

    const heroMeta =
        document.getElementById("heroMeta");

    heroMeta.innerHTML = "";

    heroMeta.innerHTML += `
        <span>
            <i class="fa-solid fa-location-dot"></i>
            ${propertyData.location}
        </span>

        <span>
            <i class="fa-solid fa-tag"></i>
            ${propertyData.deal}
        </span>

        <span>
            <i class="fa-solid fa-house"></i>
            ${propertyData.type}
        </span>
    `;

    if (propertyData.bedrooms) {

        heroMeta.innerHTML += `
            <span>
                <i class="fa-solid fa-bed"></i>
                ${propertyData.bedrooms} Bedrooms
            </span>
        `;
    }

    if (propertyData.size) {

        heroMeta.innerHTML += `
            <span>
                <i class="fa-solid fa-ruler-combined"></i>
                ${propertyData.size}
            </span>
        `;
    }

    loadFeatures();
    loadGallery();
}

function loadFeatures() {

    const features =
        document.getElementById("features");

    features.innerHTML = "";

    propertyData.features.forEach(feature => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            <i class="fa-solid fa-check"></i>
            ${feature}
        `;

        features.appendChild(li);
    });
}

function loadGallery() {

    const gallery =
        document.getElementById("gallery");

    gallery.innerHTML = "";

    galleryImages = [
        propertyData.hero,
        ...(propertyData.gallery || [])
    ];

    galleryImages.slice(0, 3).forEach((src, index) => {

        const img =
            document.createElement("img");

        img.src = src;
        img.alt = propertyData.title;

        img.addEventListener(
            "click",
            () => openLightbox(index)
        );

        gallery.appendChild(img);
    });
}

function setupLightbox() {

    const lightbox =
        document.getElementById("lightbox");

    const closeBtn =
        document.querySelector(".close-lightbox");

    const prevBtn =
        document.querySelector(".lightbox-prev");

    const nextBtn =
        document.querySelector(".lightbox-next");

    closeBtn.addEventListener(
        "click",
        closeLightbox
    );

    prevBtn.addEventListener(
        "click",
        previousImage
    );

    nextBtn.addEventListener(
        "click",
        nextImage
    );

    lightbox.addEventListener("click", e => {

        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", e => {

        if (
            lightbox.style.display !== "block"
        ) return;

        if (e.key === "ArrowRight") {
            nextImage();
        }

        if (e.key === "ArrowLeft") {
            previousImage();
        }

        if (e.key === "Escape") {
            closeLightbox();
        }
    });
}

function openLightbox(index) {
    currentIndex = index;

    const lightbox = document.getElementById("lightbox");
    const track = lightbox.querySelector(".lightbox-track");

    track.innerHTML = "";

    galleryImages.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;

        if (i === currentIndex) img.classList.add("active");

        // zoom toggle
        img.addEventListener("click", (e) => {
            e.stopPropagation();
            img.classList.toggle("zoomed");
        });

        track.appendChild(img);
    });

    lightbox.style.display = "block";
    updateLightbox();
}

function updateLightbox() {
    const lightbox = document.getElementById("lightbox");
    const track = lightbox.querySelector(".lightbox-track");
    const counter = lightbox.querySelector(".lightbox-counter");

    const images = track.querySelectorAll("img");

    images.forEach((img, i) => {
        img.classList.toggle("active", i === currentIndex);
        img.classList.remove("zoomed");
    });

    counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
}

function previousImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
}

function closeLightbox() {

    document.getElementById(
        "lightbox"
    ).style.display = "none";
}

function setupInquiryForm() {

    const form =
        document.querySelector(".contact-form");

    if (!form) return;

    form.addEventListener("submit", e => {

        e.preventDefault();

        alert(
            "Thank you. Your inquiry has been received."
        );

        form.reset();
    });
}

function setupBackButton() {

    const btn = document.getElementById("backBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        if (history.length > 1) {
            history.back();
        } else {
            window.location.href = "index.html?return=true";
        }

    });

}