import "../normalize.css";
import "../shared.css";
import "../privacy-policy/privacy-policy.css";
import "./terms.css";
import { handleNewsletterSignup } from "../newsletter";

document.addEventListener("DOMContentLoaded", () => {
    handleNewsletterSignup();
});
