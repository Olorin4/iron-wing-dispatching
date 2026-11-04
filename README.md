# Iron Wing Dispatching

The source code belongs to Iron Wing Logistics LLC and is shared with its permission.

The website of **Iron Wing Dispatching**, a US-based truck dispatching agency: a landing page plus sign-up, blog, privacy policy and terms pages. It is a static site built with [Astro](https://astro.build). Forms post to the separate `iwd-backend` API.

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
7. **Terms and Privacy Pages**
8. **Web Vitals Integration**

---

## Tech Stack

-   **Framework**: Astro 6 (static output), vanilla JavaScript, plain CSS
-   **Libraries**: `validator`, `web-vitals`
-   **Hosting**: Cloudflare, which builds automatically on every push to GitHub
-   **Node.js**: 22.12 or later (`.node-version` pins 22 for the Cloudflare build)

---

## Commands

```sh
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Images and fonts live in `src/assets` and are published unchanged at `/assets/...`.
Page URLs keep the `.html` form, such as `/blog.html` and `/sign-up.html`.

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

The Outreach app writes articles in exactly this format, builds the site with
`npm run build`, and checks `dist/blog/<slug>.html`. Keep the front-matter
fields, the `src/blog/articles` folder, the `src/assets/images` folder, the
`dist` output directory, and the `article-body` class unchanged, or update
Outreach's site adapter at the same time.

Run `npm run build` (Node.js 22.12 or later). The build creates `blog.html`, a
permanent page at `/blog/<slug>.html`, `/rss.xml`, and sitemap entries. A
missing field, a duplicate slug, or a missing image fails the build. Keep a
published slug unchanged to preserve its URL. Public article and image URLs use
`https://iron-wing-dispatching.com` by default; set `SITE_URL` to the public
origin when building for another host.
