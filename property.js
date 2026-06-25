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

function setupLightbox(){

    const lightbox =
        document.getElementById("lightbox");

    document
    .querySelector(".close-lightbox")
    .addEventListener(
        "click",
        closeLightbox
    );

    document
    .querySelector(".lightbox-next")
    .addEventListener(
        "click",
        nextImage
    );

    document
    .querySelector(".lightbox-prev")
    .addEventListener(
        "click",
        previousImage
    );

    lightbox.addEventListener("click", e=>{

        if(e.target === lightbox){
            closeLightbox();
        }

    });

    document.addEventListener(
        "keydown",
        e=>{

            if(!lightbox.classList.contains("show"))
            return;

            if(e.key==="ArrowRight")
                nextImage();

            if(e.key==="ArrowLeft")
                previousImage();

            if(e.key==="Escape")
                closeLightbox();

        }
    );

}

function openLightbox(index){

    currentIndex=index;

    const lightbox =
    document.getElementById("lightbox");

    const gallery =
    lightbox.querySelector(".lightbox-track");

    gallery.innerHTML="";

    galleryImages.forEach((src)=>{

        const img =
        document.createElement("img");

        img.src=src;

        img.addEventListener(
            "click",
            ()=>{

                img.classList.toggle(
                    "zoomed"
                );

            }
        );

        gallery.appendChild(img);

    });

    lightbox.classList.add("show");

    requestAnimationFrame(()=>{

        gallery.scrollLeft =
        index * gallery.clientWidth;

    });

    updateCounter();

    gallery.onscroll=()=>{

        currentIndex =
        Math.round(
            gallery.scrollLeft /
            gallery.clientWidth
        );

        updateCounter();

    };

}

function updateLightbox(){

    const gallery =
    document.querySelector(".lightbox-track");

    gallery.scrollTo({
        left: currentIndex * gallery.clientWidth,
        behavior:"smooth"
    });

    updateCounter();

}

function nextImage(){

    if(currentIndex < galleryImages.length - 1){

        currentIndex++;

    }

    updateLightbox();

}

function previousImage(){

    if(currentIndex > 0){

        currentIndex--;

    }

    updateLightbox();

}

function closeLightbox() {

    document
        .getElementById("lightbox")
        .classList.remove("show");
}

function updateCounter() {

    document.querySelector(
        ".lightbox-counter"
    ).textContent =
        `${currentIndex + 1} / ${galleryImages.length}`;
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