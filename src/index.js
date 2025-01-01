import "./normalize.css";
import "./shared.css";
import "./styles.css";
import { onLCP, onINP, onCLS } from "web-vitals";
import { hamburgerMenu, showServices, imageFadeIn, contactPopup } from "./dom";

// Function to store metrics in localStorage
export function logAndStoreMetric(name, value) {
    const metrics = JSON.parse(localStorage.getItem("web-vitals")) || {};
    metrics[name] = value;
    localStorage.setItem("web-vitals", JSON.stringify(metrics));
    console.log(`${name}:`, value);
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

document.addEventListener("DOMContentLoaded", () => {
    // Capture Web Vitals metrics
    console.log("Web Vitals script is running.");
    onCLS((metric) => logAndStoreMetric("CLS", metric.value));
    onLCP((metric) => logAndStoreMetric("LCP", metric.value));
    onINP((metric) => logAndStoreMetric("INP", metric.value));

    hamburgerMenu();
    showServices();
    imageFadeIn();
    contactPopup();
    registerPricingPlan();
});

// TO DO:
// - Add more styling  to the  pricing section.
// - Fix responsiveness.
// - Fix responsiveness of sign up html.
// - Flesh out blog.
// - Create a small backend to catch data from the contact forms.
// - Create 404.html.

// - Fix about section affecting the footer.
// - Add a chatbot.
// - Use a privacy policy generator (e.g., Termly)
// - Fix Cumulative Layout Shift.
