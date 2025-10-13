import "../normalize.css";
import "../shared.css";
import "./privacy-policy.css";
import { handleNewsletterSignup } from "../newsletter";

document.addEventListener("DOMContentLoaded", () => {
    handleNewsletterSignup();
});
