// Cloudflare Turnstile: shared config and helpers for the sign-up, contact and
// newsletter forms.
//
// Flow: each form contains a `.cf-turnstile` widget; the Turnstile script adds
// a hidden `cf-turnstile-response` input to the form once the visitor passes.
// On submit we send that token to the API as `turnstileToken`. The API
// (iwd-backend) verifies it with Cloudflare before doing anything else, so the
// check cannot be skipped by posting to the API directly. Tokens are single-use,
// so the widget is reset after every attempt.

export const TURNSTILE_SITEKEY = "0x4AAAAAAF1tiWROUmzc38vP";

export const TURNSTILE_PENDING_MESSAGE =
    "Please wait for the security check to finish, then try again.";
export const TURNSTILE_FAILED_MESSAGE =
    "Security check failed. Please refresh the page and try again.";

/** Thrown when the API rejects the Turnstile token (HTTP 403). */
export class TurnstileError extends Error {
    constructor() {
        super(TURNSTILE_FAILED_MESSAGE);
        this.name = "TurnstileError";
    }
}

/** The current token in `form`, or "" if the widget has not finished yet. */
export function getTurnstileToken(form) {
    return form.querySelector('[name="cf-turnstile-response"]')?.value || "";
}

/** Requests a fresh token. Call after every submit attempt. */
export function resetTurnstile(form) {
    const widget = form.querySelector(".cf-turnstile");
    if (widget && window.turnstile) window.turnstile.reset(widget);
}
