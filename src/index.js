import "./normalize.css";
import "./shared.css";
import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector("nav");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});

// TO DO:
// - add a chatbot
// - add more contact forms in the homepage
//
//
//
//
//
//
//
