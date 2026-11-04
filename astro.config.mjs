import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// SITE_URL lets the Outreach article workflow build against another origin.
const site = (
    process.env.SITE_URL || "https://iron-wing-dispatching.com"
).replace(/\/$/, "");

const assetsDir = path.resolve("src/assets");
const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".otf": "font/otf",
};

// Images and fonts live in src/assets and are published unchanged at
// /assets/... so existing image URLs, RSS enclosures and the Outreach article
// workflow keep working.
function publishAssets() {
    return {
        name: "publish-assets",
        hooks: {
            "astro:server:setup": ({ server }) => {
                server.middlewares.use("/assets", (req, res, next) => {
                    const requested = decodeURIComponent(
                        new URL(req.url, "http://localhost").pathname
                    );
                    const file = path.join(assetsDir, requested);
                    if (
                        !file.startsWith(assetsDir + path.sep) ||
                        !fs.existsSync(file) ||
                        !fs.statSync(file).isFile()
                    )
                        return next();
                    res.setHeader(
                        "Content-Type",
                        mimeTypes[path.extname(file).toLowerCase()] ||
                            "application/octet-stream"
                    );
                    fs.createReadStream(file).pipe(res);
                });
            },
            "astro:build:done": async ({ dir }) => {
                await fs.promises.cp(
                    assetsDir,
                    path.join(fileURLToPath(dir), "assets"),
                    { recursive: true }
                );
            },
        },
    };
}

export default defineConfig({
    site,
    output: "static",
    // Keep the existing URLs: /blog.html, /blog/<slug>.html, /sign-up.html ...
    build: { format: "file", inlineStylesheets: "never" },
    trailingSlash: "ignore",
    devToolbar: { enabled: false },
    // Render Markdown the way the previous generator did: no typographic quotes.
    markdown: { processor: unified({ smartypants: false }) },
    integrations: [publishAssets()],
});
