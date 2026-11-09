import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const sitemapUrl = new URL("/sitemap-index.xml", import.meta.env.SITE);
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`.trim();

  return new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
