import { attributionFields, track } from "../analytics.js";
import {
    getTurnstileToken,
    resetTurnstile,
    TURNSTILE_PENDING_MESSAGE,
} from "../turnstile.js";

const API = "https://api.iron-wing-dispatching.com";
const OFFER = "black-friday-2026";
const LEGACY_PLANS = new Map([
    ["essential plan (5%)", "ESSENTIAL"],
    ["essential", "ESSENTIAL"],
    ["full-service plan (10%)", "FULL_SERVICE"],
    ["full-service", "FULL_SERVICE"],
    ["fleet pricing", "FLEET"],
]);

const form = document.querySelector("#sign-up-form");
const plan = form.elements.plan;
const button = form.querySelector("button[type=submit]");
const question = document.querySelector("#application-question");
const status = document.querySelector("#confirmation-message");
const params = new URLSearchParams(location.search);
const requestedOffer = params.get("offer") === OFFER ? OFFER : null;
const requestedPlan = params.get("plan") || "";
const planKey = requestedOffer
    ? "ESSENTIAL"
    : LEGACY_PLANS.get(requestedPlan.toLowerCase()) ||
      requestedPlan.toUpperCase();
if ([...plan.options].some((option) => option.value === planKey))
    plan.value = planKey;
let offer = null;
let expiresTimer;

function showOffer(open) {
    offer = open ? OFFER : null;
    document.querySelector("#offer-details").hidden = !open;
    const offerStatus = document.querySelector("#offer-status");
    offerStatus.hidden = open;
    offerStatus.textContent =
        "Black Friday enrollment is closed. You can still apply at standard rates.";
    question.textContent = open ? "Ask about this offer" : "Ask a dispatcher";
    question.dataset.offer = open ? OFFER : "";
    if (open) plan.value = "ESSENTIAL";
    plan.disabled = open;
    button.textContent = open ? "Request my 3% rate" : "Send my application";
}

async function refreshOffer() {
    try {
        const response = await fetch(API + "/dispatch-offer", {
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        const remaining =
            Date.parse(data.enrollmentEndsAt) - Date.parse(data.serverTime);
        showOffer(data.open === true && remaining > 0);
        if (offer) expiresTimer = setTimeout(() => showOffer(false), remaining);
    } catch {
        showOffer(false);
    } finally {
        button.disabled = false;
    }
}

if (requestedOffer) {
    button.disabled = true;
    void refreshOffer();
    window.addEventListener("pagehide", () => clearTimeout(expiresTimer));
    window.addEventListener("pageshow", (event) => {
        if (event.persisted && !form.hidden) void refreshOffer();
    });
}

const properties = () => ({ plan: plan.value, offer: requestedOffer });
track("sign_up_viewed", properties());
form.addEventListener(
    "input",
    () => track("sign_up_form_started", properties()),
    { once: true }
);
form.addEventListener(
    "invalid",
    (event) => {
        track("sign_up_form_invalid", {
            ...properties(),
            field: event.target.name,
        });
    },
    true
);

let previousPayload;
let requestId;
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const name = String(fields.get("name")).trim();
    const email = String(fields.get("email")).trim();
    const phone = String(fields.get("phone")).trim();
    if (!name || !(email || phone)) {
        status.textContent = "Enter your name and an email or callback number.";
        track("sign_up_form_invalid", properties());
        return;
    }
    const token = getTurnstileToken(form);
    if (!token) {
        status.textContent = TURNSTILE_PENDING_MESSAGE;
        return;
    }

    // Keep the same key when a response is lost. Edited applications get a new key.
    const payload = JSON.stringify({
        name,
        email,
        phone,
        plan: plan.value,
        offer: requestedOffer,
        trailerType: fields.get("trailerType"),
    });
    if (payload !== previousPayload) {
        requestId = crypto.randomUUID();
        previousPayload = payload;
    }
    button.disabled = true;
    status.textContent = "Sending your application…";
    try {
        const { campaign, ...attribution } = attributionFields();
        const response = await fetch(API + "/sign-up-forms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(15_000),
            body: JSON.stringify({
                ...JSON.parse(payload),
                requestId,
                campaign,
                ...attribution,
                turnstileToken: token,
            }),
        });
        if (!response.ok) {
            status.textContent =
                response.status === 400
                    ? "Check your name, email or callback number and try again."
                    : "We could not confirm your application. Please try again.";
            track("sign_up_form_failed", {
                ...properties(),
                status: response.status,
            });
            return;
        }
        const result = await response.json();
        if (!result.id || !Number.isFinite(Date.parse(result.receivedAt)))
            throw new Error();
        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Chicago",
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(result.receivedAt));
        const receipt = `Application #${result.id} received ${time} Central.`;
        status.textContent =
            result.claimStatus === "pending_review"
                ? receipt + " A dispatcher will confirm your offer eligibility."
                : receipt +
                  (result.claimStatus === "closed"
                      ? " Enrollment is closed. A dispatcher will contact you about standard rates."
                      : " A dispatcher will be in touch.");
        form.hidden = true;
        track("sign_up_form_submitted", {
            ...properties(),
            claim_status: result.claimStatus,
        });
    } catch {
        status.textContent =
            "We could not confirm your application. Please try again.";
        track("sign_up_form_failed", properties());
    } finally {
        button.disabled = false;
        resetTurnstile(form);
    }
});
