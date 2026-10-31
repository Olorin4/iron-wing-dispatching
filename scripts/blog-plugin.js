const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const root = path.resolve(__dirname, "..");
const articlesDir = path.join(root, "src/blog/articles");
const site = (
    process.env.SITE_URL || "https://iron-wing-dispatching.com"
).replace(/\/$/, "");
const escape = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
const articleUrl = (article) => `${site}/blog/${article.slug}.html`;

function loadArticles() {
    const seen = new Set();
    return fs
        .readdirSync(articlesDir)
        .filter((name) => name.endsWith(".md"))
        .map((name) => {
            const { data, content } = matter(
                fs.readFileSync(path.join(articlesDir, name), "utf8")
            );
            for (const field of [
                "title",
                "slug",
                "date",
                "description",
                "image",
                "imageAlt",
            ]) {
                if (typeof data[field] !== "string" || !data[field].trim())
                    throw new Error(
                        `${name}: ${field} must be a non-empty string`
                    );
            }
            if (
                !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) ||
                seen.has(data.slug)
            )
                throw new Error(`${name}: invalid or duplicate slug`);
            seen.add(data.slug);
            const date = new Date(`${data.date}T00:00:00Z`);
            if (
                !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
                Number.isNaN(date.valueOf()) ||
                date.toISOString().slice(0, 10) !== data.date
            )
                throw new Error(`${name}: invalid date`);
            if (
                !/^\/assets\/images\/[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(
                    data.image
                ) ||
                !fs.existsSync(path.join(root, "src", data.image.slice(1)))
            )
                throw new Error(
                    `${name}: image must refer to an existing local image`
                );
            return {
                ...data,
                content,
                published: date,
                html: marked.parse(content),
            };
        })
        .sort(
            (a, b) =>
                b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
        );
}

function meta(article) {
    const url = articleUrl(article);
    const image = site + article.image;
    return `<title>${escape(article.title)} | Iron Wing Dispatching</title>
<meta name="description" content="${escape(article.description)}">
<link rel="canonical" href="${escape(url)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escape(article.title)}">
<meta property="og:description" content="${escape(article.description)}">
<meta property="og:url" content="${escape(url)}">
<meta property="og:image" content="${escape(image)}">
<meta property="og:image:alt" content="${escape(article.imageAlt)}">
<meta property="article:published_time" content="${article.date}T00:00:00Z">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(article.title)}">
<meta name="twitter:description" content="${escape(article.description)}">
<meta name="twitter:image" content="${escape(image)}">`;
}

class BlogPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap("BlogPlugin", (compilation) => {
            compilation.contextDependencies.add(articlesDir);
            for (const name of fs
                .readdirSync(articlesDir)
                .filter((file) => file.endsWith(".md"))) {
                compilation.fileDependencies.add(path.join(articlesDir, name));
            }
            compilation.hooks.processAssets.tap(
                {
                    name: "BlogPlugin",
                    stage: compiler.webpack.Compilation
                        .PROCESS_ASSETS_STAGE_REPORT,
                },
                () => {
                    const articles = loadArticles();
                    const blog = compilation.getAsset("blog.html");
                    if (!blog) throw new Error("Missing blog.html template");
                    const template = blog.source.source().toString();
                    const marker = '<div id="blog-articles-placeholder"></div>';
                    if (!template.includes(marker))
                        throw new Error("Missing blog article placeholder");
                    const feedLink = `<link rel="alternate" type="application/rss+xml" title="Iron Wing Dispatching Blog" href="${escape(site)}/rss.xml">`;
                    const index = articles
                        .map(
                            (a) =>
                                `<article><h2><a href="./blog/${escape(a.slug)}.html">${escape(a.title)}</a></h2><div class="article-meta"><time datetime="${a.date}">${escape(a.published.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" }))}</time></div><p>${escape(a.description)}</p><a href="./blog/${escape(a.slug)}.html">Read article</a></article>`
                        )
                        .join("\n");
                    const indexHtml = template
                        .replace(marker, () => index)
                        .replace(
                            "</head>",
                            `<link rel="canonical" href="${escape(site)}/blog.html">${feedLink}</head>`
                        );
                    compilation.updateAsset(
                        "blog.html",
                        new compiler.webpack.sources.RawSource(indexHtml)
                    );
                    for (const a of articles) {
                        const content = `<article><h1>${escape(a.title)}</h1><div class="article-meta"><time datetime="${a.date}">${escape(a.published.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" }))}</time></div><img class="featured-image" src="${escape(a.image)}" alt="${escape(a.imageAlt)}"><div class="article-body">${a.html}</div><p><a href="/blog.html">Back to blog</a></p></article>`;
                        let page = template
                            .replace(marker, () => content)
                            .replace(/<h1>Blog<\/h1>/, "");
                        page = page
                            .replace(/<title>.*?<\/title>/i, "")
                            .replace(/<meta name="description"[^>]*>/i, "")
                            .replace(
                                "</head>",
                                `<base href="/">${meta(a)}${feedLink}</head>`
                            );
                        compilation.emitAsset(
                            `blog/${a.slug}.html`,
                            new compiler.webpack.sources.RawSource(page)
                        );
                    }
                    const items = articles
                        .map(
                            (a) =>
                                `<item><title>${escape(a.title)}</title><link>${escape(articleUrl(a))}</link><guid isPermaLink="true">${escape(articleUrl(a))}</guid><pubDate>${a.published.toUTCString()}</pubDate><description>${escape(a.description)}</description><enclosure url="${escape(site + a.image)}" length="${fs.statSync(path.join(root, "src", a.image.slice(1))).size}" type="${/\.png$/i.test(a.image) ? "image/png" : /\.jpe?g$/i.test(a.image) ? "image/jpeg" : "image/webp"}" /></item>`
                        )
                        .join("\n");
                    const rss = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Iron Wing Dispatching Blog</title><link>${escape(site)}/blog.html</link><description>Trucking insights from Iron Wing Dispatching.</description>${items}</channel></rss>`;
                    compilation.emitAsset(
                        "rss.xml",
                        new compiler.webpack.sources.RawSource(rss)
                    );
                    const sitemap = compilation.getAsset("sitemap.xml");
                    if (sitemap)
                        compilation.updateAsset(
                            "sitemap.xml",
                            new compiler.webpack.sources.RawSource(
                                sitemap.source
                                    .source()
                                    .toString()
                                    .replaceAll(
                                        "https://iron-wing-dispatching.com",
                                        escape(site)
                                    )
                                    .replace(
                                        "</urlset>",
                                        articles
                                            .map(
                                                (a) =>
                                                    `<url><loc>${escape(articleUrl(a))}</loc></url>`
                                            )
                                            .join("\n") + "\n</urlset>"
                                    )
                            )
                        );
                }
            );
        });
    }
}
module.exports = BlogPlugin;
