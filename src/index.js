import "./normalize.css";
import "./alt.css";
import { onLCP, onINP, onCLS } from "web-vitals";

// Function to store metrics in localStorage
function logAndStoreMetric(name, value) {
    const metrics = JSON.parse(localStorage.getItem("web-vitals")) || {};
    metrics[name] = value;
    localStorage.setItem("web-vitals", JSON.stringify(metrics));
    console.log(`${name}:`, value);
}

// Capture Web Vitals metrics
console.log("Web Vitals script is running.");
onCLS((metric) => logAndStoreMetric("CLS", metric.value));
onLCP((metric) => logAndStoreMetric("LCP", metric.value));
onINP((metric) => logAndStoreMetric("INP", metric.value));

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector("nav");
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        console.log("Hamburger menu toggled");
    });
});

// TO DO:
// - Add more styling to the service and pricing sections.
// - Fix Cumulative Layout Shift
// - add a chatbot
// - add more contact forms in the homepage
// - Add a smaller contact form prompt on he side of the sales pitch, to catch undecided clients.
// - Add hover effects to the nav menu and the chat bot
// - Fix about section affecting the footer
// - Fix responsiveness of sign up html
// - Flesh out blog
