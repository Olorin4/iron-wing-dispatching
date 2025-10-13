export function handleNewsletterSignup() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("newsletter-email").value;

            if (!email.trim()) {
                alert("Please enter your email.");
                return;
            }

            const jsonObject = {
                email: email,
                type: "newsletter",
                // Placeholder for reCAPTCHA token
                // recaptchaToken: token,
            };

            console.log("📩 Submitting Newsletter Signup:", jsonObject);

            try {
                const response = await fetch(
                    "https://api.iron-wing-dispatching.com/newsletter",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(jsonObject),
                    }
                );

                if (!response.ok)
                    throw new Error(`Server responded with ${response.status}`);

                const data = await response.json();
                console.log("✅ Newsletter signup successful!", data);
                alert("Thank you for subscribing! Check your email for confirmation.");
                newsletterForm.reset();

                // Push event to GTM
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "newsletter_subscription",
                    form_id: "newsletter-form",
                    form_url: window.location.href,
                });
                console.log("📊 GTM Event Pushed: newsletter_subscription");
            } catch (error) {
                console.error("❌ Error submitting newsletter signup:", error);
                alert("Error subscribing. Please try again later.");
            }
        });
    }
}