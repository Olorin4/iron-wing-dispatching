import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

const articlesDir = path.join("src", "blog", "articles");

export const siteUrl = (
    process.env.SITE_URL || "https://iron-wing-dispatching.com"
).replace(/\/$/, "");

export const articleUrl = (article) => `${siteUrl}/blog/${article.slug}.html`;

export const escapeXml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export function formatDate(article) {
    return new Date(`${article.date}T00:00:00Z`).toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Returns articles newest first. Fails the build on duplicate slugs, because
// the content loader would otherwise silently keep only one of them.
export async function loadArticles() {
    const entries = await getCollection("articles");
    const files = fs
        .readdirSync(articlesDir)
        .filter((name) => name.endsWith(".md"));
    if (files.length !== entries.length)
        throw new Error("Articles must have unique slugs");
    return entries
        .map((entry) => ({ ...entry.data, entry }))
        .sort(
            (a, b) =>
                b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
        );
}
