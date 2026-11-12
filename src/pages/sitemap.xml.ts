// src/pages/sitemap.xml.ts
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { env } from "cloudflare:workers";

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  const siteUrl = "https://redsurgefitness.com";

  // 1. AUTOMATICALLY FIND ALL STATIC PAGES
  const pages = import.meta.glob("../pages/**/*.astro");

  const staticUrls: SitemapEntry[] = Object.keys(pages)
    .map((path) => {
      // Vite returns paths like "./about.astro" or "../pages/blog/index.astro"
      // We use Regex to cleanly remove any leading paths and the extension
      let url = path
        .replace(/^\.\//, "") // Removes "./" at the start
        .replace(/^\.\.\/pages\//, "") // Removes "../pages/" at the start
        .replace(/^\/src\/pages\//, "") // Removes "/src/pages/" if absolute
        .replace(/\.astro$/, ""); // Removes ".astro" at the end

      // Ignore API routes, dynamic routes, and transactional pages
      if (
        url.includes("[") ||
        url.startsWith("api/") ||
        url.includes("cart") ||
        url.includes("success")
      ) {
        return null;
      }

      // Handle index files (index.astro -> "", blog/index.astro -> blog)
      if (url === "index") url = "";
      if (url.endsWith("/index")) url = url.replace("/index", "");

      return {
        loc: url === "" ? siteUrl : `${siteUrl}/${url}`,
        changefreq: "weekly",
        priority: url === "" ? 1.0 : 0.8,
      };
    })
    .filter((entry): entry is SitemapEntry => entry !== null);

  // 2. DYNAMIC BLOG POSTS
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const blogUrls: SitemapEntry[] = posts.map((post) => ({
    loc: `${siteUrl}/blog/${post.id}/`,
    changefreq: "monthly",
    priority: 0.7,
    lastmod: post.data.pubDate.toISOString(),
  }));

  // 3. DYNAMIC SHOP PRODUCTS
  const { results: products } = await env.redsurge_shop
    .prepare("SELECT slug FROM products")
    .all<{ slug: string }>();

  const shopUrls: SitemapEntry[] = products.map((product) => ({
    loc: `${siteUrl}/shop/${product.slug}/`,
    changefreq: "weekly",
    priority: 0.9,
  }));

  // 4. COMBINE EVERYTHING
  const allUrls = [...staticUrls, ...blogUrls, ...shopUrls];

  // 5. GENERATE XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
};
