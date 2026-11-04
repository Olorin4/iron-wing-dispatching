import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import fs from "node:fs";
import path from "node:path";

const nonEmpty = z.string().trim().min(1);

// Front-matter contract shared with the Outreach article workflow. Do not
// loosen it without updating Outreach's site adapter.
const articles = defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/blog/articles" }),
    schema: z.object({
        title: nonEmpty,
        slug: nonEmpty.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalid slug"),
        date: nonEmpty
            .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
            .refine(
                (value) =>
                    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) ===
                    value,
                "invalid date"
            ),
        description: nonEmpty,
        image: nonEmpty
            .regex(
                /^\/assets\/images\/[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i,
                "image must be a local /assets/images path"
            )
            .refine(
                (value) =>
                    fs.existsSync(path.join("src", value.slice(1))),
                "image must refer to an existing local image"
            ),
        imageAlt: nonEmpty,
    }),
});

export const collections = { articles };
