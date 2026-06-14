// Netlify serverless function: create a Stripe Checkout Session for the cart.
//
// The browser POSTs { items: { productId: qty } }. We price everything from the
// shared product list (never from the browser), create a Stripe-hosted Checkout
// Session that collects a US shipping address, and return its URL for the
// browser to redirect to. The Stripe SECRET key is read from the environment
// and never leaves the server.

const PRODUCTS = require("../../js/products.js");
const { buildLineItems } = require("./lib/cart");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, { error: "Checkout is not configured yet." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const items = body.items;
  const ref =
    typeof body.ref === "string"
      ? body.ref.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32)
      : "";

  let lineItems;
  try {
    lineItems = buildLineItems(items, PRODUCTS);
  } catch (err) {
    return json(400, { error: err.message });
  }

  const origin =
    (event.headers && (event.headers.origin || event.headers.Origin)) ||
    `https://${event.headers && event.headers.host}`;

  try {
    const stripe = require("stripe")(secret);
    const params = {
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,
    };
    // Credit a partner referral code (from a ?ref=CODE link) on the order so it
    // shows in the Stripe Dashboard on both the session and the payment.
    if (ref) {
      params.client_reference_id = ref;
      params.metadata = { referral: ref };
      params.payment_intent_data = { metadata: { referral: ref } };
    }
    const session = await stripe.checkout.sessions.create(params);
    return json(200, { url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return json(502, { error: "Sorry — checkout couldn't start. Please try again." });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
