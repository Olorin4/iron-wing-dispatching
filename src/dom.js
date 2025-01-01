//doms.js handles all dom elements
function hamburgerMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector("nav");
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        console.log("Hamburger menu toggled");
    });
}

function showServices() {
    const showMoreLink = document.querySelector(".show-more-link");
    const hiddenServices = document.querySelector(".hidden-services");
    let expanded = false;
    showMoreLink.addEventListener("click", () => {
        if (!expanded) {
            const hiddenContent = hiddenServices.querySelector(".hidden-cards");
            const fullHeight = hiddenContent.scrollHeight + "px";
            hiddenServices.style.maxHeight = fullHeight;
            hiddenServices.addEventListener(
                "transitionend",
                function handler() {
                    hiddenServices.style.maxHeight = "none";
                    hiddenServices.removeEventListener(
                        "transitionend",
                        handler
                    );
                }
            );
            showMoreLink.innerHTML =
                'Show Less Services <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(187, 185, 185)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"></polyline></svg>';
            expanded = true;
        } else {
            hiddenServices.style.maxHeight = "0";
            showMoreLink.innerHTML =
                'Show More Services <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(187, 185, 185)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
            expanded = false;
        }
    });
}

function contactPopup() {
    const contactTrigger = document.getElementById("contact-trigger");
    const popupOverlay = document.getElementById("popup-overlay");
    const popupContent = document.getElementById("popup-content");
    const popupClose = document.getElementById("popup-close");

    // Show the popup when contact link is clicked
    contactTrigger.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
        const emailField = popupContent.querySelector("#email");
        emailField.focus();
    });

    // Close the popup when clicking "x"
    popupClose.addEventListener("click", () => {
        popupOverlay.style.display = "none";
    });

    // Close the popup when clicking outside the popup content
    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.style.display = "none";
        }
    });
}

function imageFadeIn() {
    const pitchImages = document.querySelectorAll(".pitch-image");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const isSmallScreen = window.innerWidth < 1200;

                if (entry.target.closest("#sales-pitch-1")) {
                    entry.target.style.animation = isSmallScreen
                        ? "fadeInFromBottom 1s ease forwards"
                        : "fadeInFromLeft 1s ease forwards";
                } else if (entry.target.closest("#sales-pitch-2")) {
                    entry.target.style.animation = isSmallScreen
                        ? "fadeInFromBottom 1s ease forwards"
                        : "fadeInFromRight 1s ease forwards";
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    pitchImages.forEach((image) => observer.observe(image));
}

function registerPricingPlan() {
    const ctaLinks = document.querySelectorAll("a[data-plan]");
    ctaLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const planName = link.getAttribute("data-plan");
            if (planName) {
                const href = link.getAttribute("href");
                const updatedHref = `${href}?plan=${encodeURIComponent(planName)}`;
                link.setAttribute("href", updatedHref);
            }
        });
    });
}

export {
    hamburgerMenu,
    showServices,
    contactPopup,
    imageFadeIn,
    registerPricingPlan,
};
