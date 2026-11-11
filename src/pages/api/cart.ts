// src/pages/api/cart.ts
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { variantIds } = (await request.json()) as { variantIds: number[] };
    if (!variantIds || variantIds.length === 0)
      return new Response(JSON.stringify([]), { status: 200 });

    const placeholders = variantIds.map(() => "?").join(",");
    const query = `
      SELECT v.id as variant_id, v.name as variant_name, v.price_cents, p.name as product_name, p.image_url 
      FROM product_variants v 
      JOIN products p ON v.product_id = p.id 
      WHERE v.id IN (${placeholders})
    `;

    const { results } = await env.redsurge_shop
      .prepare(query)
      .bind(...variantIds)
      .all();
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
