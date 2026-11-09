//src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    reviewer: z.string().optional(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    tags: z.array(z.string()).default([]),
    schemaType: z
      .enum(["Article", "HowTo", "FAQPage", "MedicalWebPage"])
      .default("Article"),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    shortBio: z.string(),
    bio: z.string(),
    credentials: z.array(z.string()).default([]),
    alumniOf: z.array(z.string()).default([]),
    knowsAbout: z.array(z.string()).default([]),
    avatar: z.string(),
    sameAs: z.array(z.string().url()).default([]),
  }),
});

export const collections = { blog, authors };
