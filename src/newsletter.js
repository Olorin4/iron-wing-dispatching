import {
    TURNSTILE_PENDING_MESSAGE,
    TurnstileError,
    getTurnstileToken,
    resetTurnstile,
} from "./turnstile.js";
import { identifyVisitor, track, trackError } from "./analytics.js";

export function handleNewsletterSignup() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("newsletter-email").value;

            if (!email.trim()) {
                alert("Please enter your email.");
                return;
            }

            const turnstileToken = getTurnstileToken(newsletterForm);
            if (!turnstileToken) {
                alert(TURNSTILE_PENDING_MESSAGE);
                return;
            }

            const jsonObject = {
                email: email,
                type: "newsletter",
            };

            console.log("📩 Submitting Newsletter Signup:", jsonObject);

            try {
                const response = await fetch(
                    "https://api.iron-wing-dispatching.com/newsletter",
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
                console.log("✅ Newsletter signup successful!", data);
                alert(
                    "Thank you for subscribing! Check your email for confirmation."
                );
                newsletterForm.reset();

                // Push event to GTM
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "newsletter_subscription",
                    form_id: "newsletter-form",
                    form_url: window.location.href,
                });
                console.log("📊 GTM Event Pushed: newsletter_subscription");

                identifyVisitor(email);
                track("newsletter_subscribed", { form_id: "newsletter-form" });
            } catch (error) {
                console.error("❌ Error submitting newsletter signup:", error);
                const reason =
                    error instanceof TurnstileError ? "turnstile" : "server";
                track("newsletter_subscription_failed", { reason });
                if (reason === "server")
                    trackError(error, { form: "newsletter" });
                alert(
                    error instanceof TurnstileError
                        ? error.message
                        : "Error subscribing. Please try again later."
                );
            } finally {
                resetTurnstile(newsletterForm);
            }
        });
    }
}
