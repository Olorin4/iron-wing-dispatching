// sign-up.js contains form validation
import validator from "validator";
import {
    TURNSTILE_PENDING_MESSAGE,
    TurnstileError,
    getTurnstileToken,
    resetTurnstile,
} from "../turnstile.js";
import { identifyVisitor, track, trackError } from "../analytics.js";

function pricingChoice() {
    const planName = document.getElementById("plan-name");
    const planInput = document.getElementById("plan-input");

    if (!planInput) {
        console.error("❌ Error: Element with ID 'plan-input' not found.");
        return;
    }

    // Extract the 'plan' parameter from the query string
    const params = new URLSearchParams(window.location.search);
    const chosenPlan = params.get("plan");

    // Update the span and the hidden input
    if (chosenPlan) {
        planName.textContent = chosenPlan;
        planInput.value = chosenPlan;
    } else {
        planName.closest("legend").innerHTML =
            `Please select a<span class="break"></span> pricing plan <a href="./index.html#pricing">here</a>.`;
        planInput.value = "No plan selected";
    }

    console.log("✅ Plan set to:", planInput.value);
}

class FormValidator {
    constructor(form) {
        this.form = form;
        // Exclude the hidden token field Turnstile injects into the form
        this.inputs = form.querySelectorAll(
            'input:not([name="cf-turnstile-response"])'
        );
        this.init();
    }

    init() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent form submission by default
            const confirmationMessage = document.getElementById(
                "confirmation-message"
            );
            if (this.validateForm()) {
                console.log("Form is valid!");
                confirmationMessage.classList.remove("hidden");
                this.submitForm();
            } else {
                console.log("Form has errors.");
                confirmationMessage.classList.add("hidden");
            }
        });
    }

    validateForm() {
        const invalidFields = [];
        this.inputs.forEach((input) => {
            if (!this.validateField(input)) invalidFields.push(input.id);
        });
        if (invalidFields.length > 0)
            track("sign_up_form_invalid", { invalid_fields: invalidFields });
        return invalidFields.length === 0;
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        // Validate First Name
        if (input.id === "first-name" && (value === "" || value.length < 3)) {
            this.showError(input, "First name must be at least 3 characters.");
            return false;
        }
        // Validate Last Name
        if (input.id === "last-name" && (value === "" || value.length < 3)) {
            this.showError(input, "Last name must be at least 3 characters.");
            return false;
        }
        // Validate Email
        if (type === "email" && !validator.isEmail(value)) {
            this.showError(input, "Please enter a valid email address.");
            return false;
        }
        // Validate Fleet Size
        if (
            input.id === "fleet-size" &&
            value !== "" &&
            !validator.isInt(value, { min: 1 })
        ) {
            this.showError(input, "Please enter a valid number of trucks.");
            return false;
        }
        // Validate Trailer Type
        if (input.id === "trailer-type" && value === "") {
            this.showError(input, "Please enter the type of trailer.");
            return false;
        }
        // Validate Plan Selection
        if (
            input.id === "plan-input" &&
            (value === "" || value === "No plan selected")
        ) {
            this.showError(input, "Please select a pricing plan.");
            return false;
        }
        // Clear error if validation passes
        this.hideError(input);
        return true;
    }

    showError(input, message) {
        const errorElement = this.form.querySelector(
            `.error-message[data-error-for="${input.id}"]`
        );
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add("show-error");
            input.style.borderColor = "red";
        } else {
            console.warn(`Error element not found for input: ${input.id}`);
        }
    }

    hideError(input) {
        const errorElement = this.form.querySelector(
            `.error-message[data-error-for="${input.id}"]`
        );
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.remove("show-error");
            input.style.borderColor = "";
        } else {
            console.warn(`Error element not found for input: ${input.id}`);
        }
    }

    async submitForm() {
        const jsonObject = {
            firstName: document.getElementById("first-name").value,
            lastName: document.getElementById("last-name").value,
            email: document.getElementById("e-mail").value,
            phone: document.getElementById("tel").value,
            fleetSize: document.getElementById("fleet-size").value,
            trailerType: document.getElementById("trailer-type").value,
            plan: document.getElementById("plan-input").value,
        };

        const signUpButton = document.querySelector(".primary-cta");
        const confirmationMessage = document.getElementById(
            "confirmation-message"
        );
        // Disable the button to prevent multiple clicks
        signUpButton.disabled = true;
        confirmationMessage.innerText = "Submitting...";
        console.log("📩 Submitting Form Data:", jsonObject);

        try {
            const turnstileToken = getTurnstileToken(this.form);
            if (!turnstileToken) throw new Error(TURNSTILE_PENDING_MESSAGE);

            const response = await fetch(
                "https://api.iron-wing-dispatching.com/sign-up-forms",
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
            console.log("Form successfully submitted!", data);

            signUpButton.classList.add("hidden");
            confirmationMessage.classList.remove("hidden");
            confirmationMessage.innerText =
                "✅ Submission successful! We'll contact you soon.";

            // Push event to GTM
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "form_submission",
                form_url: window.location.href,
            });
            console.log("📊 GTM Event Pushed: form_submission");

            identifyVisitor(jsonObject.email, {
                first_name: jsonObject.firstName,
                last_name: jsonObject.lastName,
                fleet_size: jsonObject.fleetSize,
                trailer_type: jsonObject.trailerType,
                plan: jsonObject.plan,
            });
            track("sign_up_form_submitted", {
                plan: jsonObject.plan,
                fleet_size: Number(jsonObject.fleetSize) || null,
                trailer_type: jsonObject.trailerType,
                has_phone: Boolean(jsonObject.phone.trim()),
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            const reason =
                error instanceof TurnstileError
                    ? "turnstile"
                    : error.message === TURNSTILE_PENDING_MESSAGE
                      ? "turnstile_pending"
                      : "server";
            track("sign_up_form_failed", { reason, plan: jsonObject.plan });
            if (reason === "server") trackError(error, { form: "sign_up" });
            confirmationMessage.innerText = `⚠️ ${error.message || "Server error. Please try again later."}`;
        } finally {
            resetTurnstile(this.form);
            signUpButton.disabled = false;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sign-Up Page JS Loaded");
    pricingChoice();
    // Select the form and initialize the FormValidator
    const form = document.querySelector("#sign-up-form");
    new FormValidator(form);
});
