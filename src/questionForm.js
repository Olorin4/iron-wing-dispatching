import { attributionFields, track } from "./analytics.js";
import {
    getTurnstileToken,
    resetTurnstile,
    TURNSTILE_PENDING_MESSAGE,
} from "./turnstile.js";

const form = document.querySelector(".popup-form");
form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-question-status]");
    const button = form.querySelector("button[type=submit]");
    const turnstileToken = getTurnstileToken(form);
    if (!turnstileToken) {
        status.textContent = TURNSTILE_PENDING_MESSAGE;
        return;
    }

    button.disabled = true;
    const fields = new FormData(form);
    const properties = {
        placement: form.dataset.placement,
        offer: form.dataset.offer,
    };
    try {
        const response = await fetch(
            "https://api.iron-wing-dispatching.com/contact-forms",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: fields.get("email"),
                    phone: fields.get("phone"),
                    message: fields.get("message"),
                    ...properties,
                    turnstileToken,
                    ...attributionFields(),
                }),
            }
        );
        if (!response.ok) throw new Error("Question submission failed");
        form.reset();
        status.textContent = "Your message was sent. A dispatcher will reply.";
        track("contact_form_submitted", properties);
    } catch {
        status.textContent =
            "Your message could not be sent. Please try again.";
        track("contact_form_failed", properties);
    } finally {
        button.disabled = false;
        resetTurnstile(form);
    }
});
