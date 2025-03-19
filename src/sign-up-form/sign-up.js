// sign-up.js contains form validation
import "../normalize.css";
import "../shared.css";
import "./sign-up.css";
import validator from "validator";

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
        this.inputs = form.querySelectorAll("input");
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
        let isValid = true;
        this.inputs.forEach((input) => {
            if (!this.validateField(input)) isValid = false;
        });
        return isValid;
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
            const response = await fetch(
                "https://api.iron-wing-dispatching.com/sign-up-forms",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jsonObject),
                }
            );

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
        } catch (error) {
            console.error("Error submitting form:", error);
            confirmationMessage.innerText = `⚠️ ${error.message || "Server error. Please try again later."}`;
        } finally {
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
