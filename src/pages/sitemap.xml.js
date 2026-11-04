import {
    loadArticles,
    articleUrl,
    escapeXml,
    siteUrl,
} from "../lib/articles.js";

const pages = [
    { path: "/", lastmod: "2025-02-12", priority: "1.0" },
    { path: "/sign-up.html", lastmod: "2025-02-12", priority: "0.8" },
    { path: "/blog.html", lastmod: "2025-02-12", priority: "0.8" },
    { path: "/privacy-policy.html", lastmod: "2026-11-04", priority: "0.5" },
    { path: "/terms.html", lastmod: "2026-11-04", priority: "0.5" },
];

export async function GET() {
    const articles = await loadArticles();
    const staticUrls = pages
        .map(
            (p) =>
                `   <url>\n      <loc>${escapeXml(siteUrl + p.path)}</loc>\n      <lastmod>${p.lastmod}</lastmod>\n      <priority>${p.priority}</priority>\n   </url>`
        )
        .join("\n");
    const articleUrls = articles
        .map((a) => `<url><loc>${escapeXml(articleUrl(a))}</loc></url>`)
        .join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${articleUrls}\n</urlset>`;
    return new Response(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}
