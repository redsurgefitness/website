// src/pages/proxytown/ga.ts
export async function GET() {
  const response = await fetch("https://www.google-analytics.com/analytics.js");
  const body = await response.text();

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
