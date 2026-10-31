import "../normalize.css";
import "../shared.css";
import "./blog.css";
import { handleNewsletterSignup } from "../newsletter";

document.addEventListener("DOMContentLoaded", () => {
    handleNewsletterSignup();
});
