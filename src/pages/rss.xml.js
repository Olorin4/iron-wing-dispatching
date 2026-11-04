import fs from "node:fs";
import path from "node:path";
import {
    loadArticles,
    articleUrl,
    escapeXml,
    siteUrl,
} from "../lib/articles.js";

const imageType = (image) =>
    /\.png$/i.test(image)
        ? "image/png"
        : /\.jpe?g$/i.test(image)
          ? "image/jpeg"
          : "image/webp";

export async function GET() {
    const articles = await loadArticles();
    const items = articles
        .map((a) => {
            const size = fs.statSync(path.join("src", a.image.slice(1))).size;
            const published = new Date(`${a.date}T00:00:00Z`).toUTCString();
            return `<item><title>${escapeXml(a.title)}</title><link>${escapeXml(articleUrl(a))}</link><guid isPermaLink="true">${escapeXml(articleUrl(a))}</guid><pubDate>${published}</pubDate><description>${escapeXml(a.description)}</description><enclosure url="${escapeXml(siteUrl + a.image)}" length="${size}" type="${imageType(a.image)}" /></item>`;
        })
        .join("\n");
    const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Iron Wing Dispatching Blog</title><link>${escapeXml(siteUrl)}/blog.html</link><description>Trucking insights from Iron Wing Dispatching.</description>${items}</channel></rss>`;
    return new Response(rss, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
}
