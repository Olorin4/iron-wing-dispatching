// sign-up.js contains form validation
import "../normalize.css";
import "../styles.css";
import "./sign-up.css";

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputs = document.querySelectorAll("input");
    const errorMessages = document.querySelectorAll("span");
    const password1 = document.querySelector("#password");
    const password2 = document.querySelector("#confirm-pwd");
    const passwordError = document.querySelector(".password :last-child");

    // Function: Show Error Message
    const showError = (element, input, message) => {
        element.textContent = message;
        element.classList.add("show-error");
        input.style.borderColor = "red";
    };

    // Function: Hide Error Message
    const hideError = (element, input) => {
        element.textContent = "";
        element.classList.remove("show-error");
        input.style.borderColor = "";
    };

    // Function: Validate Individual Input Fields
    const validateInputs = () => {
        let isValid = true;
        inputs.forEach((input, index) => {
            // Custom error messages for specific input types
            if (input.type === "email" && !input.checkValidity()) {
                showError(
                    errorMessages[index],
                    input,
                    "* Please enter a valid email address"
                );
                isValid = false;
            } else if (input.type === "tel" && !input.checkValidity()) {
                showError(
                    errorMessages[index],
                    input,
                    "* Please enter a valid telephone number (e.g., +1234567890)"
                );
                isValid = false;
            } else if (
                input.type === "text" &&
                input.id === "name" &&
                !input.checkValidity()
            ) {
                showError(
                    errorMessages[index],
                    input,
                    "* Name must be between 2 and 50 characters"
                );
                isValid = false;
            } else if (!input.checkValidity()) {
                showError(
                    errorMessages[index],
                    input,
                    "* This field is required"
                );
                isValid = false;
            } else hideError(errorMessages[index], input);
        });
        return isValid;
    };

    // Function: Validate Passwords
    const validatePasswords = () => {
        let isValid = true;
        // Password Strength Validation
        const passwordStrengthRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordStrengthRegex.test(password1.value)) {
            showError(
                passwordError,
                password1,
                "* Password must include uppercase, lowercase, number, and special character"
            );
            isValid = false;
        } else if (password1.value !== password2.value) {
            showError(passwordError, password2, "* Passwords do not match");
            isValid = false;
        } else if (password1.value !== "") hideError(passwordError, password1);
        return isValid;
    };

    // Add Real-Time Validation
    const addRealTimeValidation = () => {
        inputs.forEach((input, index) => {
            input.addEventListener("input", () => {
                if (input.checkValidity())
                    hideError(errorMessages[index], input);
                else {
                    showError(
                        errorMessages[index],
                        input,
                        input.validationMessage || "* Please correct this field"
                    );
                }
            });
        });

        // Real-time validation for passwords
        password2.addEventListener("input", () => {
            if (password1.value !== password2.value)
                showError(passwordError, password2, "* Passwords do not match");
            else hideError(passwordError, password2);
        });
    };

    // Form Submit Event Listener
    const handleFormSubmit = (event) => {
        event.preventDefault(); // Prevents form submission

        const isInputsValid = validateInputs();
        const isPasswordsValid = validatePasswords();
        if (isInputsValid && isPasswordsValid)
            form.submit(); // Submit the form if all validations pass
        else form.classList.add("show-error");
    };

    // Initialize Form Validation
    const init = () => {
        console.log("Sign-Up Page JS Loaded");
        form.addEventListener("submit", handleFormSubmit);
        addRealTimeValidation(); // Enable real-time feedback
    };

    init();
});
