# Iron Wing Dispatching

The source code belongs to Iron Wing Logistics LLC and is shared with its permission.

A single-page (plus sign-up and blog) web application designed **Iron Wing Dispatching**, a US-based truck dispatching agecy. It demonstrates front-end development, basic form handling, and a simple back-end server with Node.js and Express.

## Table of Contents

1. [Current Features](#current-features)
2. [Tech Stack](#tech-stack)
3. [Lessons Learned](#lessons-learned)

---

## Current Features

1. **Responsive Landing Page**
2. **Services Section**
3. **Pricing Section**
4. **About Section**
5. **Contact/Sign-up Form**
6. **Blog Page**
7. **Node.js/Express Server**
8. **Web Vitals Integration**

---

## Tech Stack

-   **Front-end**: HTML5, CSS3, JavaScript (vanilla)
-   **Back-end**: Node.js & Express
-   **Tools / Libraries**: `validator`, `web-vitals`

---

## Lessons Learned

-   Modular CSS/JS organization.
-   Client-side validation.
-   Web Vitals for performance insights.
-   Simple Node/Express server setups.

---

## Publishing blog articles

Articles live in `src/blog/articles/` as Markdown files with YAML front matter.
To add an article, create a `.md` file with `title`, a unique lowercase `slug`,
a quoted `date` in `YYYY-MM-DD` format, `description`, `image`, and `imageAlt`.
Put the featured image in `src/assets/images/` and set `image` to its public
path, such as `/assets/images/example.webp`. Use a PNG, JPEG, or WebP image.
The text after the front matter is the article body.

Run `npm run build` (Node.js 18 or later). The build creates `blog.html`, a
permanent page at `/blog/<slug>.html`, `/rss.xml`, article metadata, and sitemap
entries. Keep a published slug unchanged to preserve its URL. Public article
and image URLs use `https://iron-wing-dispatching.com` by default; set `SITE_URL`
to the public origin when building for another host. Publish the generated
`dist` directory to make the pages, feed, and image URLs publicly accessible.
