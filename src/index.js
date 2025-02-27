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

function captureQuestion() {
    const contactForm = document.querySelector(".popup-form");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const message = document.getElementById("message").value;

            if (!email.trim() || !message.trim()) {
                alert("Please provide at least an email and a question.");
                return;
            }

            const jsonObject = {
                email: email,
                phone: phone,
                message: message,
            };

            console.log("📩 Submitting Contact Form:", jsonObject);

            try {
                const baseUrl =
                    document
                        .querySelector('meta[name="api-base-url"]')
                        .getAttribute("content") || "http://localhost:3000";
                const response = await fetch(`${baseUrl}/sign-up-forms`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jsonObject),
                });

                if (!response.ok)
                    throw new Error(`Server responded with ${response.status}`);

                const data = await response.json();
                console.log("✅ Contact form successfully submitted!", data);
                alert("Thank you! Your message has been sent successfully.");
                contactForm.reset();
            } catch (error) {
                console.error("❌ Error submitting contact form:", error);
                alert("Error submitting form. Please try again later.");
            }
        });
    }
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
    captureQuestion();
});

// TO DO:
// - Fix sign-up html: error messages displace inputs.
// - Fix responsiveness of logo-overlay in sign-up html
// - Flesh out blog.
// - Create a small backend to catch data from the contact forms.
// - Create 404.html.

// - Fix about section affecting the footer.
// - Add a chatbot.
// - Use a privacy policy generator (e.g., Termly)
// - Fix Cumulative Layout Shift.
