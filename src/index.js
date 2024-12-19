import "./normalize.css";
import "./shared.css";
import "./styles.css";
import { onLCP, onINP, onCLS } from "web-vitals";
import { hamburgerMenu, showServices, contactPopup } from "./dom";

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
    contactPopup();
});

// TO DO:
// - Add a smaller contact form prompt in the 2nd sales pitch, to catch undecided clients.
// - Add more styling and svg icons to the service and pricing sections.
// - Add a chatbot
// - Fix responsiveness
// - Fix responsiveness of sign up html
// - Flesh out blog
// - Fix about section affecting the footer
// - Fix Cumulative Layout Shift
