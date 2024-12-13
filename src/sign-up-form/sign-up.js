// sign-up.js contains form validation
import "../normalize.css";
import "../shared.css";
import "./sign-up.css";
import validator from "validator";

export class FormValidator {
    constructor(form) {
        this.form = form;
        this.inputs = form.querySelectorAll("input");
        this.init();
    }

    init() {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent form submission by default
            if (this.validateForm()) {
                console.log("Form is valid!");
                this.form.submit(); // Programmatically submit if valid
            } else console.log("Form has errors.");
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
        if (
            input.id === "fleet-size" &&
            value !== "" &&
            !validator.isInt(value, { min: 1 })
        ) {
            this.showError(input, "Please enter a valid number of trucks.");
            return false;
        } else if (input.id === "trailer-type" && value === "") {
            this.showError(input, "Please enter the type of trailer.");
            return false;
        } else if (type === "email" && !validator.isEmail(value)) {
            this.showError(input, "Please enter a valid email address.");
            return false;
        } else if (type === "text" && value === "") {
            this.showError(input, "This field is required.");
            return false;
        }
        this.hideError(input);
        return true;
    }

    showError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        errorElement.classList.add("show-error");
        input.style.borderColor = "red";
    }

    hideError(input) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = "";
        errorElement.classList.remove("show-error");
        input.style.borderColor = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sign-Up Page JS Loaded");
    // Select the form and initialize the FormValidator
    const form = document.querySelector("#sign-up-form");
    new FormValidator(form);
});
