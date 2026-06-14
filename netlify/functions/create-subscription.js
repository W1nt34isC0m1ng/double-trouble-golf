// Netlify serverless function: start a Trouble Club subscription.
//
// Creates a Stripe Checkout Session in "subscription" mode for the monthly
// Trouble Club plan ($49/mo, 2 dozen tour balls). Uses an inline recurring
// price so no Stripe Price object needs to be pre-created. Collects a US
// shipping address (we mail the balls monthly). Secret key stays server-side.

const PLAN = {
  amount: 4900, // $49.00/month in cents
  name: "Trouble Club — 2 dozen tour balls, monthly",
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(500, { error: "Subscriptions are not configured yet." });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid request." });
  }
  const ref =
    typeof body.ref === "string"
      ? body.ref.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32)
      : "";

  const origin =
    (event.headers && (event.headers.origin || event.headers.Origin)) ||
    `https://${event.headers && event.headers.host}`;

  try {
    const stripe = require("stripe")(secret);
    const params = {
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PLAN.amount,
            recurring: { interval: "month" },
            product_data: { name: PLAN.name },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel.html`,
    };
    if (ref) {
      params.client_reference_id = ref;
      params.subscription_data = { metadata: { referral: ref } };
    }
    const session = await stripe.checkout.sessions.create(params);
    return json(200, { url: session.url });
  } catch (err) {
    console.error("Stripe subscription error:", err.message);
    return json(502, { error: "Sorry — couldn't start the subscription. Please try again." });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
