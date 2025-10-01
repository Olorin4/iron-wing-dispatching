// Cloudflare Worker for handling form submissions from Iron Wing Dispatching
// Deploy this to Cloudflare Workers, bound to https://api.iron-wing-dispatching.com/*
// Routes: POST /contact-forms and POST /sign-up-forms
// Revised: Direct to Zoho webhook only, no email forwarding via Mailchannels

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    const body = await request.json();
    // Placeholder for reCAPTCHA verification (skipped for now)
    // const recaptchaToken = body['g-recaptcha-response'];
    // If reCAPTCHA enabled later, add verification here

    // Delete recaptcha from body if present
    delete body['g-recaptcha-response'];

    let successResponse = { message: 'Form submitted successfully' };

    if (path === '/contact-forms') {
      // Handle contact form: forward to Zoho webhook
      await sendToZohoWebhook(body, 'Contact_Lead'); // Adjust module as needed
    } else if (path === '/sign-up-forms') {
      // Handle sign-up form: forward to Zoho webhook
      await sendToZohoWebhook(body, 'Leads'); // Zoho CRM Leads module
    } else if (path === '/newsletter') {
      // Handle newsletter signup: forward to Zoho
      await sendToZohoWebhook(body, 'Newsletter_Subscribers'); // Or Leads with source 'Newsletter'
    } else {
      return new Response('Endpoint not found', { status: 404 });
    }

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Worker error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Function to forward to Zoho webhook/API
// Replace 'YOUR_ZOHO_WEBHOOK_URL' with actual webhook URL from Zoho CRM (Setup > Automation > Workflows > Webhooks)
async function sendToZohoWebhook(formData, module) {
  // Map form fields to Zoho Leads (adjust as needed for your Zoho setup)
  const zohoPayload = {
    data: [
      {
        Company: formData.trailerType || 'Trucking Business',
        Last_Name: formData.lastName || formData.email.split('@')[0],
        First_Name: formData.firstName || 'Subscriber',
        Email: formData.email,
        Phone: formData.phone,
        Description: `Source: ${module}. Details: ${JSON.stringify(formData)}`,
        Lead_Source: module === 'Leads' ? 'Website Sign-Up' : module === 'Contact_Lead' ? 'Website Contact' : 'Newsletter Signup'
      }
    ]
  };

  // POST to Zoho webhook URL
  await fetch('YOUR_ZOHO_WEBHOOK_URL', { // Replace with your Zoho webhook URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // If webhook requires auth, add: 'Authorization': 'Zoho-oauthtoken YOUR_TOKEN'
    },
    body: JSON.stringify(zohoPayload)
  });
}