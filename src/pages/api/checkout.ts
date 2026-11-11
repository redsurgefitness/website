// src/pages/api/checkout.ts
import type { APIRoute } from "astro";
import Stripe from "stripe";
import { env } from "cloudflare:workers";

interface CartItem {
  variantId: number;
  quantity: number;
}

interface VariantResult {
  id: number;
  stripe_price_id: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as { cart: CartItem[] };
    const { cart } = body;

    if (!cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
      });
    }

    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: "Stripe key missing" }), {
        status: 500,
      });
    }

    const stripe = new Stripe(stripeSecretKey);

    const variantIds = cart.map((item) => item.variantId);
    const placeholders = variantIds.map(() => "?").join(",");
    const query = `SELECT id, stripe_price_id FROM product_variants WHERE id IN (${placeholders})`;

    const { results } = await env.redsurge_shop
      .prepare(query)
      .bind(...variantIds)
      .all<VariantResult>();

    const lineItems = cart.map((cartItem) => {
      const variant = results.find((v) => v.id === cartItem.variantId);
      if (!variant)
        throw new Error(`Variant ${cartItem.variantId} not found in database`);

      return {
        price: variant.stripe_price_id,
        quantity: cartItem.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${new URL(request.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/cart`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    // This will log the exact error to your terminal
    console.error("Checkout Error:", error.message);

    // This returns a JSON error to the browser instead of an HTML page
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
