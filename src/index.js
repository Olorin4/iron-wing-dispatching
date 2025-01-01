import "./normalize.css";
import "./shared.css";
import "./styles.css";
import { onLCP, onINP, onCLS } from "web-vitals";
import {
    hamburgerMenu,
    showServices,
    imageFadeIn,
    contactPopup,
    registerPricingPlan,
} from "./dom";

// Function to store metrics in localStorage
export function logAndStoreMetric(name, value) {
    const metrics = JSON.parse(localStorage.getItem("web-vitals")) || {};
    metrics[name] = value;
    localStorage.setItem("web-vitals", JSON.stringify(metrics));
    console.log(`${name}:`, value);
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
// - Fix responsiveness.
// - Fix responsiveness of sign up html (error messages displace inputs).
// - Flesh out blog.
// - Create a small backend to catch data from the contact forms.
// - Create 404.html.

// - Fix about section affecting the footer.
// - Add a chatbot.
// - Use a privacy policy generator (e.g., Termly)
// - Fix Cumulative Layout Shift.
