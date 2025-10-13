import '../normalize.css';
import '../shared.css';
import './blog.css';
import { handleNewsletterSignup } from "../newsletter";

document.addEventListener('DOMContentLoaded', function() {
    handleNewsletterSignup();
    // Get all read more buttons
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    // Add click event listener to each button
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the article content
            const article = this.closest('article');
            const content = article.querySelector('.article-content');
            const chevronIcon = this.querySelector('.chevron-icon');
            
            // Toggle the expanded class
            content.classList.toggle('expanded');
            
            // Change button text and rotate chevron based on state
            if (content.classList.contains('expanded')) {
                this.innerHTML = 'Read Less <img src="../assets/images/chevron-down.svg" alt="Read less blog article" class="chevron-icon rotated" />';
            } else {
                this.innerHTML = 'Read More <img src="../assets/images/chevron-down.svg" alt="Read more blog article" class="chevron-icon" />';
            }
        });
    });
});
