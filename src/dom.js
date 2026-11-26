//doms.js handles all dom elements
import { track } from "./analytics.js";

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
    const contactTriggers = document.querySelectorAll("[data-contact-trigger]");
    const popupOverlay = document.getElementById("popup-overlay");
    const popupContent = document.getElementById("popup-content");
    const popupClose = document.getElementById("popup-close");
    if (!popupOverlay || !popupContent || !popupClose) return;

    let opener;
    // Show the popup when any contact link is clicked
    contactTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            document
                .querySelector(".nav-links.active")
                ?.classList.remove("active");
            popupOverlay.style.display = "flex";
            opener = trigger;
            const form = popupContent.querySelector("form");
            form.dataset.placement = trigger.dataset.placement || "navigation";
            form.dataset.offer = trigger.dataset.offer || "";
            form.querySelector("[data-offer-question]").hidden =
                !form.dataset.offer;
            form.querySelector("#message").focus();
            track("contact_popup_opened", {
                placement: form.dataset.placement,
                offer: form.dataset.offer,
            });
        });
    });

    function close() {
        popupOverlay.style.display = "none";
        opener?.focus();
    }

    popupClose.addEventListener("click", close);
    popupOverlay.addEventListener("click", (event) => {
        if (event.target === popupOverlay) close();
    });
    popupOverlay.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
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
    for (const link of document.querySelectorAll("a[data-plan]")) {
        link.addEventListener("click", () =>
            track("pricing_plan_selected", { plan: link.dataset.plan })
        );
    }
    const pricing = document.querySelector("#pricing");
    if (!pricing || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        track("pricing_viewed", {
            hero_variant:
                document.documentElement.dataset.heroVariant || "control",
        });
        observer.disconnect();
    });
    observer.observe(pricing);
}

export {
    hamburgerMenu,
    showServices,
    contactPopup,
    imageFadeIn,
    registerPricingPlan,
};
