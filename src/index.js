import { onLCP, onINP, onCLS } from "web-vitals";
import {
    showServices,
    imageFadeIn,
    contactPopup,
    registerPricingPlan,
} from "./dom";
import {
    TURNSTILE_PENDING_MESSAGE,
    TurnstileError,
    getTurnstileToken,
    resetTurnstile,
} from "./turnstile.js";
import { identifyVisitor, track, trackError } from "./analytics.js";

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

            const turnstileToken = getTurnstileToken(contactForm);
            if (!turnstileToken) {
                alert(TURNSTILE_PENDING_MESSAGE);
                return;
            }

            const jsonObject = {
                email: email,
                phone: phone,
                message: message,
            };

            console.log("📩 Submitting Contact Form:", jsonObject);

            try {
                const response = await fetch(
                    "https://api.iron-wing-dispatching.com/contact-forms",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...jsonObject, turnstileToken }),
                    }
                );

                if (response.status === 403) throw new TurnstileError();
                if (!response.ok)
                    throw new Error(`Server responded with ${response.status}`);

                const data = await response.json();
                console.log("✅ Contact form successfully submitted!", data);
                alert("Thank you! Your message has been sent successfully.");
                contactForm.reset();

                // Push event to GTM
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "form_submission_contact",
                    form_id: "popup-form",
                    form_url: window.location.href,
                });
                console.log("📊 GTM Event Pushed: form_submission_contact");

                identifyVisitor(email);
                track("contact_form_submitted", {
                    form_id: "popup-form",
                    has_phone: Boolean(phone.trim()),
                });
            } catch (error) {
                console.error("❌ Error submitting contact form:", error);
                const reason =
                    error instanceof TurnstileError ? "turnstile" : "server";
                track("contact_form_failed", { reason });
                if (reason === "server") trackError(error, { form: "contact" });
                alert(
                    error instanceof TurnstileError
                        ? error.message
                        : "Error submitting form. Please try again later."
                );
            } finally {
                resetTurnstile(contactForm);
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

/*
// The following functions and their calls are related to the metric cards section.
// They have been commented out as per user request to disable metric card functionality.

/**
 * populateMetrics({m1,m2,m3,m4})
 * Example:
 * populateMetrics({
 *  m1: '12T Monthly Tokens',
 *  m2: '4.2M+',
 *  m3: '60+',
 *  m4: '500+'
 * })
 */
/*
function populateMetrics(data) {
    const map = { m1: "m1", m2: "m2", m3: "m3", m4: "m4" };
    for (const key in map) {
        const el = document.getElementById(map[key]);
        if (!el) continue;
        el.textContent = data[key] ?? "—";
    }
}
*/

/* small numeric count-up helper (optional)
   pass numbers for a smooth increment effect */
/*
function countUp(id, endValue, suffix = "") {
    const el = document.getElementById(id);
    if (!el) return;
    const isNumeric = typeof endValue === "number";
    if (!isNumeric) {
        el.textContent = endValue;
        return;
    }
    const duration = 900;
    const frameRate = 30;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    const start = 0;
    const step = (endValue - start) / totalFrames;
    const t = setInterval(() => {
        frame++;
        const value = Math.round(start + step * frame);
        el.textContent = value.toLocaleString() + suffix;
        if (frame >= totalFrames) {
            clearInterval(t);
            el.textContent = endValue.toLocaleString() + suffix;
        }
    }, 1000 / frameRate);
}
*/

/* Example usage: replace with your real stats */
/*
document.addEventListener("DOMContentLoaded", () => {
    // Initial values for countUp
    const initialMetrics = {
        m1: "$2.2 per mile",
        m2: 0, // Start from 0 for animation
        m3: 0, // Start from 0 for animation
        m4: 0, // Start from 0 for animation
    };
    populateMetrics(initialMetrics);

    // Final values for countUp animation
    const finalMetrics = {
        m1: "$2.2 per mile", // Not a number, so no animation
        m2: 1752,
        m3: 11358,
        m4: 24,
    };

    // Trigger countUp for numeric metrics
    countUp("m2", finalMetrics.m2);
    countUp("m3", finalMetrics.m3);
    countUp("m4", finalMetrics.m4);
});
*/
