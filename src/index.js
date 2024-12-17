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
// - Fix Cumulative Layout Shift
// - add a second sales-pitch and two small images, one on the left of the 1st sales pitch, another on the right of the 2nd one.
// - add a chatbot
// - add more contact forms in the homepage
// - Add a smaller contact form prompt on he side of the sales pitch, to catch undecided clients.
// - Add hover effects to the nav menu and the chat bot
// - Fix responsiveness of sign up html
// - Flesh out blog
