// src/pages/api/webhook.ts
import type { APIRoute } from "astro";
import Stripe from "stripe";
import { env } from "cloudflare:workers";

export const POST: APIRoute = async ({ request }) => {
  const stripeSecretKey = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return new Response("Stripe keys missing", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Use constructEventAsync for Cloudflare Workers
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // THIS IS WHERE YOU FULFILL THE ORDER
    console.log("💰 Payment successful for session:", session.id);
    console.log("Customer email:", session.customer_details?.email);
    // In the future, you can save this order to D1, send an email, etc.
  }

  return new Response("OK", { status: 200 });
};
