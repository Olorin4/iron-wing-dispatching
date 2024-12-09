import "../normalize.css";
import "../styles.css";
import "./sign-up.css";

let form = document.querySelector("form");
let inputs = document.querySelectorAll("input");
let errorMessages = document.querySelectorAll("span");
let password1 = document.querySelector("#password");
let password2 = document.querySelector("#confirm-pwd");
let passwordError = document.querySelector(".password :last-child");

function showError(element, input, message) {
    element.textContent = message;
    element.classList.add("show-error");
    input.style.cssText = "border-color: red";
}

function hideError(element, input) {
    element.textContent = "";
    element.classList.remove("show-error");
    input.style.cssText = "";
}

function validateInputs() {
    let isValid = true;
    inputs.forEach(function (input, index) {
        if (!input.checkValidity()) {
            showError(errorMessages[index], input, "* This field is required");
            isValid = false;
        } else hideError(errorMessages[index], input);
    });
    return isValid;
}

function validatePasswords() {
    let isValid = true;
    if (password1.value !== password2.value) {
        showError(passwordError, password1, "* Passwords do not match");
        isValid = false;
    } else if (password1.value !== "") hideError(passwordError, password1);
    return isValid;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sign-Up Page JS Loaded");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents form submission
        let isInputsValid = validateInputs();
        let isPasswordsValid = validatePasswords();
        if (isInputsValid && isPasswordsValid) form.submit();
        else form.classList.add("show-error");
    });
});

// Add functionality for showing and hiding the passwords with an eye icon
